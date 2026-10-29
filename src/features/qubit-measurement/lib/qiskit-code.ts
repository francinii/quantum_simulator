import { BASES, STATES, stateLabel, type Setup } from './setup'

export interface QiskitLine {
  code: string
  comment?: string
}

// Comment-only lines carry their own "# ".
export function buildQiskitLines(setup: Setup): QiskitLine[] {
  const lines: QiskitLine[] = []
  const add = (code: string, comment?: string) => lines.push({ code, comment })
  const classicalBits = setup.m2 ? 2 : 1

  add('from qiskit import QuantumCircuit')
  add('')
  add(`qc = QuantumCircuit(1, ${classicalBits})`)
  add('', `# 1. Prepare ${stateLabel(setup)}`)

  const preparation = STATES[setup.state].code
  if (preparation) preparation.forEach((code) => add(code))
  else
    add(
      `qc.ry(${((setup.theta * Math.PI) / 180).toFixed(4)}, 0)`,
      `θ = ${setup.theta}°`,
    )

  const addMeasurement = (
    basis: keyof typeof BASES,
    bit: 0 | 1,
    step: number,
  ) => {
    add('', `# ${step}. Measure in the ${basis} basis → c${bit}`)
    BASES[basis].pre.forEach((code) => add(code, 'rotate basis to Z'))
    add(`qc.measure(0, ${bit})`)
    if (setup.m2 && bit === 0) {
      BASES[basis].post.forEach((code) => add(code, 'rotate back'))
    }
  }
  addMeasurement(setup.m1, 0, 2)
  if (setup.m2) addMeasurement(setup.m2, 1, 3)

  add('')
  add('', '# Run on a simulator, e.g. with qiskit_aer:')
  add('', '# counts = AerSimulator().run(qc, shots=1024).result().get_counts()')
  return lines
}

export const qiskitText = (lines: QiskitLine[]) =>
  lines
    .map(({ code, comment }) =>
      code ? (comment ? `${code}  # ${comment}` : code) : (comment ?? ''),
    )
    .join('\n')
