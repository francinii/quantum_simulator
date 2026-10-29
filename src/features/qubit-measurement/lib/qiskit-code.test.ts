import { buildQiskitLines, qiskitText } from './qiskit-code'
import type { Setup } from './setup'

const textFor = (
  state: Setup['state'],
  m1: Setup['m1'],
  m2: Setup['m2'] = null,
  theta = 60,
) => qiskitText(buildQiskitLines({ state, m1, m2, theta }))

const TAIL = [
  '',
  '# Run on a simulator, e.g. with qiskit_aer:',
  '# counts = AerSimulator().run(qc, shots=1024).result().get_counts()',
]

describe('Qiskit code', () => {
  it('Experiment 2: |+⟩ measured in Z', () => {
    expect(textFor('plus', 'Z')).toBe(
      [
        'from qiskit import QuantumCircuit',
        '',
        'qc = QuantumCircuit(1, 1)',
        '# 1. Prepare |+⟩',
        'qc.h(0)',
        '# 2. Measure in the Z basis → c0',
        'qc.measure(0, 0)',
        ...TAIL,
      ].join('\n'),
    )
  })

  it('Experiment 1: |0⟩ needs no gates', () => {
    expect(textFor('zero', 'Z')).toBe(
      [
        'from qiskit import QuantumCircuit',
        '',
        'qc = QuantumCircuit(1, 1)',
        '# 1. Prepare |0⟩',
        '# 2. Measure in the Z basis → c0',
        'qc.measure(0, 0)',
        ...TAIL,
      ].join('\n'),
    )
  })

  it('Experiment 3: measuring in X rotates the basis first', () => {
    expect(textFor('plus', 'X')).toBe(
      [
        'from qiskit import QuantumCircuit',
        '',
        'qc = QuantumCircuit(1, 1)',
        '# 1. Prepare |+⟩',
        'qc.h(0)',
        '# 2. Measure in the X basis → c0',
        'qc.h(0)  # rotate basis to Z',
        'qc.measure(0, 0)',
        ...TAIL,
      ].join('\n'),
    )
  })

  it('Experiment 4: two Z measurements use two classical bits', () => {
    expect(textFor('plus', 'Z', 'Z')).toBe(
      [
        'from qiskit import QuantumCircuit',
        '',
        'qc = QuantumCircuit(1, 2)',
        '# 1. Prepare |+⟩',
        'qc.h(0)',
        '# 2. Measure in the Z basis → c0',
        'qc.measure(0, 0)',
        '# 3. Measure in the Z basis → c1',
        'qc.measure(0, 1)',
        ...TAIL,
      ].join('\n'),
    )
  })

  it('Experiment 5: Z then X', () => {
    expect(textFor('zero', 'Z', 'X')).toBe(
      [
        'from qiskit import QuantumCircuit',
        '',
        'qc = QuantumCircuit(1, 2)',
        '# 1. Prepare |0⟩',
        '# 2. Measure in the Z basis → c0',
        'qc.measure(0, 0)',
        '# 3. Measure in the X basis → c1',
        'qc.h(0)  # rotate basis to Z',
        'qc.measure(0, 1)',
        ...TAIL,
      ].join('\n'),
    )
  })

  it('rotates the Y basis with S† and H, and back after the first measurement', () => {
    expect(textFor('plusI', 'Y', 'X')).toBe(
      [
        'from qiskit import QuantumCircuit',
        '',
        'qc = QuantumCircuit(1, 2)',
        '# 1. Prepare |+i⟩',
        'qc.h(0)',
        'qc.s(0)',
        '# 2. Measure in the Y basis → c0',
        'qc.sdg(0)  # rotate basis to Z',
        'qc.h(0)  # rotate basis to Z',
        'qc.measure(0, 0)',
        'qc.h(0)  # rotate back',
        'qc.s(0)  # rotate back',
        '# 3. Measure in the X basis → c1',
        'qc.h(0)  # rotate basis to Z',
        'qc.measure(0, 1)',
        ...TAIL,
      ].join('\n'),
    )
  })

  it('writes Ry(θ) in radians with four decimals and the angle as a comment', () => {
    const text = textFor('ry', 'Z', null, 60)
    expect(text).toContain('# 1. Prepare Ry(60°)|0⟩')
    expect(text).toContain('qc.ry(1.0472, 0)  # θ = 60°')
    expect(textFor('ry', 'Z', null, 180)).toContain(
      'qc.ry(3.1416, 0)  # θ = 180°',
    )
  })

  it.each([
    ['one', ['qc.x(0)']],
    ['minus', ['qc.x(0)', 'qc.h(0)']],
    ['minusI', ['qc.h(0)', 'qc.sdg(0)']],
  ] as const)('prepares %s with %j', (state, gates) => {
    const text = textFor(state, 'Z')
    for (const gate of gates) expect(text).toContain(gate)
  })

  it('keeps comments separate from code in the structured lines', () => {
    const lines = buildQiskitLines({
      state: 'plus',
      m1: 'X',
      m2: null,
      theta: 60,
    })
    expect(lines.find((l) => l.comment === 'rotate basis to Z')?.code).toBe(
      'qc.h(0)',
    )
  })
})
