import Image from 'next/image';

interface ChurchLogoProps {
  /**
   * 'icon-red'     → ícone vermelho dentro de círculo branco (hero/dark bg)
   * 'icon-white'   → ícone preto com invert(1) = branco (dark bg sem container)
   * 'vertical'     → logo vertical com invert(1) = branco para footer escuro
   * 'horizontal'   → logo horizontal colorida para fundo claro
   */
  variant?: 'icon-red' | 'icon-white' | 'vertical' | 'horizontal';
  size?: number;
  className?: string;
}

export default function ChurchLogo({
  variant = 'icon-red',
  size = 64,
  className = '',
}: ChurchLogoProps) {
  if (variant === 'icon-red') {
    // Ícone vermelho dentro de um círculo branco — perfeito para fundos escuros
    const containerSize = size;
    const imgSize = Math.round(size * 0.85);
    return (
      <div
        className={`rounded-full bg-white flex items-center justify-center flex-shrink-0 ${className}`}
        style={{
          width: containerSize,
          height: containerSize,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 8px 32px rgba(204,26,26,0.3), 0 0 60px rgba(204,26,26,0.15)',
          padding: Math.round(size * 0.075),
        }}
      >
        <Image
          src="/IMG_9077.png"
          alt="Essência da Adoração"
          width={imgSize}
          height={imgSize}
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    );
  }

  if (variant === 'icon-white') {
    // Ícone preto invertido → branco (sem container)
    return (
      <Image
        src="/IMG_9076.png"
        alt="Essência da Adoração"
        width={size}
        height={size}
        className={className}
        style={{ objectFit: 'contain', filter: 'invert(1)' }}
        priority
      />
    );
  }

  if (variant === 'vertical') {
    // Logo vertical preta invertida → branca (para footer escuro)
    return (
      <Image
        src="/IMG_9069.png"
        alt="Essência da Adoração — Assembleia de Deus"
        width={size}
        height={Math.round(size * 1.35)}
        className={className}
        style={{ objectFit: 'contain', filter: 'invert(1)' }}
      />
    );
  }

  // horizontal — colorida para fundo claro
  return (
    <Image
      src="/IMG_9075.png"
      alt="Essência da Adoração — Assembleia de Deus"
      width={size}
      height={Math.round(size * 0.38)}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
