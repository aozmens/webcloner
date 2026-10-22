import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import type { ImageAsset } from "./media";

export function PrimaryButton({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <a className="primary-btn " href={href} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
      {children}
      <div className="icon">
        <ArrowRight aria-hidden />
      </div>
    </a>
  );
}

export function LineElement({ children }: { children: ReactNode }) {
  return (
    <div className="line-element">
      <div />
      <span>{children}</span>
      <div />
    </div>
  );
}

type PictureProps = {
  image: ImageAsset;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  style?: React.CSSProperties;
};

/** next/image inside a <picture> wrapper: the ported animations target `picture` elements. */
export function Picture({ image, alt, className, sizes, priority, style }: PictureProps) {
  return (
    <picture>
      <Image src={image.src} alt={alt} width={image.width} height={image.height} className={className} sizes={sizes} priority={priority} style={style} />
    </picture>
  );
}

/** Rounded light tile for product renders, which are shot on white backgrounds. */
export function ProductThumb({ image, size = 96 }: { image?: ImageAsset; size?: number }) {
  return <span className="product-thumb">{image && <Image src={image.src} alt="" width={size} height={size} sizes={`${size}px`} />}</span>;
}
