/**
 * SVG flag icons for language switcher.
 * Replaces emoji flags for consistent cross-platform rendering.
 * Each flag is a simplified 4:3 SVG — lightweight and crisp at any size.
 */

interface FlagIconProps {
  code: string;
  className?: string;
}

function SpainFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={className} role="img" aria-label="Español">
      <rect width="640" height="480" fill="#c60b1e" />
      <rect width="640" height="240" y="120" fill="#ffc400" />
    </svg>
  );
}

function USFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={className} role="img" aria-label="English">
      <rect width="640" height="480" fill="#fff" />
      <g fill="#b22234">
        {[0, 2, 4, 6, 8, 10, 12].map((i) => (
          <rect key={i} width="640" height={Math.round(480 / 13)} y={Math.round((480 / 13) * i)} />
        ))}
      </g>
      <rect width="256" height={Math.round((480 / 13) * 7)} fill="#3c3b6e" />
    </svg>
  );
}

function RussiaFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 480" className={className} role="img" aria-label="Русский">
      <rect width="640" height="160" fill="#fff" />
      <rect width="640" height="160" y="160" fill="#0039a6" />
      <rect width="640" height="160" y="320" fill="#d52b1e" />
    </svg>
  );
}

const FLAGS: Record<string, React.ComponentType<{ className?: string }>> = {
  ES: SpainFlag,
  US: USFlag,
  RU: RussiaFlag,
};

export default function FlagIcon({ code, className = "w-5 h-4 rounded-sm inline-block" }: FlagIconProps) {
  const Flag = FLAGS[code];
  if (!Flag) return null;
  return <Flag className={className} />;
}
