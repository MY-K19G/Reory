
interface AllFolderIconProps {
  className?: string;
  size?: number | string;
  primaryColor?: string;
}

/**
 * AllFolderIcon
 * Unified 3D-styled folder design for "All Decks":
 * Uses the active theme accent (or terracotta coral by default) with an inner paper sheet
 * and an embossed layered deck/cards icon on the front flap.
 */
export function AllFolderIcon({
  className = 'w-5 h-5',
  size,
  primaryColor = '#ea7a54',
}: AllFolderIconProps) {
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
      {/* 1. Back Folder Body with Tab on Top Left */}
      <path
        d="M56 80C56 66.7452 66.7452 56 80 56H208C221.255 56 232 66.7452 232 80V96H432C445.255 96 456 106.745 456 120V432C456 445.255 445.255 456 432 456H80C66.7452 456 56 445.255 56 432V80Z"
        fill="#C85A34"
      />

      {/* 2. White / Off-White Inner Paper/Sheet poking out behind front flap */}
      <rect
        x="80"
        y="120"
        width="352"
        height="100"
        rx="24"
        fill="#FFF1EB"
      />

      {/* 3. Shadow/Crease Line between back and front flap */}
      <path
        d="M56 184H456V200H56V184Z"
        fill="#9E3B18"
        opacity="0.4"
      />

      {/* 4. Front Folder Flap (Primary Accent / Vibrant Coral Terracotta) */}
      <rect
        x="56"
        y="160"
        width="400"
        height="288"
        rx="20"
        fill={primaryColor}
      />

      {/* Bottom subtle edge shadow on folder base */}
      <path
        d="M60 440C60 444 64 448 72 448H440C448 448 452 444 452 440V448H60V440Z"
        fill="#7C2D12"
        opacity="0.3"
      />

      {/* 5. Embossed Stack / Decks Emblem on Front */}
      <g stroke="#7C2D12" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Back Card Top Line */}
        <path d="M200 248H312" />
        {/* Middle Card Top Line */}
        <path d="M184 278H328" />
        {/* Front Main Card */}
        <rect x="176" y="308" width="160" height="72" rx="14" fill="#7C2D12" />
      </g>
    </svg>
  );
}
