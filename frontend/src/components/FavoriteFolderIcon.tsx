
interface FavoriteFolderIconProps {
  className?: string;
  size?: number | string;
}

/**
 * FavoriteFolderIcon
 * Perfectly matches the 3D-styled folder design:
 * Warm amber/gold folder tab in back, inner paper sheet, bright golden yellow front flap,
 * and an embossed star symbol in deep warm amber.
 */
export function FavoriteFolderIcon({
  className = 'w-5 h-5',
  size,
}: FavoriteFolderIconProps) {
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
      {/* 1. Back Folder Body with Tab on Top Left (Darker Amber) */}
      <path
        d="M56 80C56 66.7452 66.7452 56 80 56H208C221.255 56 232 66.7452 232 80V96H432C445.255 96 456 106.745 456 120V432C456 445.255 445.255 456 432 456H80C66.7452 456 56 445.255 56 432V80Z"
        fill="#D97706"
      />

      {/* 2. White / Off-White Inner Paper/Sheet poking out behind front flap */}
      <rect
        x="80"
        y="120"
        width="352"
        height="100"
        rx="24"
        fill="#FEF3C7"
      />

      {/* 3. Shadow/Crease Line between back and front flap */}
      <path
        d="M56 184H456V200H56V184Z"
        fill="#B45309"
        opacity="0.4"
      />

      {/* 4. Front Folder Flap (Rich Radiant Amber / Gold) */}
      <rect
        x="56"
        y="160"
        width="400"
        height="288"
        rx="20"
        fill="#F59E0B"
      />

      {/* Bottom subtle edge shadow on folder base */}
      <path
        d="M60 440C60 444 64 448 72 448H440C448 448 452 444 452 440V448H60V440Z"
        fill="#92400E"
        opacity="0.3"
      />

      {/* 5. Embossed Star Symbol on Front (Deep Warm Amber / Bronze) */}
      <path
        d="M256 230L278.4 283.4L336 288.5L292.2 326.6L305.4 383L256 352.5L206.6 383L219.8 326.6L176 288.5L233.6 283.4L256 230Z"
        fill="#78350F"
      />
    </svg>
  );
}
