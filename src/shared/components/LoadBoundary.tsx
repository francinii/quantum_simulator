import { Component, Suspense, type ErrorInfo, type ReactNode } from 'react'

interface LoadBoundaryProps {
  children: ReactNode
}

interface LoadBoundaryState {
  failed: boolean
}

const frameClass = 'mx-auto w-full max-w-6xl flex-1'

class FailureBoundary extends Component<LoadBoundaryProps, LoadBoundaryState> {
  state: LoadBoundaryState = { failed: false }

  static getDerivedStateFromError(): LoadBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <main className={frameClass} role="alert">
        <p className="text-sm text-muted">
          This simulation could not be loaded. Check your connection, or the
          site may have been updated.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-inverse mt-3 rounded-xl px-4 py-2 text-xs font-bold text-on-inverse shadow-xs transition-colors hover:bg-inverse-hover"
        >
          Reload page
        </button>
      </main>
    )
  }
}

// Catches both the loading wait (Suspense) and a failed chunk download (error boundary).
export function LoadBoundary({ children }: LoadBoundaryProps) {
  return (
    <FailureBoundary>
      <Suspense
        fallback={
          <main className={frameClass} role="status">
            <p className="text-sm text-muted">Loading simulation…</p>
          </main>
        }
      >
        {children}
      </Suspense>
    </FailureBoundary>
  )
}
