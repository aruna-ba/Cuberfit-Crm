import Image from "next/image";

type CuberfitMarkProps = {
  size?: number;
  className?: string;
};

/**
 * Fichier réel du logo Cuberfit, déposé par Harouna et recadré depuis
 * public/brand/cuberfit-logo-source.png (fond transparent).
 */
export function CuberfitMark({ size = 32, className = "" }: CuberfitMarkProps) {
  return (
    <Image
      src="/brand/cuberfit-icon.png"
      alt="Cuberfit"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}

export function CuberfitWordmark({ height = 14, className = "" }: { height?: number; className?: string }) {
  // Ratio réel du fichier source (2945x400)
  const width = Math.round(height * (2945 / 400));
  return (
    <Image
      src="/brand/cuberfit-wordmark.png"
      alt="Cuberfit"
      width={width}
      height={height}
      className={className}
    />
  );
}

export function CuberfitLogo({ size = 28, className = "" }: CuberfitMarkProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <CuberfitMark size={size} />
      <CuberfitWordmark height={Math.round(size * 0.42)} />
    </span>
  );
}
