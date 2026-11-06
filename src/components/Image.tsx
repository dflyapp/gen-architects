type ImageProps = {
  src: string
  alt: string
  class?: string
  style?: string
  loading?: 'lazy' | 'eager'
}

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
    />
  )
}
