type CuberfitMarkProps = {
  size?: number;
  className?: string;
};

/**
 * Reconstruction du mark Cuberfit (le "C" en deux tons) en SVG vectoriel.
 * Recréé à partir d'exports visuels du logo fournis par Harouna — pas le
 * fichier vectoriel d'origine. À remplacer par l'asset officiel si un
 * rendu pixel-perfect est nécessaire (ex: supports imprimés).
 */
export function CuberfitMark({ size = 32, className = "" }: CuberfitMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M 84.6,70 A 40,40 0 0 1 15.4,30 L 30.1,38.5 A 23,23 0 0 0 69.9,61.5 Z" fill="#3333CE" />
      <path d="M 15.4,30 A 40,40 0 0 1 70,15.4 L 61.5,30.1 A 23,23 0 0 0 30.1,38.5 Z" fill="#5E97E0" />
    </svg>
  );
}

export function CuberfitWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`} style={{ fontFamily: "var(--font-poppins)" }}>
      CUBERFIT
    </span>
  );
}

export function CuberfitLogo({ size = 28, className = "" }: CuberfitMarkProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <CuberfitMark size={size} />
      <CuberfitWordmark className="text-[15px] text-[#1B2340]" />
    </span>
  );
}
