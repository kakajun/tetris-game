import { useState, useCallback, useEffect } from 'react';
import { SHAPES } from '../constants/tetrominos';
import { GameState, Shape, Position } from '../types/types';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

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
    });

    const createEmptyGrid = useCallback(() =>
        Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(0))
    , []);

    const generateNewPiece = useCallback((): Shape => {
        const shapes = Object.values(SHAPES);
        return shapes[Math.floor(Math.random() * shapes.length)];
    }, []);

       // 修改 isValidMove 函数
       const isValidMove = useCallback((position: Position, piece: Shape): boolean => {
        console.log('Checking move validity', { position, piece }); // 添加调试日志
        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[y].length; x++) {
                if (piece[y][x]) {
                    const newX = position.x + x;
                    const newY = position.y + y;

                    if (
                        newX < 0 ||
                        newX >= GRID_WIDTH ||
                        newY >= GRID_HEIGHT ||
                        (newY >= 0 && gameState.grid[newY][newX])
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    }, [gameState.grid]);

    const rotatePiece = useCallback((piece: Shape): Shape => {
        const newPiece = piece[0].map((_, i) =>
            piece.map(row => row[i]).reverse()
        );
        return newPiece;
    }, []);

    const moveLeft = useCallback(() => {
        if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return;

        const newPosition = {
            ...gameState.currentPosition,
            x: gameState.currentPosition.x - 1
        };

        if (isValidMove(newPosition, gameState.currentPiece)) {
            setGameState(prev => ({
                ...prev,
                currentPosition: newPosition
            }));
        }
    }, [gameState, isValidMove]);

    const moveRight = useCallback(() => {
        if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return;

        const newPosition = {
            ...gameState.currentPosition,
            x: gameState.currentPosition.x + 1
        };

        if (isValidMove(newPosition, gameState.currentPiece)) {
            setGameState(prev => ({
                ...prev,
                currentPosition: newPosition
            }));
        }
    }, [gameState, isValidMove]);

    const rotate = useCallback(() => {
        if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return;

        const rotatedPiece = rotatePiece(gameState.currentPiece);
        if (isValidMove(gameState.currentPosition, rotatedPiece)) {
            setGameState(prev => ({
                ...prev,
                currentPiece: rotatedPiece
            }));
        }
    }, [gameState, isValidMove, rotatePiece]);

    const mergePieceToGrid = useCallback(() => {
        const newGrid = gameState.grid.map(row => [...row]);
        const piece = gameState.currentPiece;
        const pos = gameState.currentPosition;

        if (!piece) return newGrid;

        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[y].length; x++) {
                if (piece[y][x] && pos.y + y >= 0) {
                    newGrid[pos.y + y][pos.x + x] = piece[y][x];
                }
            }
        }
        return newGrid;
    }, [gameState]);

    const clearLines = useCallback(() => {
        const newGrid = gameState.grid.filter(row => row.some(cell => cell === 0));
        const clearedLines = GRID_HEIGHT - newGrid.length;
        const score = calculateScore(clearedLines);

        while (newGrid.length < GRID_HEIGHT) {
            newGrid.unshift(Array(GRID_WIDTH).fill(0));
        }

        return { newGrid, score };
    }, [gameState.grid]);


    const drop = useCallback(() => {
        console.log('Drop called', gameState); // 添加调试日志
        if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return;

        const newPosition = {
            ...gameState.currentPosition,
            y: gameState.currentPosition.y + 1
        };

        if (isValidMove(newPosition, gameState.currentPiece)) {
            setGameState(prev => ({
                ...prev,
                currentPosition: newPosition
            }));
        } else {
            const newGrid = mergePieceToGrid();
            const { newGrid: clearedGrid, score } = clearLines();

            const nextPiece = generateNewPiece();
            const startPosition = { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 };

            const isGameOver = !isValidMove(startPosition, nextPiece);

            setGameState(prev => ({
                ...prev,
                grid: clearedGrid,
                currentPiece: nextPiece,
                currentPosition: startPosition,
                nextPiece: generateNewPiece(),
                score: prev.score + score,
                isGameOver: isGameOver
            }));
        }
    }, [gameState, isValidMove, mergePieceToGrid, clearLines, generateNewPiece]);


      // 修改 startGame 函数
      const startGame = useCallback(() => {
        console.log('Starting game...'); // 添加调试日志
        const firstPiece = generateNewPiece();
        const secondPiece = generateNewPiece();
        const startPosition = { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 };

        setGameState({
            grid: createEmptyGrid(),
            currentPiece: firstPiece,  // 确保有初始方块
            currentPosition: startPosition,
            nextPiece: secondPiece,
            score: 0,
            level: 1,
            isGameOver: false,
            isPaused: false
        });
    }, [generateNewPiece, createEmptyGrid]);

    const pauseGame = useCallback(() => {
        if (gameState.isGameOver || !gameState.currentPiece) return;

        setGameState(prev => ({
            ...prev,
            isPaused: !prev.isPaused
        }));
    }, [gameState.isGameOver, gameState.currentPiece]);

    const resetGame = useCallback(() => {
        startGame();
    }, [startGame]);

      // 修改游戏主循环
      useEffect(() => {
        console.log('Game loop effect', {
            isGameOver: gameState.isGameOver,
            isPaused: gameState.isPaused,
            currentPiece: gameState.currentPiece
        }); // 添加调试日志

        if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) return;

        const dropInterval = Math.max(100, 1000 - (gameState.level - 1) * 100);
        const intervalId = setInterval(() => {
            drop();
        }, dropInterval);

        return () => clearInterval(intervalId);
    }, [
        gameState.isGameOver,
        gameState.isPaused,
        gameState.currentPiece,
        gameState.level,
        drop
    ]);

    // 键盘控制
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (gameState.isGameOver) return;

            switch (event.key) {
                case 'ArrowLeft':
                    moveLeft();
                    break;
                case 'ArrowRight':
                    moveRight();
                    break;
                case 'ArrowDown':
                    drop();
                    break;
                case 'ArrowUp':
                    rotate();
                    break;
                case 'p':
                case 'P':
                    pauseGame();
                    break;
                case 'r':
                case 'R':
                    resetGame();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameState.isGameOver, moveLeft, moveRight, drop, rotate, pauseGame, resetGame]);

    return {
        gameState,
        moveLeft,
        moveRight,
        rotate,
        drop,
        startGame,
        pauseGame,
        resetGame
    };
};
