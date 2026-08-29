type BrandLogoProps = {
  variant?: 'mark' | 'lockup'
  className?: string
  alt?: string
}

const logoUrl = '/image/baaaam-project-logo.jpeg'

export function BrandLogo({ variant = 'lockup', className = '', alt = '' }: BrandLogoProps) {
  const isMark = variant === 'mark'

  return (
    <span
      className={`relative block shrink-0 overflow-hidden bg-white ${className}`}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
    >
      <img
        src={logoUrl}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-0 h-auto max-w-none -translate-x-1/2 select-none ${
          isMark ? 'w-[128%] -translate-y-[20%]' : 'w-[112%] -translate-y-[21%]'
        }`}
      />
    </span>
  )
}
