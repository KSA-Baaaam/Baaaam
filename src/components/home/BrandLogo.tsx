type BrandLogoProps = {
  variant?: 'mark' | 'lockup' | 'header'
  className?: string
  alt?: string
}

const logoUrl = '/image/baaaam-project-logo.png'

export function BrandLogo({ variant = 'lockup', className = '', alt = '' }: BrandLogoProps) {
  if (variant === 'header') {
    return (
      <span
        className={`relative block aspect-[1.8/1] shrink-0 overflow-hidden ${className}`}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
      >
        <img
          src={logoUrl}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-auto w-[112%] max-w-none -translate-x-1/2 -translate-y-[21%] select-none"
        />
      </span>
    )
  }

  const isMark = variant === 'mark'

  return (
    <span
      className={`relative block shrink-0 overflow-hidden ${className}`}
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
