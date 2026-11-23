
interface SharedFolderIconProps {
  className?: string;
  size?: number | string;
}

/**
 * SharedFolderIcon
 * Unified 3D-styled folder design for "Shared Decks":
 * Dark slate blue tab, inner paper sheet, vibrant cyan/blue front flap,
 * and an embossed 3-person community silhouette emblem on the front flap.
 */
export function SharedFolderIcon({
  className = 'w-5 h-5',
  size,
}: SharedFolderIconProps) {
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
        fill="#0284C7"
      />

      {/* 2. White / Off-White Inner Paper/Sheet poking out behind front flap */}
      <rect
        x="80"
        y="120"
        width="352"
        height="100"
        rx="24"
        fill="#E0F2FE"
      />

      {/* 3. Shadow/Crease Line between back and front flap */}
      <path
        d="M56 184H456V200H56V184Z"
        fill="#0369A1"
        opacity="0.4"
      />

      {/* 4. Front Folder Flap (Rich Sky / Cyan Blue) */}
      <rect
        x="56"
        y="160"
        width="400"
        height="288"
        rx="20"
        fill="#38BDF8"
      />

      {/* Bottom subtle edge shadow on folder base */}
      <path
        d="M60 440C60 444 64 448 72 448H440C448 448 452 444 452 440V448H60V440Z"
        fill="#0C4A6E"
        opacity="0.3"
      />

      {/* 5. Embossed 3-People Group Silhouette on Front Flap */}
      <g fill="#0C4A6E">
        {/* Center User */}
        <circle cx="256" cy="272" r="32" />
        <path d="M208 376C208 338 230 326 256 326C282 326 304 338 304 376H208Z" />

        {/* Left User */}
        <circle cx="188" cy="286" r="24" />
        <path d="M150 376C150 348 168 338 188 338C198 338 206 342 214 348C210 356 208 366 208 376H150Z" />

        {/* Right User */}
        <circle cx="324" cy="286" r="24" />
        <path d="M362 376H304C304 366 302 356 298 348C306 342 314 338 324 338C344 338 362 348 362 376Z" />
      </g>
    </svg>
  );
}
