
interface MyDeckFolderIconProps {
  className?: string;
  size?: number | string;
}

/**
 * MyDeckFolderIcon
 * Unified 3D-styled folder design for "My Decks":
 * Indigo / Royal Blue folder with an inner document sheet
 * and an embossed personal User / Silhouette icon on the front flap.
 */
export function MyDeckFolderIcon({
  className = 'w-5 h-5',
  size,
}: MyDeckFolderIconProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* 1. Back Folder Body with Tab on Top Left (Deep Indigo) */}
      <path
        d="M56 80C56 66.7452 66.7452 56 80 56H208C221.255 56 232 66.7452 232 80V96H432C445.255 96 456 106.745 456 120V432C456 445.255 445.255 456 432 456H80C66.7452 456 56 445.255 56 432V80Z"
        fill="#4338CA"
      />

      {/* 2. White / Off-White Inner Paper/Sheet poking out behind front flap */}
      <rect
        x="80"
        y="120"
        width="352"
        height="100"
        rx="24"
        fill="#EEF2FF"
      />

      {/* 3. Shadow/Crease Line between back and front flap */}
      <path
        d="M56 184H456V200H56V184Z"
        fill="#312E81"
        opacity="0.4"
      />

      {/* 4. Front Folder Flap (Vibrant Indigo) */}
      <rect
        x="56"
        y="160"
        width="400"
        height="288"
        rx="20"
        fill="#6366F1"
      />

      {/* Bottom subtle edge shadow on folder base */}
      <path
        d="M60 440C60 444 64 448 72 448H440C448 448 452 444 452 440V448H60V440Z"
        fill="#1E1B4B"
        opacity="0.3"
      />

      {/* 5. Embossed Single User Profile Emblem on Front */}
      <g fill="#1E1B4B">
        {/* Head */}
        <circle cx="256" cy="272" r="38" />
        {/* Torso / Shoulders */}
        <path d="M192 376C192 334 220 324 256 324C292 324 320 334 320 376H192Z" />
      </g>
    </svg>
  );
}
