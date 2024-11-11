import React from 'react'
import styled from 'styled-components'

const StyledBoard = styled.div`
  display: grid;
  grid-template-rows: repeat(20, 30px);
  grid-template-columns: repeat(10, 30px);
  gap: 1px;
  background: #111;
  padding: 10px;
  border-radius: 5px;
`

const Cell = styled.div<{ value: number }>`
  width: 30px;
  height: 30px;
  border: 1px solid #333;
  background-color: ${(props) => {
    switch (props.value) {
      case 1:
        return '#00f0f0' // I
      case 2:
        return '#0000f0' // J
      case 3:
        return '#f0a000' // L
      case 4:
        return '#f0f000' // O
      case 5:
        return '#00f000' // S
      case 6:
        return '#a000f0' // T
      case 7:
        return '#f00000' // Z
      default:
        return '#000' // 空
    }
  }};
`

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
  // 创建一个合并了当前方块的临时网格用于显示
  const displayGrid = grid.map((row) => [...row])

  // 将当前方块合并到显示网格中
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
    <StyledBoard>
      {displayGrid.map((row, y) => row.map((cell, x) => <Cell key={`${y}-${x}`} value={cell} />))}
    </StyledBoard>
  )
}
