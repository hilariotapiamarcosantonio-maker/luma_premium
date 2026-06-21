import Image from 'next/image';
import type { MarketingImage } from '@/data/marketing-images';

// Figura editorial con next/image: imagen contextual con overlay oscuro
// coherente con la identidad y un caption opcional. Stock provisional.

export default function EditorialFigure({
  image,
  locale = 'es',
  caption,
  priority = false,
  className = '',
  rounded = 'rounded-2xl',
  aspect = 'aspect-[16/10]',
}: {
  image: MarketingImage;
  locale?: 'es' | 'en';
  caption?: string;
  priority?: boolean;
  className?: string;
  rounded?: string;
  aspect?: string;
}) {
  return (
    <figure
      className={`group relative overflow-hidden border border-slate-800 ${rounded} ${aspect} ${className}`}
    >
      <Image
        src={image.src}
        alt={image.alt[locale]}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={priority}
        className="object-cover opacity-95 brightness-110 contrast-105 saturate-105 transition-transform duration-700 group-hover:scale-[1.03]"
      />
      {/* Overlay sutil: profundidad sin apagar la imagen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-950/15 to-transparent" />
      {/* Refuerzo de legibilidad solo donde va el caption */}
      {caption && (
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950/85 to-transparent" />
      )}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
      {caption && (
        <figcaption className="absolute bottom-4 left-4 right-4">
          <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-slate-950/80 px-3 py-1.5 text-[11px] font-medium text-amber-400/90 backdrop-blur-sm">
            {caption}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
