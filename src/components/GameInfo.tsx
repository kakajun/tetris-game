import React from 'react'

interface GameInfoProps {
  score: number
  level: number
  nextPiece: number[][] | null
}

export const GameInfo: React.FC<GameInfoProps> = ({ score, level, nextPiece }) => {
  return (
    <div className="bg-[#1a1a1a] p-5 rounded text-white min-w-[200px]">
      <div className="mb-5">
        <h3 className="m-0 mb-2.5 text-[#00f0f0]">分数</h3>
        <div className="text-6 font-bold text-[#f0f000]">{score}</div>
      </div>

      <div className="mb-5">
        <h3 className="m-0 mb-2.5 text-[#00f0f0]">等级</h3>
        <div className="text-5 text-[#00f000]">{level}</div>
      </div>

      <div className="mb-5">
        <h3 className="m-0 mb-2.5 text-[#00f0f0]">下一个方块</h3>
        <div className="grid grid-rows-[repeat(4,20px)] grid-cols-[repeat(4,20px)] gap-[1px] bg-[#111] p-2.5">
          {nextPiece
            ? Array(4)
                .fill(null)
                .map((_, y) =>
                  Array(4)
                    .fill(null)
                    .map((_, x) => (
                      <div
                        key={`${y}-${x}`}
                        className={`w-[20px] h-[20px] ${
                          y < nextPiece.length && x < nextPiece[0].length && nextPiece[y][x]
                            ? 'bg-[#00f0f0] border-[1px] border-[#4a4a4a]'
                            : 'bg-transparent border-transparent'
                        }`}
                      />
                    ))
                )
            : Array(16)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="w-[20px] h-[20px] bg-transparent border-transparent" />
                ))}
        </div>
      </div>
    </div>
  )
}
