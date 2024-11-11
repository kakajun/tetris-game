import React from 'react'

// 定义颜色映射对象，方便管理不同方块的颜色
const PIECE_COLORS = {
  1: '#00f0f0', // I
  2: '#0000f0', // J
  3: '#f0a000', // L
  4: '#f0f000', // O
  5: '#00f000', // S
  6: '#a000f0', // T
  7: '#f00000', // Z
  0: '#000' // 空
}

interface TetrisBoardProps {
  grid: number[][]
  currentPiece: number[][] | null
  currentPosition: { x: number; y: number }
}

export const TetrisBoard: React.FC<TetrisBoardProps> = ({
  grid,
  currentPiece,
  currentPosition
}) => {
  const displayGrid = grid.map((row) => [...row])

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
    // StyledBoard styles
    <div className="grid grid-rows-[repeat(20,30px)] grid-cols-[repeat(10,30px)] gap-[1px] bg-[#111] p-2.5 rounded">
      {displayGrid.map((row, y) =>
        row.map((cell, x) => (
          // Cell styles
          <div
            key={`${y}-${x}`}
            className="w-[30px] h-[30px] border-[1px] border-[#333]"
            style={{ backgroundColor: PIECE_COLORS[cell as keyof typeof PIECE_COLORS] }}
          />
        ))
      )}
    </div>
  )
}
