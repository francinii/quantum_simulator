import { Card } from '@/shared/components/Card'
import { Formula } from '@/shared/components/Formula'
import { PanelHeader } from '@/shared/components/PanelHeader'
import { NotationBox } from './NotationBox'

const TINTED = 'bg-surface-preview border-blue-100'
const PLAIN = 'bg-white border-slate-200'
const RING = 'ring-brand-blue/40'

interface MatrixPanelProps {
  visibleBoxes: number
}

export function MatrixPanel({ visibleBoxes }: MatrixPanelProps) {
  return (
    <Card className="flex flex-col justify-between p-5 lg:col-span-6">
      <div>
        <PanelHeader
          dotClass="bg-brand-blue"
          title="1. Approach: Matrix Notation"
          titleClass="text-brand-sky"
          chip="ℂ⁴ Space"
          chipClass="bg-blue-50 text-brand-sky"
        />
        <div className="space-y-4">
          <NotationBox
            id="matrix-box-1"
            boxClass={TINTED}
            ringClass={RING}
            active={visibleBoxes >= 1}
            header="Basis Vectors & Tensor Product (Kronecker)"
            chip="v₀ ⊗ v₁"
            chipClass="text-blue-500"
            formulaClass="py-2 text-center text-xs sm:text-sm"
            tex={String.raw`\begin{bmatrix} 1 \\ 0 \end{bmatrix} \otimes \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \cdot \begin{bmatrix} 1 \\ 0 \end{bmatrix} \\ 0 \cdot \begin{bmatrix} 1 \\ 0 \end{bmatrix} \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \\ 0 \\ 0 \end{bmatrix}`}
            note={
              <>
                Each element of the first vector scales the second vector. The
                initial composite state has amplitude <Formula tex="1.0" />{' '}
                exclusively in the <Formula tex="|00\rangle" /> component.
              </>
            }
          />
          <NotationBox
            id="matrix-box-2"
            boxClass={PLAIN}
            ringClass={RING}
            active={visibleBoxes >= 2}
            header={
              <>
                Global Quantum Operator Construction:{' '}
                <Formula tex="H \otimes H" />
              </>
            }
            chip="4x4 Matrix"
            chipClass="text-pink-600"
            formulaClass="py-1 text-center text-xs"
            tex={String.raw`(H \otimes H) = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix} \otimes \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix} = \frac{1}{2} \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & -1 & 1 & -1 \\ 1 & 1 & -1 & -1 \\ 1 & -1 & -1 & 1 \end{bmatrix}`}
            note={
              <>
                The global scalar factor is{' '}
                <Formula
                  tex={String.raw`\frac{1}{\sqrt{2}} \times \frac{1}{\sqrt{2}} = \frac{1}{2}`}
                />
                . Each subblock reflects constructive (<Formula tex="+1" />) and
                destructive (<Formula tex="-1" />) interference.
              </>
            }
          />
          <NotationBox
            id="matrix-box-3"
            boxClass={PLAIN}
            ringClass={RING}
            active={visibleBoxes >= 3}
            header={
              <>
                Matrix-Vector Multiplication:{' '}
                <Formula
                  tex={String.raw`|\psi_1\rangle = U_{H\otimes H} \cdot |\psi_0\rangle`}
                />
              </>
            }
            chip="Column 1"
            chipClass="text-emerald-600"
            formulaClass="py-1 text-center text-xs"
            tex={String.raw`\frac{1}{2} \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & -1 & 1 & -1 \\ 1 & 1 & -1 & -1 \\ 1 & -1 & -1 & 1 \end{bmatrix} \begin{bmatrix} 1 \\ 0 \\ 0 \\ 0 \end{bmatrix} = \frac{1}{2} \begin{bmatrix} 1 \\ 1 \\ 1 \\ 1 \end{bmatrix}`}
            note={
              <>
                Multiplying by the canonical basis vector{' '}
                <Formula tex="[1, 0, 0, 0]^T" /> directly extracts the{' '}
                <strong>first column</strong> of the{' '}
                <Formula tex={String.raw`4 \times 4`} /> Hadamard matrix.
              </>
            }
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
        <span>
          Hilbert Dimension: <Formula tex="2^n = 2^2 = 4" />
        </span>
        <span className="text-brand-sky font-bold">
          Unitary Linear Operation
        </span>
      </div>
    </Card>
  )
}
