
interface ArchivedFolderIconProps {
  className?: string;
  size?: number | string;
}

/**
 * ArchivedFolderIcon
 * Perfectly matches the 3D-styled folder design:
 * Cool slate/charcoal tab in back, inner paper sheet, sleek slate gray front flap,
 * and an embossed archive box symbol on the front flap.
 */
export function ArchivedFolderIcon({
  className = 'w-5 h-5',
  size,
}: ArchivedFolderIconProps) {
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
      {/* 1. Back Folder Body with Tab on Top Left (Dark Slate Gray) */}
      <path
        d="M56 80C56 66.7452 66.7452 56 80 56H208C221.255 56 232 66.7452 232 80V96H432C445.255 96 456 106.745 456 120V432C456 445.255 445.255 456 432 456H80C66.7452 456 56 445.255 56 432V80Z"
        fill="#475569"
      />

      {/* 2. White / Off-White Inner Paper/Sheet poking out behind front flap */}
      <rect
        x="80"
        y="120"
        width="352"
        height="100"
        rx="24"
        fill="#E2E8F0"
      />

      {/* 3. Shadow/Crease Line between back and front flap */}
      <path
        d="M56 184H456V200H56V184Z"
        fill="#334155"
        opacity="0.5"
      />

      {/* 4. Front Folder Flap (Slate Gray) */}
      <rect
        x="56"
        y="160"
        width="400"
        height="288"
        rx="20"
        fill="#64748B"
      />

      {/* Bottom subtle edge shadow on folder base */}
      <path
        d="M60 440C60 444 64 448 72 448H440C448 448 452 444 452 440V448H60V440Z"
        fill="#1E293B"
        opacity="0.3"
      />

      {/* 5. Embossed Archive Drawer/Box Symbol on Front (Deep Navy / Charcoal) */}
      <g stroke="#0F172A" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Top Lid / Drawer Face */}
        <rect x="180" y="248" width="152" height="42" rx="10" fill="#0F172A" />

        {/* Lower Box Body */}
        <path d="M194 290V362C194 370 200 376 208 376H304C312 376 318 370 318 362V290" />

        {/* Handle Slot on Lower Box */}
        <line x1="236" y1="330" x2="276" y2="330" strokeWidth="20" />
      </g>
    </svg>
  );
}
