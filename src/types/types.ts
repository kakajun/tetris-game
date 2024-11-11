export type Shape = number[][]

export interface Position {
  x: number
  y: number
}

export interface GameState {
  grid: number[][]
  currentPiece: Shape | null
  currentPosition: Position
  nextPiece: Shape | null
  score: number
  level: number
  isGameOver: boolean
  isPaused: boolean
}
