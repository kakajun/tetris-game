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
    // 深拷贝网格数组
    const newGrid = gameState.grid.map((row) => [...row])
    const piece = gameState.currentPiece
    const pos = gameState.currentPosition

    if (!piece) return newGrid

    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x] && pos.y + y >= 0) {
          newGrid[pos.y + y][pos.x + x] = piece[y][x]
        }
      }
    }

    // 确保在 drop 函数中使用这个新网格
    return newGrid
  }, [gameState])

  // 修改 clearLines 方法，使用 calculateScore
  const clearLines = useCallback(() => {
    // 只过滤完整的行（所有格子都被填满的行）
    const newGrid = gameState.grid.filter((row) => !row.every((cell) => cell !== 0))
    const clearedLines = GRID_HEIGHT - newGrid.length
    const score = calculateScore(clearedLines)

    // 补充新的空行
    while (newGrid.length < GRID_HEIGHT) {
      newGrid.unshift(Array(GRID_WIDTH).fill(0))
    }

    return {
      newGrid,
      score,
      newLevel: Math.floor((gameState.score + score) / 1000) + 1
    }
  }, [gameState.grid, gameState.score])

  const drop = useCallback(() => {
    console.log('Drop called', gameState) // 添加调试日志
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return

    const newPosition = {
      ...gameState.currentPosition,
      y: gameState.currentPosition.y + 1
    }

    if (isValidMove(newPosition, gameState.currentPiece)) {
      // 如果可以继续下落
      setGameState((prev) => ({
        ...prev,
        currentPosition: newPosition
      }))
    } else {
      // 如果不能继续下落，固定当前方块并生成新方块
      const newGrid = mergePieceToGrid()
      const { newGrid: clearedGrid, score, newLevel } = clearLines()

      const nextPiece = gameState.nextPiece || generateNewPiece() // 使用已经生成的下一个方块
      const startPosition = { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 }

      // 检查新方块是否可以放置
      const isGameOver = !isValidMove(startPosition, nextPiece)

      if (!isGameOver) {
        setGameState((prev) => ({
          ...prev,
          grid: clearedGrid,
          currentPiece: nextPiece,
          currentPosition: startPosition,
          nextPiece: generateNewPiece(), // 生成新的下一个方块
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
    console.log('Starting game...') // 添加调试日志
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

  // 修改游戏主循环
  useEffect(() => {
    console.log('Game loop effect', {
      isGameOver: gameState.isGameOver,
      isPaused: gameState.isPaused,
      currentPiece: gameState.currentPiece
    }) // 添加调试日志

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

    let newY = gameState.currentPosition.y

    // 找到方块可以下落的最低位置
    while (isValidMove({ x: gameState.currentPosition.x, y: newY + 1 }, gameState.currentPiece)) {
      newY++
    }

    // 直接将方块放置到最低位置
    const newPosition = {
      x: gameState.currentPosition.x,
      y: newY
    }

    setGameState((prev) => ({
      ...prev,
      currentPosition: newPosition
    }))

    // 立即触发一次 drop 来固定方块
    drop()
  }, [gameState, isValidMove, drop])

  return {
    gameState,
    startGame,
    pauseGame,
    resetGame
  }
}