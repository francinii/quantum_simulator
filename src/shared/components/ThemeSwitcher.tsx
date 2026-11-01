import { useTheme } from '@/shared/hooks/useTheme'
import { THEME_MODES, type ThemeMode } from '@/shared/lib/theme/theme-mode'

const LABELS: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

const ICONS: Record<ThemeMode, string> = {
  light:
    'M12 4V2m0 20v-2M4 12H2m20 0h-2M5.6 5.6 4.2 4.2m15.6 15.6-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  dark: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  system: 'M3 5h18v11H3zM8 20h8M12 16v4',
}

function ModeIcon({ mode }: { mode: ThemeMode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={ICONS[mode]} />
    </svg>
  )
}

interface ThemeSwitcherProps {
  /** Icon-only rail on desktop: the three options collapse into one cycling button. */
  collapsed: boolean
}

export function ThemeSwitcher({ collapsed }: ThemeSwitcherProps) {
  const { mode, setMode } = useTheme()
  const next = THEME_MODES[(THEME_MODES.indexOf(mode) + 1) % THEME_MODES.length]

  return (
    <>
      <div
        role="radiogroup"
        aria-label="Theme"
        className={`bg-neutral flex rounded-lg p-0.5 ${collapsed ? 'lg:hidden' : ''}`}
      >
        {THEME_MODES.map((option) => {
          const selected = option === mode
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setMode(option)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors ${
                selected
                  ? 'bg-surface text-ink shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <ModeIcon mode={option} />
              {LABELS[option]}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={() => setMode(next)}
        aria-label={`Theme: ${LABELS[mode]}. Switch to ${LABELS[next]}`}
        title={`Theme: ${LABELS[mode]}`}
        className={`text-muted hover:bg-blue-wash-hover hidden w-full items-center justify-center rounded-lg py-2 transition-colors ${
          collapsed ? 'lg:flex' : ''
        }`}
      >
        <ModeIcon mode={mode} />
      </button>
    </>
  )
}
