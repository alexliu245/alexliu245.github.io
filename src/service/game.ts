export type Board = {
  spaces: number[][];
  size: number;
};

export type TiltDir = "up" | "right" | "down" | "left";

const tiltLeft = ({ spaces, size }: Board) => {
  let didMove = false;
  for (let row = 0; row < size; ++row) {
    let toCol = -1;
    let mergeCandidate = -1;

    for (let col = 0; col < size; ++col) {
      if (spaces[row][col] === 0) {
        continue;
      }

      if (spaces[row][col] === mergeCandidate) {
        spaces[row][toCol] += spaces[row][col];
        spaces[row][col] = 0;
        mergeCandidate = -1;
        didMove = true;
      } else {
        ++toCol;
        const temp = spaces[row][col];
        spaces[row][col] = 0;
        spaces[row][toCol] = temp;
        mergeCandidate = temp;
        if (col !== toCol) {
          didMove = true;
        }
      }
    }
  }
  return didMove;
};

const tiltRight = ({ spaces, size }: Board) => {
  let didMove = false;
  for (let row = 0; row < size; ++row) {
    let toCol = size;
    let mergeCandidate = -1;

    for (let col = size - 1; col >= 0; --col) {
      if (spaces[row][col] === 0) {
        continue;
      }

      if (spaces[row][col] === mergeCandidate) {
        spaces[row][toCol] += spaces[row][col];
        spaces[row][col] = 0;
        mergeCandidate = -1;
        didMove = true;
      } else {
        --toCol;
        const temp = spaces[row][col];
        spaces[row][col] = 0;
        spaces[row][toCol] = temp;
        mergeCandidate = temp;
        if (col !== toCol) {
          didMove = true;
        }
      }
    }
  }
  return didMove;
};

const tiltUp = ({ spaces, size }: Board) => {
  let didMove = false;
  for (let col = 0; col < size; ++col) {
    let toRow = -1;
    let mergeCandidate = -1;

    for (let row = 0; row < size; ++row) {
      if (spaces[row][col] === 0) {
        continue;
      }

      if (spaces[row][col] === mergeCandidate) {
        spaces[toRow][col] += spaces[row][col];
        spaces[row][col] = 0;
        mergeCandidate = -1;
        didMove = true;
      } else {
        ++toRow;
        const temp = spaces[row][col];
        spaces[row][col] = 0;
        spaces[toRow][col] = temp;
        mergeCandidate = temp;
        if (row !== toRow) {
          didMove = true;
        }
      }
    }
  }
  return didMove;
};

const tiltDown = ({ spaces, size }: Board) => {
  let didMove = false;
  for (let col = 0; col < size; ++col) {
    let toRow = size;
    let mergeCandidate = -1;

    for (let row = size - 1; row >= 0; --row) {
      if (spaces[row][col] === 0) {
        continue;
      }

      if (spaces[row][col] === mergeCandidate) {
        spaces[toRow][col] += spaces[row][col];
        spaces[row][col] = 0;
        mergeCandidate = -1;
        didMove = true;
      } else {
        --toRow;
        const temp = spaces[row][col];
        spaces[row][col] = 0;
        spaces[toRow][col] = temp;
        mergeCandidate = temp;
        if (row !== toRow) {
          didMove = true;
        }
      }
    }
  }
  return didMove;
};

export const tilt = (board: Board, dir: TiltDir) => {
  switch (dir) {
    case "up":
      return tiltUp(board);
    case "right":
      return tiltRight(board);
    case "down":
      return tiltDown(board);
    case "left":
      return tiltLeft(board);
  }
};

export const spawnNum = ({ spaces, size }: Board): [number, number] | null => {
  const freeSpaces: [number, number][] = [];

  // find candidates
  for (let row = 0; row < size; ++row) {
    for (let col = 0; col < size; ++col) {
      if (spaces[row][col] === 0) {
        freeSpaces.push([row, col]);
      }
    }
  }

  if (!freeSpaces.length) {
    // no room to spawn a number, unsuccessful
    return null;
  }

  const [row, col] = freeSpaces[Math.floor(Math.random() * freeSpaces.length)];
  spaces[row][col] = 2;
  return [row, col];
};
