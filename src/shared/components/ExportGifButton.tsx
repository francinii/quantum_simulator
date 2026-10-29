interface ExportGifButtonProps {
  label: string
  disabled: boolean
  onClick: () => void
}

export function ExportGifButton({
  label,
  disabled,
  onClick,
}: ExportGifButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="bg-ink flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-slate-800 disabled:opacity-50"
    >
      <svg
        className="text-brand-pink-soft h-4 w-4"
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
