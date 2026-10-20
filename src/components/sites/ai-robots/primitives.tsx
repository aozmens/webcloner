import type { ReactNode } from "react";
import { asset } from "./data";
import type { PictureData } from "./pictures";

type PictureProps = {
  data: PictureData;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
};

export function Picture({ data, alt, className, loading = "lazy", fetchPriority = "auto" }: PictureProps) {
  return (
    <picture>
      {data.sources.map((source) => (
        <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={source.sizes ?? data.sizes} />
      ))}
      <img
        src={data.src}
        srcSet={data.srcSet}
        sizes={data.sizes}
        alt={alt}
        width={data.width}
        height={data.height}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
      />
    </picture>
  );
}

type PrimaryButtonProps = {
  href?: string;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export function PrimaryButton({ href, children, disabled, onClick }: PrimaryButtonProps) {
  const icon = (
    <div className="icon">
      <img src={asset("/icons/arrow_right.svg")} alt="Arrow pointing right" width={22} height={17} />
    </div>
  );

  if (href) {
    return (
      <a className="primary-btn " href={href}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <button type="button" className="primary-btn " disabled={disabled} onClick={onClick}>
      {children}
      {icon}
    </button>
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
