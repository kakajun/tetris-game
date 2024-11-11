import React from 'react';
import styled from 'styled-components';

const InfoContainer = styled.div`
    background: #1a1a1a;
    padding: 20px;
    border-radius: 5px;
    color: white;
    min-width: 200px;
`;

const InfoSection = styled.div`
    margin-bottom: 20px;
`;

const InfoTitle = styled.h3`
    margin: 0 0 10px 0;
    color: #00f0f0;
`;

const ScoreText = styled.div`
    font-size: 24px;
    font-weight: bold;
    color: #f0f000;
`;

const LevelText = styled.div`
    font-size: 20px;
    color: #00f000;
`;

const NextPieceContainer = styled.div`
    display: grid;
    grid-template-rows: repeat(4, 20px);
    grid-template-columns: repeat(4, 20px);
    gap: 1px;
    background: #111;
    padding: 10px;
`;

const Cell = styled.div<{ value: number }>`
    width: 20px;
    height: 20px;
    background-color: ${props => props.value ? '#00f0f0' : 'transparent'};
    border: 1px solid ${props => props.value ? '#4a4a4a' : 'transparent'};
`;

interface GameInfoProps {
    score: number;
    level: number;
    nextPiece: number[][] | null;
}

export const GameInfo: React.FC<GameInfoProps> = ({ score, level, nextPiece }) => {
    return (
        <InfoContainer>
            <InfoSection>
                <InfoTitle>分数</InfoTitle>
                <ScoreText>{score}</ScoreText>
            </InfoSection>

            <InfoSection>
                <InfoTitle>等级</InfoTitle>
                <LevelText>{level}</LevelText>
            </InfoSection>

            <InfoSection>
                <InfoTitle>下一个方块</InfoTitle>
                <NextPieceContainer>
                    {nextPiece ? (
                        Array(4).fill(null).map((_, y) => (
                            Array(4).fill(null).map((_, x) => (
                                <Cell
                                    key={`${y}-${x}`}
                                    value={y < nextPiece.length && x < nextPiece[0].length ? nextPiece[y][x] : 0}
                                />
                            ))
                        ))
                    ) : (
                        Array(16).fill(null).map((_, i) => (
                            <Cell key={i} value={0} />
                        ))
                    )}
                </NextPieceContainer>
            </InfoSection>
        </InfoContainer>
    );
};
