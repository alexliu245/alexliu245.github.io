import { useEffect, useReducer } from 'react';
import { Board, TiltDir, tilt, spawnNum } from './service/game';
import { GameBoard } from './Gameboard';

import './App.css';

const copyBoard = (board: Board) => {
  return {
    spaces: Array.from({ length: board.size }, (_, row) =>
      Array.from({ length: board.size }, (_, col) => board.spaces[row][col])
    ),
    size: board.size,
  };
};

const getScore = (board: Board) => {
  return Math.max(...board.spaces.flat(1));
};

type GameState = {
  status: 'initial' | 'playing';
  moves: number;
  newPiecePos: [number, number] | null;
  board: Board;
};

type GameAction =
  | {
      type: 'tilt';
      dir: TiltDir;
    }
  | {
      type: 'start';
    }
  | {
      type: 'DEBUG_win';
    };

const INITIAL_STATE: GameState = {
  status: 'initial',
  moves: 0,
  newPiecePos: null,
  board: {
    spaces: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    size: 4,
  },
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'start': {
      const newBoard = copyBoard(INITIAL_STATE.board);
      const newPiecePos = spawnNum(newBoard);

      return {
        ...state,
        moves: 0,
        status: 'playing',
        board: newBoard,
        newPiecePos,
      };
    }

    case 'tilt': {
      const newBoard = copyBoard(state.board);
      const didMove = tilt(newBoard, action.dir);
      let moves = state.moves;
      let newPiecePos = state.newPiecePos;

      if (didMove) {
        newPiecePos = spawnNum(newBoard);
        moves += 1;
      }

      return {
        ...state,
        moves,
        newPiecePos,
        board: newBoard,
      };
    }

    case 'DEBUG_win': {
      return {
        ...state,
        board: {
          spaces: [
            [2048, 0, 0, 2],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 0, 0, 2],
          ],
          size: 4,
        },
      };
    }

    default: {
      return state;
    }
  }
};

export const App = () => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const score = getScore(state.board);
  const hasWon = score === 2048;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let dir: TiltDir | null = null;

      switch (event.key) {
        case 'ArrowUp':
          dir = 'up';
          break;
        case 'ArrowRight':
          dir = 'right';
          break;
        case 'ArrowDown':
          dir = 'down';
          break;
        case 'ArrowLeft':
          dir = 'left';
          break;
      }

      if (dir) {
        event.preventDefault();

        if (!hasWon) {
          dispatch({
            type: 'tilt',
            dir,
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasWon]);

  if (state.status === 'initial') {
    return (
      <div className='App'>
        <h1>2048 Game</h1>
        <button onClick={() => dispatch({ type: 'start' })}>Play</button>
      </div>
    );
  }

  return (
    <div className='App'>
      <button
        onClick={() => dispatch({ type: 'DEBUG_win' })}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        debug_win
      </button>
      <button onClick={() => dispatch({ type: 'start' })}>Restart</button>
      <div>Score: {score}</div>
      <div>Moves: {state.moves}</div>
      {hasWon ? <div>You win!</div> : null}
      <GameBoard
        board={state.board}
        newPiecePos={state.newPiecePos}
        moves={state.moves}
      />
    </div>
  );
};
