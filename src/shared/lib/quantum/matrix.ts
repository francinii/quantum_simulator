// Real matrices and vectors, enough for H, X and CNOT. Complex entries arrive when a gate needs them.
export type Vector = number[]
export type Matrix = number[][]

export const identity = (size: number): Matrix =>
  Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => (row === col ? 1 : 0)),
  )

export const transpose = (m: Matrix): Matrix =>
  m[0].map((_, col) => m.map((row) => row[col]))

export function matMul(a: Matrix, b: Matrix): Matrix {
  return a.map((row) =>
    b[0].map((_, col) =>
      row.reduce((sum, value, k) => sum + value * b[k][col], 0),
    ),
  )
}

export const matVec = (m: Matrix, v: Vector): Vector =>
  m.map((row) => row.reduce((sum, value, k) => sum + value * v[k], 0))

// Kronecker product of matrices: every entry of `a` scales a whole copy of `b`.
export function kron(a: Matrix, b: Matrix): Matrix {
  return a.flatMap((rowA) =>
    b.map((rowB) =>
      rowA.flatMap((valueA) => rowB.map((valueB) => valueA * valueB)),
    ),
  )
}

// Kronecker product of column vectors: every entry of `a` scales the whole of `b`.
export const kronVector = (a: Vector, b: Vector): Vector =>
  a.flatMap((valueA) => b.map((valueB) => valueA * valueB))

export const scaleMatrix = (m: Matrix, factor: number): Matrix =>
  m.map((row) => row.map((value) => value * factor))

export const scaleVector = (v: Vector, factor: number): Vector =>
  v.map((value) => value * factor)

// Born's rule on a state vector: the squared magnitude of each amplitude.
export const probabilities = (state: Vector): number[] =>
  state.map((amplitude) => amplitude * amplitude)

export function approxEqual(
  a: number[] | number[][],
  b: number[] | number[][],
  tolerance = 1e-9,
): boolean {
  if (a.length !== b.length) return false
  return a.every((item, index) => {
    const other = b[index]
    if (Array.isArray(item) && Array.isArray(other))
      return approxEqual(item, other, tolerance)
    return Math.abs((item as number) - (other as number)) <= tolerance
  })
}
