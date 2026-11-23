
interface ForkFolderIconProps {
  className?: string;
  size?: number | string;
}

/**
 * ForkFolderIcon
 * Perfectly reproduces the user's reference image:
 * A folder with a darker tab in the back, an inner sheet/divider, a bright front flap,
 * and a Git Fork branch symbol embossed cleanly on the front flap.
 */
export function ForkFolderIcon({
  className = 'w-5 h-5',
  size,
}: ForkFolderIconProps) {
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
      {/* 1. Back Folder Body with Tab on Top Left (Darker Slate Blue / Accent) */}
      <path
        d="M56 80C56 66.7452 66.7452 56 80 56H208C221.255 56 232 66.7452 232 80V96H432C445.255 96 456 106.745 456 120V432C456 445.255 445.255 456 432 456H80C66.7452 456 56 445.255 56 432V80Z"
        fill="#3B74B4"
      />

      {/* 2. White / Off-White Inner Paper/Sheet poking out behind front flap */}
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
        fill="#2A5585"
        opacity="0.5"
      />

      {/* 4. Front Folder Flap (Rich Vibrant Blue) */}
      <rect
        x="56"
        y="160"
        width="400"
        height="288"
        rx="20"
        fill="#4F92E6"
      />

      {/* Bottom subtle edge shadow on folder base */}
      <path
        d="M60 440C60 444 64 448 72 448H440C448 448 452 444 452 440V448H60V440Z"
        fill="#1E3A5F"
        opacity="0.3"
      />

      {/* 5. Git Fork Emblem on Front Flap (Dark Navy from reference image) */}
      <g stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round">
        {/* Slanted main branch line going from top-left (x=216, y=232) to trunk node (x=240, y=268) */}
        <line x1="216" y1="232" x2="240" y2="268" strokeWidth="28" />

        {/* Straight vertical trunk going from (x=240, y=268) down to bottom circle (x=240, y=368) */}
        <line x1="240" y1="268" x2="240" y2="368" strokeWidth="28" />

        {/* Diagonal branch splitting from (x=240, y=268) to lower-right circle (x=306, y=328) */}
        <line x1="240" y1="268" x2="306" y2="328" strokeWidth="28" />

        {/* Circle 1: Upper junction/node */}
        <circle cx="240" cy="268" r="30" fill="#1E293B" strokeWidth="0" />

        {/* Circle 2: Bottom trunk circle */}
        <circle cx="240" cy="368" r="30" fill="#1E293B" strokeWidth="0" />

        {/* Circle 3: Right branch circle */}
        <circle cx="306" cy="328" r="30" fill="#1E293B" strokeWidth="0" />
      </g>
    </svg>
  );
}
