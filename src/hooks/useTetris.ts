import { useState, useCallback, useEffect } from 'react'
import { SHAPES } from '../constants/tetrominos'
import { GameState, Shape, Position } from '../types/types'

const GRID_WIDTH = 10
const GRID_HEIGHT = 20

// 添加计分规则常量
const SCORE_TABLE = {
  SINGLE: 100, // 消除 1 行
  DOUBLE: 300, // 消除 2 行
  TRIPLE: 500, // 消除 3 行
  TETRIS: 800 // 消除 4 行
} as const

// 计算分数的方法
const calculateScore = (lines: number): number => {
  switch (lines) {
    case 1:
      return SCORE_TABLE.SINGLE
    case 2:
      return SCORE_TABLE.DOUBLE
    case 3:
      return SCORE_TABLE.TRIPLE
    case 4:
      return SCORE_TABLE.TETRIS
    default:
      return 0
  }
}

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>({
    grid: Array(GRID_HEIGHT).fill(Array(GRID_WIDTH).fill(0)),
    currentPiece: null,
    currentPosition: { x: 0, y: 0 },
    nextPiece: null,
    score: 0,
    level: 1,
    isGameOver: true,
    isPaused: false
  })

  const createEmptyGrid = useCallback(
    () =>
      Array(GRID_HEIGHT)
        .fill(null)
        .map(() => Array(GRID_WIDTH).fill(0)),
    []
  )

  const generateNewPiece = useCallback((): Shape => {
    const shapes = Object.values(SHAPES).map((shape) => shape.map((row) => [...row]))
    return shapes[Math.floor(Math.random() * shapes.length)]
  }, [])

  // 修改 isValidMove 函数
  const isValidMove = useCallback(
    (position: Position, piece: Shape): boolean => {
      console.log('Checking move validity', { position, piece }) // 添加调试日志
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x]) {
            const newX = position.x + x
            const newY = position.y + y
            if (
              newX < 0 ||
              newX >= GRID_WIDTH ||
              newY >= GRID_HEIGHT ||
              (newY >= 0 && gameState.grid[newY][newX])
            ) {
              return false
            }
          }
        }
      }
      return true
    },
    [gameState.grid]
  )

  const rotatePiece = useCallback((piece: Shape): Shape => {
    const newPiece = piece[0].map((_, i) => piece.map((row) => row[i]).reverse())
    return newPiece
  }, [])

  const moveLeft = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return

    const newPosition = {
      ...gameState.currentPosition,
      x: gameState.currentPosition.x - 1
    }

    if (isValidMove(newPosition, gameState.currentPiece)) {
      setGameState((prev) => ({
        ...prev,
        currentPosition: newPosition
      }))
    }
  }, [gameState, isValidMove])

  const moveRight = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return

    const newPosition = {
      ...gameState.currentPosition,
      x: gameState.currentPosition.x + 1
    }

    if (isValidMove(newPosition, gameState.currentPiece)) {
      setGameState((prev) => ({
        ...prev,
        currentPosition: newPosition
      }))
    }
  }, [gameState, isValidMove])

  const rotate = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return

    const rotatedPiece = rotatePiece(gameState.currentPiece)
    if (isValidMove(gameState.currentPosition, rotatedPiece)) {
      setGameState((prev) => ({
        ...prev,
        currentPiece: rotatedPiece
      }))
    }
  }, [gameState, isValidMove, rotatePiece])

  const mergePieceToGrid = useCallback(() => {
    // 确保正确创建网格的深拷贝
    const newGrid = gameState.grid.map((row) => [...row])
    const piece = gameState.currentPiece
    const pos = gameState.currentPosition

    if (!piece) return newGrid

    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          // 注意这里的条件
          const newY = pos.y + y
          const newX = pos.x + x
          if (newY >= 0 && newY < GRID_HEIGHT && newX >= 0 && newX < GRID_WIDTH) {
            newGrid[newY][newX] = piece[y][x]
          }
        }
      }
    }

    return newGrid
  }, [gameState])

  // 修改 clearLines 函数接收合并后的网格作为参数
  const clearLines = useCallback(
    (grid: number[][]) => {
      // 创建网格的深拷贝
      const newGrid = grid.map((row) => [...row])
      let linesCleared = 0

      // 从底部向上检查每一行
      for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
        // 检查当前行是否已填满
        const isLineFull = newGrid[y].every((cell) => cell > 0)

        if (isLineFull) {
          linesCleared++
          // 将当前行以上的所有行向下移动
          for (let moveY = y; moveY > 0; moveY--) {
            newGrid[moveY] = [...newGrid[moveY - 1]]
          }
          // 在顶部添加新的空行
          newGrid[0] = Array(GRID_WIDTH).fill(0)
          // 由于当前行已被上方的行替换，需要重新检查当前位置
          y++
        }
      }

      console.log('Lines cleared:', linesCleared) // 调试日志
      console.log('Grid before clearing:', grid) // 调试日志
      console.log('Grid after clearing:', newGrid) // 调试日志

      const score = calculateScore(linesCleared)
      const newLevel = Math.floor((gameState.score + score) / 1000) + 1

      return {
        newGrid,
        score,
        newLevel
      }
    },
    [gameState.score]
  )

  const drop = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return

    const newPosition = {
      ...gameState.currentPosition,
      y: gameState.currentPosition.y + 1
    }

    if (isValidMove(newPosition, gameState.currentPiece)) {
      setGameState((prev) => ({
        ...prev,
        currentPosition: newPosition
      }))
    } else {
      // 当方块不能继续下落时
      const mergedGrid = mergePieceToGrid()
      console.log('Merged grid:', mergedGrid) // 调试日志

      const { newGrid, score, newLevel } = clearLines(mergedGrid)
      console.log('After clearing lines:', newGrid) // 调试日志

      const nextPiece = gameState.nextPiece || generateNewPiece()
      const startPosition = { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 }
      const isGameOver = !isValidMove(startPosition, nextPiece)

      if (!isGameOver) {
        setGameState((prev) => ({
          ...prev,
          grid: newGrid,
          currentPiece: nextPiece,
          currentPosition: startPosition,
          nextPiece: generateNewPiece(),
          score: prev.score + score,
          level: newLevel
        }))
      } else {
        setGameState((prev) => ({
          ...prev,
          isGameOver: true
        }))
      }
    }
  }, [gameState, isValidMove, mergePieceToGrid, clearLines, generateNewPiece])

  // 修改 startGame 函数
  const startGame = useCallback(() => {
    const firstPiece = generateNewPiece()
    const secondPiece = generateNewPiece()
    const startPosition = { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 }

    setGameState({
      grid: createEmptyGrid(),
      currentPiece: firstPiece, // 确保有初始方块
      currentPosition: startPosition,
      nextPiece: secondPiece,
      score: 0,
      level: 1,
      isGameOver: false,
      isPaused: false
    })
  }, [generateNewPiece, createEmptyGrid])

  const pauseGame = useCallback(() => {
    if (gameState.isGameOver || !gameState.currentPiece) return

    setGameState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused
    }))
  }, [gameState.isGameOver, gameState.currentPiece])

  const resetGame = useCallback(() => {
    startGame()
  }, [startGame])

  // 修改戏主循环
  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return

    const speed = Math.max(100, 1000 - (gameState.level - 1) * 100) // 随等级加快
    const intervalId = setInterval(drop, speed)

    return () => clearInterval(intervalId)
  }, [gameState.isGameOver, gameState.isPaused, gameState.currentPiece, gameState.level, drop])

  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.isGameOver || gameState.isPaused) return

      switch (event.key) {
        case 'ArrowLeft':
          moveLeft()
          break
        case 'ArrowRight':
          moveRight()
          break
        case 'ArrowDown':
          drop()
          break
        case 'ArrowUp':
          rotate()
          break
        case ' ': // 空格键
          hardDrop()
          break
        case 'p':
        case 'P':
          pauseGame()
          break
        case 'r':
        case 'R':
          resetGame()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [
    gameState.isGameOver,
    gameState.isPaused,
    moveLeft,
    moveRight,
    drop,
    rotate,
    pauseGame,
    resetGame
  ])

  const hardDrop = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return

    // 计算最终位置
    let finalY = gameState.currentPosition.y
    while (
      isValidMove(
        {
          x: gameState.currentPosition.x,
          y: finalY + 1
        },
        gameState.currentPiece
      )
    ) {
      finalY++
    }

    // 直接更新到最终位置
    const finalPosition = {
      x: gameState.currentPosition.x,
      y: finalY
    }

    // 使用最终位置更新当前方块位置
    setGameState((prev) => ({
      ...prev,
      currentPosition: finalPosition
    }))
  }, [gameState, isValidMove])

  return {
    gameState,
    startGame,
    pauseGame,
    resetGame
  }
}
