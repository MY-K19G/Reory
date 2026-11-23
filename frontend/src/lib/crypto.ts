/**
 * Client-Side Zero-Knowledge Cryptography & BYOK Storage
 * 
 * Guarantees:
 * 1. AES-GCM 256-bit encryption performed strictly inside the browser.
 * 2. PBKDF2 key derivation with 100,000 iterations and cryptographic salt.
 * 3. Raw API keys NEVER leave the browser in plaintext.
 * 4. Zero-knowledge encrypted sync packages are opaque to any backend/database.
 */

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  salt: string;
  version: number;
}

export type StorageMode = 'local' | 'cloud';

const STORAGE_KEYS = {
  GEMINI_KEY: 'duocard_gemini_key',
  GEMINI_MODEL: 'duocard_gemini_model',
  STORAGE_MODE: 'duocard_api_storage_mode',
  ENCRYPTED_SYNC: 'duocard_api_encrypted_sync',
  PASS_HINT: 'duocard_api_has_passphrase',
};

// Convert buffer to hex string
function bufToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < byteArray.length; i++) {
    hex += byteArray[i].toString(16).padStart(2, '0');
  }
  return hex;
}

// Convert hex string to Uint8Array
function hexToBuf(hex: string): Uint8Array {
  const tokens = hex.match(/.{1,2}/g) || [];
  const u8 = new Uint8Array(tokens.length);
  for (let i = 0; i < tokens.length; i++) {
    u8[i] = parseInt(tokens[i], 16);
  }
  return u8;
}

// Derive AES-GCM CryptoKey from user passphrase + salt
async function deriveKey(passphrase: string, saltBytes: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt an API key in the browser using AES-GCM 256-bit
 */
export async function encryptApiKey(plaintext: string, secretPassphrase: string): Promise<EncryptedPayload> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    throw new Error('WebCrypto API is not supported in this environment');
  }

  const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
  const ivBytes = window.crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(secretPassphrase, saltBytes);
  const enc = new TextEncoder();
  const plaintextBytes = enc.encode(plaintext);

  const ciphertextBuf = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes as unknown as BufferSource,
    },
    key,
    plaintextBytes
  );

  return {
    ciphertext: bufToHex(ciphertextBuf),
    iv: bufToHex(ivBytes.buffer),
    salt: bufToHex(saltBytes.buffer),
    version: 1,
  };
}

/**
 * Decrypt an API key in the browser using AES-GCM 256-bit
 */
export async function decryptApiKey(payload: EncryptedPayload, secretPassphrase: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    throw new Error('WebCrypto API is not supported in this environment');
  }

  const saltBytes = hexToBuf(payload.salt);
  const ivBytes = hexToBuf(payload.iv);
  const ciphertextBytes = hexToBuf(payload.ciphertext);

  const key = await deriveKey(secretPassphrase, saltBytes);

  try {
    const decryptedBuf = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBytes as unknown as BufferSource,
      },
      key,
      ciphertextBytes as unknown as BufferSource
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuf);
  } catch (err) {
    throw new Error('Incorrect decryption passphrase or corrupted key bundle');
  }
}

/**
 * High-level BYOK Storage & Retrieval Helper
 */
