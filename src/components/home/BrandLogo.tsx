type BrandLogoProps = {
  variant?: 'mark' | 'lockup' | 'header'
  className?: string
  alt?: string
}

const logoUrl = '/image/baaaam-project-logo.jpeg'

export function BrandLogo({ variant = 'lockup', className = '', alt = '' }: BrandLogoProps) {
  if (variant === 'header') {
    return (
      <span
        className={`inline-flex h-10 shrink-0 items-center gap-2 ${className}`}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
      >
        <span className="relative block h-10 w-[4.25rem] shrink-0 overflow-hidden bg-white sm:w-[4.75rem]" aria-hidden="true">
          <img
            src={logoUrl}
            alt=""
            className="pointer-events-none absolute left-1/2 top-0 h-auto w-[128%] max-w-none -translate-x-1/2 -translate-y-[20%] select-none"
          />
        </span>
        <span aria-hidden="true" className="inline-flex h-full translate-y-px items-center whitespace-nowrap text-[0.63rem] font-black leading-none tracking-[0.11em] text-brand-strong sm:text-[0.82rem] sm:tracking-[0.16em]">
          PROJECT BAAAAM
        </span>
      </span>
    )
  }

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
