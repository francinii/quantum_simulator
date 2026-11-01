import { Card } from '@/shared/components/Card'
import { Formula } from '@/shared/components/Formula'
import { PanelHeader } from '@/shared/components/PanelHeader'
import { NotationBox } from './NotationBox'

const TINTED = 'bg-pink-wash border-pink-line'
const PLAIN = 'bg-surface border-edge'
const RING = 'ring-brand-pink-soft/50'

interface DiracPanelProps {
  visibleBoxes: number
}

export function DiracPanel({ visibleBoxes }: DiracPanelProps) {
  return (
    <Card className="flex flex-col justify-between p-5 lg:col-span-6">
      <div>
        <PanelHeader
          dotClass="bg-brand-pink"
          title="2. Approach: Dirac Notation (Bra-Ket)"
          titleClass="text-fuchsia"
          chip="Ket-Space"
          chipClass="bg-pink-wash text-pink-strong"
        />
        <div className="space-y-4">
          <NotationBox
            id="dirac-box-1"
            boxClass={TINTED}
            ringClass={RING}
            active={visibleBoxes >= 1}
            header="Joint Initial State"
            chip="|ψ₀⟩"
            chipClass="text-pink-strong"
            formulaClass="py-2 text-center text-xs sm:text-sm"
            tex={String.raw`|\psi_0\rangle = |0\rangle \otimes |0\rangle = |00\rangle`}
            note={
              <>
                In Dirac notation, the <Formula tex={String.raw`\otimes`} />{' '}
                symbol is typically omitted, writing concisely as{' '}
                <Formula tex="|00\rangle" />.
              </>
            }
          />
          <NotationBox
            id="dirac-box-2"
            boxClass={PLAIN}
            ringClass={RING}
            active={visibleBoxes >= 2}
            header="Action of Hadamard Gate on Basis States"
            chip="H|0⟩ = |+⟩"
            chipClass="text-purple-mid"
            formulaClass="py-1 text-center text-xs"
            tex={String.raw`H|0\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}} = |+\rangle`}
            note={
              <>
                The Hadamard gate maps the classical state{' '}
                <Formula tex="|0\rangle" /> into an equal superposition with
                identical phases (<Formula tex="+" />
                ).
              </>
            }
          />
          <NotationBox
            id="dirac-box-3"
            boxClass={PLAIN}
            ringClass={RING}
            active={visibleBoxes >= 3}
            header="Distributive Property of Tensor Product"
            chip="FOIL / Expansion"
            chipClass="text-emerald-deep"
            formulaClass="py-1 text-left text-xs leading-relaxed"
            tex={String.raw`\begin{aligned}
|\psi_1\rangle &= (H|0\rangle) \otimes (H|0\rangle) \\
&= \left(\frac{|0\rangle + |1\rangle}{\sqrt{2}}\right) \otimes \left(\frac{|0\rangle + |1\rangle}{\sqrt{2}}\right) \\
&= \frac{1}{2} \Big( |0\rangle(|0\rangle + |1\rangle) + |1\rangle(|0\rangle + |1\rangle) \Big) \\
&= \frac{1}{2} \big( |00\rangle + |01\rangle + |10\rangle + |11\rangle \big)
\end{aligned}`}
            note="Notice the elegance of Dirac notation! It doesn't require constructing 16-element matrices; expanding the binomials algebraically is sufficient."
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-edge-soft pt-3 text-[11px] text-faint">
        <span>Linearity in Hilbert space</span>
        <span className="text-brand-pink font-bold">
          Pure Algebraic Representation
        </span>
      </div>
    </Card>
  )
}