export const ByokStorage = {
  getMode(): StorageMode {
    if (typeof window === 'undefined') return 'local';
    return (localStorage.getItem(STORAGE_KEYS.STORAGE_MODE) as StorageMode) || 'local';
  },

  setMode(mode: StorageMode) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.STORAGE_MODE, mode);
  },

  /**
   * Save key locally only
   */
  saveLocal(key: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key.trim());
    localStorage.setItem(STORAGE_KEYS.STORAGE_MODE, 'local');
    localStorage.removeItem(STORAGE_KEYS.ENCRYPTED_SYNC);
  },

  /**
   * Save encrypted sync package (both in local storage and synced to cloud database)
   */
  async saveEncryptedCloud(key: string, userPassphrase: string, preferredModel?: string): Promise<EncryptedPayload> {
    const payload = await encryptApiKey(key.trim(), userPassphrase);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key.trim());
      localStorage.setItem(STORAGE_KEYS.STORAGE_MODE, 'cloud');
      localStorage.setItem(STORAGE_KEYS.ENCRYPTED_SYNC, JSON.stringify(payload));
      localStorage.setItem(STORAGE_KEYS.PASS_HINT, 'true');

      // Sync encrypted payload to PostgreSQL database
      const userIdentifier = localStorage.getItem('duocard_user_id') || localStorage.getItem('duocard_username') || 'default_user';
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
        await fetch(`${apiBase}/sync/key`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userIdentifier,
            ciphertext: payload.ciphertext,
            iv: payload.iv,
            salt: payload.salt,
            version: payload.version,
            preferredModel: preferredModel || 'gemini-3.5-flash-lite',
          }),
        });
      } catch (err) {
        console.warn('Could not sync encrypted key to cloud backend:', err);
      }
    }
    return payload;
  },

  /**
   * Fetch encrypted key package from cloud database (for other devices)
   */
  async fetchEncryptedCloud(): Promise<{ payload: EncryptedPayload; preferredModel?: string } | null> {
    if (typeof window === 'undefined') return null;
    const userIdentifier = localStorage.getItem('duocard_user_id') || localStorage.getItem('duocard_username') || 'default_user';
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const res = await fetch(`${apiBase}/sync/key?userIdentifier=${encodeURIComponent(userIdentifier)}`);
      if (res.ok) {
        const data = await res.json();
        return {
          payload: {
            ciphertext: data.ciphertext,
            iv: data.iv,
            salt: data.salt,
            version: data.version,
          },
          preferredModel: data.preferredModel,
        };
      }
    } catch (err) {
      console.warn('Could not fetch encrypted key from backend:', err);
    }
    return null;
  },

  /**
   * Retrieve active plain API key currently available on this machine
   */
  getPlainKey(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '';
  },

  /**
   * Check if an encrypted cloud package is stored
   */
  getEncryptedPackage(): EncryptedPayload | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_SYNC);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Clear all stored API key and encryption data
   */
  clearAll() {
    if (typeof window === 'undefined') return;
    const userIdentifier = localStorage.getItem('duocard_user_id') || localStorage.getItem('duocard_username') || 'default_user';
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
    fetch(`${apiBase}/sync/key?userIdentifier=${encodeURIComponent(userIdentifier)}`, { method: 'DELETE' }).catch(() => {});

    localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
    localStorage.removeItem(STORAGE_KEYS.STORAGE_MODE);
    localStorage.removeItem(STORAGE_KEYS.ENCRYPTED_SYNC);
    localStorage.removeItem(STORAGE_KEYS.PASS_HINT);
  },

  /**
   * Retrieve active model currently selected for Gemini (defaults to 'gemini-2.5-flash')
   */
  getModel(): string {
    if (typeof window === 'undefined') return 'gemini-3.5-flash-lite';
    return localStorage.getItem(STORAGE_KEYS.GEMINI_MODEL) || 'gemini-3.5-flash-lite';
  },

  /**
   * Save selected model
   */
  setModel(model: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.GEMINI_MODEL, model.trim());
  },

  /**
   * Quick connection test to Gemini to verify key validity
   */
  async testGeminiKey(apiKey: string, selectedModel: string = 'gemini-3.5-flash-lite'): Promise<{ success: boolean; message: string; model?: string }> {
    if (!apiKey || apiKey.trim().length < 10) {
      return { success: false, message: 'Please enter a valid Gemini API key.' };
    }

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with the single word: OK' }] }],
          }),
        }
      );

      if (res.ok) {
        return { success: true, message: `Connected successfully using ${selectedModel}!`, model: selectedModel };
      }

      // Try fallback model if 2.0-flash is restricted
      const fallbackRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Ping' }] }],
          }),
        }
      );

      if (fallbackRes.ok) {
        return { success: true, message: 'Connected successfully to Google Gemini (1.5 Flash)!', model: 'gemini-1.5-flash' };
      }

      const errJson = await res.json().catch(() => ({}));
      const reason = errJson?.error?.message || `HTTP ${res.status}: Invalid API Key or quota exceeded`;
      return { success: false, message: reason };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Network error communicating with Google AI Studio' };
    }
  },
};
