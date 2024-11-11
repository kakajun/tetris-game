import React from 'react';
import styled from 'styled-components';
import { TetrisBoard } from './components/TetrisBoard';
import { GameInfo } from './components/GameInfo';
import { useTetris } from './hooks/useTetris';

const GameContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 20px;
    padding: 20px;
    background: #1a1a1a;
    min-height: 100vh;
    color: white;
    font-family: Arial, sans-serif;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;
    justify-content: center;
`;

const GameButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    background-color: #4a4a4a;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #666;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const App: React.FC = () => {
    const {
        gameState,
        moveLeft,
        moveRight,
        rotate,
        drop,
        startGame,
        pauseGame,
        resetGame
    } = useTetris();

    return (
        <GameContainer>
            <div>
                <TetrisBoard
                    grid={gameState.grid}
                    currentPiece={gameState.currentPiece}
                    currentPosition={gameState.currentPosition}
                />
                <ButtonContainer>
                    <GameButton
                        onClick={startGame}
                        disabled={!gameState.isGameOver && !gameState.isPaused}
                    >
                        {gameState.isGameOver ? "开始游戏" : "继续游戏"}
                    </GameButton>
                    <GameButton
                        onClick={pauseGame}
                        disabled={gameState.isGameOver || !gameState.currentPiece}
                    >
                        {gameState.isPaused ? "继续" : "暂停"}
                    </GameButton>
                    <GameButton
                        onClick={resetGame}
                        disabled={gameState.isGameOver}
                    >
                        重新开始
                    </GameButton>
                </ButtonContainer>
            </div>
            <GameInfo
                score={gameState.score}
                level={gameState.level}
                nextPiece={gameState.nextPiece}
            />
        </GameContainer>
    );
};

export default App;
