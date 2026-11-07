type ImageProps = {
  src: string
  alt: string
  class?: string
  style?: string
  loading?: 'lazy' | 'eager'
}

/**
 * Small `<img>` wrapper that enforces best practices for SEO and
 * accessibility: a meaningful `alt`, explicit dimensions where possible to
 * avoid layout shift, and lazy loading by default (except for above-the-fold
 * images, which should opt into `eager`).
 */
export default function Image({
  src,
  alt,
  class: className,
  style,
  loading = 'lazy',
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      class={className}
      style={style}
      loading={loading}
      decoding="async"
    />
  )
}
