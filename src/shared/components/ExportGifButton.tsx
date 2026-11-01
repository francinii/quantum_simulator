interface ExportGifButtonProps {
  label: string
  disabled: boolean
  onClick: () => void
  variant?: 'solid' | 'block' | 'gradient'
}

const VARIANTS = {
  solid:
    'bg-inverse flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-on-inverse shadow-xs transition-colors hover:bg-inverse-hover disabled:opacity-50',
  block:
    'bg-inverse flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-on-inverse shadow transition-colors hover:bg-inverse-hover disabled:opacity-50',
  gradient:
    'from-brand-pink-soft via-brand-purple to-brand-blue flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r px-4 py-2.5 text-xs font-bold text-on-brand shadow-md transition-opacity hover:opacity-95 disabled:opacity-50',
}

export function ExportGifButton({
  label,
  disabled,
  onClick,
  variant = 'solid',
}: ExportGifButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={VARIANTS[variant]}
    >
      <svg
        className={`h-4 w-4 ${variant === 'gradient' ? '' : 'text-brand-pink-soft'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      <span>{label}</span>
    </button>
  )
}
