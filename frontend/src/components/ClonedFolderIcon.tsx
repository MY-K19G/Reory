
interface ClonedFolderIconProps {
  className?: string;
  size?: number | string;
}

/**
 * ClonedFolderIcon
 * Folder with a copy/cloned symbol design:
 * Vibrant emerald/green folder with an inner paper sheet and two overlapping copy/duplicate sheets
 * embossed cleanly on the front flap.
 */
export function ClonedFolderIcon({
  className = 'w-5 h-5',
  size,
}: ClonedFolderIconProps) {
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
      {/* 1. Back Folder Body with Tab on Top Left (Darker Emerald Green) */}
      <path
        d="M56 80C56 66.7452 66.7452 56 80 56H208C221.255 56 232 66.7452 232 80V96H432C445.255 96 456 106.745 456 120V432C456 445.255 445.255 456 432 456H80C66.7452 456 56 445.255 56 432V80Z"
        fill="#0D8A68"
      />

      {/* 2. White / Off-White Inner Paper/Sheet */}
      <rect
        x="80"
        y="120"
        width="352"
        height="100"
        rx="24"
        fill="#E5E7EB"
      />

      {/* 3. Shadow/Crease Line between back and front flap */}
      <path
        d="M56 184H456V200H56V184Z"
        fill="#085A43"
        opacity="0.5"
      />

      {/* 4. Front Folder Flap (Rich Vibrant Emerald / Mint Green) */}
      <rect
        x="56"
        y="160"
        width="400"
        height="288"
        rx="20"
        fill="#10B981"
      />

      {/* Bottom subtle edge shadow on folder base */}
      <path
        d="M60 440C60 444 64 448 72 448H440C448 448 452 444 452 440V448H60V440Z"
        fill="#064E3B"
        opacity="0.3"
      />

      {/* 5. Copy / Duplicate Symbol on Front (Dark Navy / Forest Green) */}
      {/* Back Copy Card Outline */}
      <rect
        x="240"
        y="235"
        width="95"
        height="115"
        rx="16"
        stroke="#064E3B"
        strokeWidth="28"
        strokeLinejoin="round"
      />

      {/* Front Copy Card (Solid + Outline) */}
      <rect
        x="180"
        y="285"
        width="95"
        height="115"
        rx="16"
        fill="#10B981"
        stroke="#064E3B"
        strokeWidth="28"
        strokeLinejoin="round"
      />
    </svg>
  );
}
