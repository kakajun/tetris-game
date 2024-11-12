import React from 'react'

interface GameOverModalProps {
  score: number
  onRestart: () => void
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ score, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-black">Game Over!</h2>
        <p className="text-xl mb-4 text-black">最终得分: {score}</p>
        <button
          onClick={onRestart}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          重新开始
        </button>
      </div>
    </div>
  )
}
