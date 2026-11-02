import { Component, Suspense, type ErrorInfo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface LoadBoundaryProps {
  children: ReactNode
}

interface LoadBoundaryState {
  failed: boolean
}

const frameClass = 'mx-auto w-full max-w-6xl flex-1'

function FailureView() {
  const { t } = useTranslation()

  return (
    <main className={frameClass} role="alert">
      <p className="text-sm text-muted">{t('load.failed')}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="bg-inverse mt-3 rounded-xl px-4 py-2 text-xs font-bold text-on-inverse shadow-xs transition-colors hover:bg-inverse-hover"
      >
        {t('load.reload')}
      </button>
    </main>
  )
}

function LoadingView() {
  const { t } = useTranslation()

  return (
    <main className={frameClass} role="status">
      <p className="text-sm text-muted">{t('load.loading')}</p>
    </main>
  )
}

class FailureBoundary extends Component<LoadBoundaryProps, LoadBoundaryState> {
  state: LoadBoundaryState = { failed: false }

  static getDerivedStateFromError(): LoadBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    return this.state.failed ? <FailureView /> : this.props.children
  }
}

// Catches both the loading wait (Suspense) and a failed chunk download (error boundary).
export function LoadBoundary({ children }: LoadBoundaryProps) {
  return (
    <FailureBoundary>
      <Suspense fallback={<LoadingView />}>{children}</Suspense>
    </FailureBoundary>
  )
}
