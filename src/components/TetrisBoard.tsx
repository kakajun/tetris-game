import React, { useEffect, useState } from 'react'
import { PIECE_COLORS } from '../constants/tetrominos'
import { GameOverModal } from './GameOverModal'

interface TetrisBoardProps {
  grid: number[][]
  currentPiece: number[][] | null
  currentPosition: { x: number; y: number }
  isGameOver: boolean
  score: number
  onRestart: () => void
}

export const TetrisBoard: React.FC<TetrisBoardProps> = ({
  grid,
  currentPiece,
  currentPosition,
  isGameOver,
  score,
  onRestart
}) => {
  const displayGrid = grid.map((row) => [...row])
  const [showGameOver, setShowGameOver] = useState(false)

  useEffect(() => {
    if (isGameOver) {
      setShowGameOver(true)
    }
  }, [isGameOver])

  if (currentPiece) {
    for (let y = 0; y < currentPiece.length; y++) {
      for (let x = 0; x < currentPiece[y].length; x++) {
        if (currentPiece[y][x]) {
          const boardY = currentPosition.y + y
          const boardX = currentPosition.x + x
          if (boardY >= 0 && boardY < grid.length && boardX >= 0 && boardX < grid[0].length) {
            displayGrid[boardY][boardX] = currentPiece[y][x]
          }
        }
      }
    }
  }

  return (
    <div className="relative">
      <div className="grid grid-rows-[repeat(20,30px)] grid-cols-[repeat(10,30px)] gap-[1px] bg-[#111] p-2.5 rounded">
        {displayGrid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className="w-[30px] h-[30px] border-[1px] border-[#333]"
           
              style={{
                backgroundColor: cell ? PIECE_COLORS[3] : '#000',
                transition: 'background-color 0.1s'
              }}
            />
          ))
        )}
      </div>

      {showGameOver && <GameOverModal score={score} onRestart={onRestart} />}
    </div>
  )
}
