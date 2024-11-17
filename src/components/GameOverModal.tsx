import React from 'react'

interface GameOverModalProps {
  isVisible?: boolean
  score: number
  onRestart: () => void
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ isVisible=false, score, onRestart }) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg text-center">
        <h2 className="text-2xl mb-4">游戏结束</h2>
        <p className="mb-4">最终得分: {score}</p>
        <button
          onClick={onRestart}
          className="bg-primary-color text-[#227fd9] px-4 py-2 rounded hover:opacity-90"
        >
          重新开始
        </button>
      </div>
    </div>
  )
}
