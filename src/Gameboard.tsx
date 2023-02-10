import { Board } from './service/game';

import './Gameboard.css';

type GameBoardProps = {
  board: Board;
  newPiecePos: [number, number] | null;
  moves: number;
};

export const GameBoard = ({ board, newPiecePos, moves }: GameBoardProps) => {
  return (
    <div className='GameBoard'>
      {board.spaces.map((row, rowIdx) => (
        <div key={rowIdx} className='GameBoard-row'>
          {row.map((value, colIdx) => {
            const isNewPiece =
              newPiecePos &&
              rowIdx === newPiecePos[0] &&
              colIdx === newPiecePos[1];

            return (
              <div
                key={isNewPiece ? `new-${moves}` : colIdx}
                className={`GameBoard-cell GameBoard-cell--${value} ${
                  isNewPiece ? 'GameBoard-cell--new' : ''
                }`}
              >
                {value || ''}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
