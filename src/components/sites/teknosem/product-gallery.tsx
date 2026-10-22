"use client";

import Image from "next/image";
import { useState } from "react";
import type { ImageAsset } from "./media";

export function ProductGallery({ images, name }: { images: ImageAsset[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];
  if (!current) return <div className="product-gallery" />;

  return (
    <div className="product-gallery">
      <div className="gallery-main">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt || `${name} — görsel ${active + 1}`}
          width={current.width}
          height={current.height}
          sizes="(orientation: portrait) 92vw, 46vw"
          priority={active === 0}
        />
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs" role="tablist" aria-label={`${name} görselleri`}>
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Görsel ${index + 1}`}
              className={index === active ? "active" : undefined}
              onClick={() => setActive(index)}
            >
              <Image src={image.src} alt="" width={160} height={160} sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
