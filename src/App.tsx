import React from 'react'
import { TetrisBoard } from './components/TetrisBoard'
import { GameInfo } from './components/GameInfo'
import { useTetris } from './hooks/useTetris'

const App: React.FC = () => {
  const { gameState, startGame, pauseGame, resetGame } = useTetris()

  return (
    <div className="flex justify-center items-start gap-5 p-5 bg-[#1a1a1a] min-h-screen text-white font-sans">
      <div>
        <TetrisBoard
          grid={gameState.grid}
          currentPiece={gameState.currentPiece}
          currentPosition={gameState.currentPosition}
          isGameOver={gameState.isGameOver}
          score={gameState.score}
          onRestart={resetGame}
        />
        <div className="flex gap-2.5 mt-5 justify-center">
          <button
            className="w-32 px-5 py-2.5 text-4 border-none rounded bg-[#4a4a4a] text-white cursor-pointer transition-colors duration-200 hover:bg-[#666] disabled:opacity-50"
            onClick={gameState.isGameOver ? startGame : resetGame}
          >
            {gameState.isGameOver ? '开始游戏' : '重新开始'}
          </button>
          <button
            className="w-32 px-5 py-2.5 text-4 border-none rounded bg-[#4a4a4a] text-white cursor-pointer transition-colors duration-200 hover:bg-[#666] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={pauseGame}
            disabled={gameState.isGameOver || !gameState.currentPiece}
          >
            {gameState.isPaused ? '继续' : '暂停'}
          </button>
        </div>
      </div>
      <GameInfo score={gameState.score} level={gameState.level} nextPiece={gameState.nextPiece} />
    </div>
  )
}

export default App
