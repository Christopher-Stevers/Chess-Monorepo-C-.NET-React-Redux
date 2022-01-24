import defaultData from "./default";
const withinBoard = (x: number) => {
  return 0 <= x && x <= 7;
};
const compareTuple = ([x, y]: any, [a, b]: any) => {
  return x === a && y === b;
};
const scanObstruct = (state: any, payload: any) => {
  //check for obstructions in a path.
  const scanIndie = (xDir: number, yDir: number) => {
    let currentY = payload[1] + yDir;
    let currentX = payload[0] + xDir;
    while (
      0 <= currentX &&
      currentX <= 7 &&
      0 <= currentY &&
      currentY <= 7 &&
      state.board[currentY][currentX].piece === ""
    ) {
      currentY += yDir;
      currentX += xDir;
    }
    return [
      currentX,
      currentY,
      withinBoard(currentX) &&
        withinBoard(currentY) &&
        state.board[currentY][currentX],
    ];
  };
  //create object showing where obstructions are hit on each direction and diagonal.
  return {
    x1: scanIndie(-1, 0),
    x2: scanIndie(1, 0),
    y1: scanIndie(0, -1),
    y2: scanIndie(0, 1),
    x1y1: scanIndie(1, 1),
    x2y1: scanIndie(1, -1),
    x1y2: scanIndie(-1, 1),
    x2y2: scanIndie(-1, -1),
    d1: scanIndie(1, 1)[0],
    d2: scanIndie(1, -1)[0],
    d3: scanIndie(-1, 1)[0],
    d4: scanIndie(-1, -1)[0],
  };
};
const knightMoves = (x: number, y: number) => {
  return [
    [x + 1, y + 2],
    [x + 1, y - 2],
    [x - 1, y + 2],
    [x - 1, y - 2],
    [x + 2, y + 1],
    [x + 2, y - 1],
    [x - 2, y + 1],
    [x - 2, y - 1],
  ];
};
const bishopMoves = (
  x: number,
  y: number,
  d1: number,
  d2: number,
  d3: number,
  d4: number
) => {
  const endArr = [];
  let i = d4;
  const xyDif = y - x;
  while (i <= d1) {
    if (i !== x) {
      endArr.push([i, i + xyDif]);
    }
    i++;
  }
  let j = d3;
  let k = 2 * Math.abs(j - x) + j + xyDif;
  while (j <= d2) {
    if (j !== x) {
      endArr.push([j, k]);
    }
    j++;
    k--;
  }
  return endArr;
};
const rookMoves = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const availableArr = [];
  let i = x1;
  while (i <= x2) {
    if (x !== i) availableArr.push([i, y]);
    i++;
  }
  let j = y1;
  while (j <= y2) {
    if (y !== j) availableArr.push([x, j]);
    j++;
  }
  return availableArr;
};
const kingMoves = (x: any, y: any) => {
  return [
    [x + 1, y + 1],
    [x + 1, y],
    [x + 1, y - 1],
    [x, y - 1],
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y + 1],
  ];
};
const pawnMoves = (
  x: number,
  y: number,
  attackDir: number,
  d1: number,
  d2: number,
  d3: number,
  d4: number,
  y1: any,
  y2: any,
  enpassant: any
) => {
  const availableArr = [];
  const obstruct = attackDir < 0 ? y1[1] : y2[1];
  const leftDiOb = attackDir < 0 ? d4 : d3;
  const rightDiOb = attackDir < 0 ? d2 : d1;
  if (
    (x - 1 === enpassant[0] || x + 1 === enpassant[0]) &&
    y === enpassant[1]
  ) {
    availableArr.push([enpassant[0], enpassant[1] + attackDir]);
  }
  if (y + attackDir !== obstruct) {
    availableArr.push([x, y + attackDir]);
    if (y + 2 * attackDir !== obstruct && (y === 1 || y === 6)) {
      availableArr.push([x, y + 2 * attackDir]);
    }
  }
  if (rightDiOb === x + 1) {
    availableArr.push([x + 1, y + attackDir]);
  }
  if (leftDiOb === x - 1) {
    availableArr.push([x - 1, y + attackDir]);
  }
  return availableArr;
};
const availableMoves = (
  x: number,
  y: number,
  piece: string,
  obstructionObject: any,
  attackDir: number,
  board: any,
  enpassant: any
) => {
  const { d1, d2, d3, d4, x1, y1, x2, y2 } = obstructionObject;
  switch (piece) {
    case "pawn":
      return pawnMoves(x, y, attackDir, d1, d2, d3, d4, y1, y2, enpassant);
    case "bishop":
      return bishopMoves(x, y, d1, d2, d3, d4);
    case "rook":
      return rookMoves(x, y, x1[0], y1[1], x2[0], y2[1]);
    case "queen":
      return rookMoves(x, y, x1[0], y1[1], x2[0], y2[1]).concat(
        bishopMoves(x, y, d1, d2, d3, d4)
      );
    case "king":
      return kingMoves(x, y);
    case "knight":
      return knightMoves(x, y);

    default:
      return [];
  }
};

const checkForCheck = (state: any, payload: any) => {
  const [x, y] = payload;
  if (typeof x !== "number") {
    return true;
  }
  const { color } = state.board[y][x];
  const obstructionObject = scanObstruct(state, payload);
  let check = false;
  const attackDir = color === "white" ? -1 : 1;
  const { d1, d2, d3, d4, x1, y1, x2, y2 } = obstructionObject;
  const rookKing = rookMoves(x, y, x1[0], y1[1], x2[0], y2[1]);
  const bishopKing = bishopMoves(x, y, d1, d2, d3, d4);
  const knightKing = knightMoves(x, y);
  const pawnKing = pawnMoves(
    x,
    y,
    attackDir,
    d1,
    d2,
    d3,
    d4,
    y1,
    y2,
    state.enpassant.array
  );
  const myForEach = (testingArr: any, testingPiece: any) => {
    let inDanger = false;
    testingArr.forEach((elem: any, index: number) => {
      if (withinBoard(elem[0]) && withinBoard(elem[1]) && !inDanger) {
        if (
          testingPiece === state.board[elem[1]][elem[0]].piece &&
          state.board[elem[1]][elem[0]].color !== color
        ) {
          inDanger = true;
        }
      }
    });
    return inDanger;
  };
  check =
    myForEach(rookKing, "rook") ||
    myForEach(bishopKing, "bishop") ||
    myForEach(rookKing.concat(bishopKing), "queen") ||
    myForEach(knightKing, "knight") ||
    myForEach(pawnKing, "pawn");
  return check;
};

export const tranformToPawn = (state: any, payload: string) => {
  return {
    ...state,
    board: state.board.map((elem: any) => {
      return elem.map((innerElem: any) => {
        if (innerElem.choose) {
          return { ...innerElem, choose: false, piece: payload };
        }
        return innerElem;
      });
    }),
  };
};
//did we win
export const setWin = (state: any, payload: string) => {
  return { ...state, win: { color: payload } };
};
const checkForCheckMate = (newState: any) => {
  const potentialStateAndChecks = (state: any, payload: [number, number]) => {
    const [x, y] = payload;
    const { piece, color } = state.board[y][x];
    //check for obstructions in the possible paths.

    //execute scanObstruct
    const obstructionObject = scanObstruct(state, payload);
    const attackDir = color === "black" ? 1 : -1;
    const possibleAttacks = availableMoves(
      x,
      y,
      piece,
      obstructionObject,
      attackDir,
      state.board,
      state.enpassant.array
    );
    const potentialState = {
      ...state,
      currentPiece: { piece, color, x, y },
      board: state.board.map((elem: any, index: number) =>
        elem.map((innerElem: any, innerIndex: number) => {
          //if moves kings, deal with it. if moved kings queen style los, deal with it.
          if (
            possibleAttacks.find((elem: any) => {
              return elem[0] === innerIndex && elem[1] === index;
            }) &&
            innerElem.color !== color
          ) {
            return {
              ...innerElem,
              available: "yes",
            };
          } else {
            return {
              ...innerElem,
              available: "no",
            };
          }
        })
      ),
    };
    const checkArr: any[] = [];
    possibleAttacks.forEach((attackArr: any) => {
      if (withinBoard(attackArr[0]) && withinBoard(attackArr[1])) {
        const potentialBoardState = returnAvailableState(
          potentialState,
          attackArr
        );
        const testingY = potentialBoardState.board.findIndex((array: any) => {
          return array.find((elem: any) => {
            return elem.piece === "king" && elem.color === state.turn.color;
          });
        });
        if (testingY >= 0) {
          const testingX = potentialBoardState.board[testingY].findIndex(
            (elem: any) => {
              return elem.piece === "king" && elem.color === state.turn.color;
            }
          );
          if (checkForCheck(potentialBoardState, [testingX, testingY])) {
            checkArr.push(attackArr);
          }
        }
      }
    });
    return [potentialState.board, checkArr];
  };
  const areThereSomeAvailableSpots = newState.board.some(
    (elem: any, index: number) => {
      //are there any boards with possilbe non checks.
      return elem.some((innerElem: any, innerIndex: number) => {
        if (innerElem.color === newState.turn.color) {
          const [potentialBoardState, potentialCheckArr] =
            potentialStateAndChecks(newState, [innerIndex, index]);
          //are there any non-checks on that possible board?
          const potentialBoardHasNonChecks = potentialBoardState.some(
            (elem: any, index: number) => {
              //are there any nonchecks on that file.
              return elem.some((innerElem: any, innerIndex: number) => {
                //are there any non-checks available in on that?
                return (
                  innerElem.available === "yes" &&
                  !potentialCheckArr.some((elem: any) => {
                    return compareTuple(elem, [innerIndex, index]);
                  })
                );
              });
            }
          );
          return potentialBoardHasNonChecks;
        } else return false;
      });
    }
  );

  return !areThereSomeAvailableSpots;
};
//check if move is legal and set available accordingly.
export const showAllAvailableSpots = (
  state: any,
  payload: [number, number]
) => {
  if (state.board.checkMate) {
    return state;
  }
  const [x, y] = payload;
  const { piece, color } = state.board[y][x];
  //check for obstructions in the possible paths.

  //execute scanObstruct
  const obstructionObject = scanObstruct(state, payload);
  const attackDir = color === "black" ? 1 : -1;
  const possibleAttacks = availableMoves(
    x,
    y,
    piece,
    obstructionObject,
    attackDir,
    state.board,
    state.enpassant.array
  );
  const potentialState = {
    ...state,
    currentPiece: { piece, color, x, y },
    board: state.board.map((elem: any, index: number) =>
      elem.map((innerElem: any, innerIndex: number) => {
        //if moves kings, deal with it. if moved kings queen style los, deal with it.
        if (
          possibleAttacks.find((elem: any) => {
            return elem[0] === innerIndex && elem[1] === index;
          }) &&
          innerElem.color !== color
        ) {
          return {
            ...innerElem,
            available: "yes",
          };
        } else {
          return {
            ...innerElem,
            available: "no",
          };
        }
      })
    ),
  };
  const checkArr: any[] = [];
  possibleAttacks.forEach((attackArr: any) => {
    if (withinBoard(attackArr[0]) && withinBoard(attackArr[1])) {
      const potentialBoardState = moveToAvailableSpot(
        potentialState,
        attackArr
      );
      const testingY = potentialBoardState.board.findIndex((array: any) => {
        return array.find((elem: any) => {
          return elem.piece === "king" && elem.color === state.turn.color;
        });
      });
      if (testingY >= 0) {
        const testingX = potentialBoardState.board[testingY].findIndex(
          (elem: any) => {
            return elem.piece === "king" && elem.color === state.turn.color;
          }
        );
        if (checkForCheck(potentialBoardState, [testingX, testingY])) {
          checkArr.push(attackArr);
        }
      }
    }
  });

  const returnedState = {
    ...potentialState,

    board: potentialState.board.map((elem: any, index: number) => {
      return elem.map((innerElem: any, innerIndex: number) => {
        if (
          checkArr.some((checkTuple: any) => {
            return compareTuple([innerIndex, index], checkTuple);
          }) &&
          potentialState.currentPiece.color === potentialState.turn.color
        ) {
          return {
            ...innerElem,
            available: "no",
          };
        } else
          return {
            ...innerElem,
          };
      });
    }),
  };
  return returnedState;
};

//If move is legal execute move.
export const returnAvailableState = (state: any, payload: [number, number]) => {
  //payload is target boardPlace
  const [x, y] = payload;
  const attackDir = state.turn.color === "black" ? 1 : -1;
  return {
    enpassant: {
      array:
        (state.currentPiece.piece === "pawn" &&
          state.currentPiece.y === y + 2) ||
        state.currentPiece.y === y - 2
          ? payload
          : [],
    },
    rookMoved: {
      leftWhite: false,
      leftBlack: false,
      rightWhite: false,
      rightBlack: false,
    },
    board: state.board.map((elem: any, index: number) =>
      elem.map((innerElem: any, innerIndex: number) => {
        // Check if we can move there.
        console.log(state.enpassant.array[0] - 1, y - attackDir);
        console.log(state.enpassant.array);
        if (
          x === state.enpassant.array[0] &&
          y - attackDir === state.enpassant.array[1] &&
          innerIndex === state.enpassant.array[0] &&
          index === state.enpassant.array[1]
        ) {
          console.log([innerIndex, index]);
          return {
            color: "",
            piece: "",
            available: "no",
          };
        }
        if (innerElem.available === "yes" && index === y && innerIndex === x) {
          //Handle pawn grow up
          if (
            state.currentPiece.piece === "pawn" &&
            (index === 0 || index === 7)
          ) {
            return { ...state.currentPiece, choose: true, available: "no" };
          }
          return { ...state.currentPiece, available: "no" };
        }
        if (
          state.currentPiece.x === innerIndex &&
          state.currentPiece.y === index &&
          state.board[y][x].available === "yes"
        ) {
          return {
            color: "",
            piece: "",
            available: "no",
          };
        }
        return { ...innerElem, available: "no" };
      })
    ),
    currentPiece: { piece: "" },

    turn: { color: state.turn.color === "white" ? "black" : "white" },
    win: "",
    checkStatus: { check: false, checkMate: false },
  };
};
export const moveToAvailableSpot = (state: any, payload: any) => {
  if (state.board.checkMate) {
    return state;
  }
  const potentialState = returnAvailableState(state, payload);
  const testingY =
    state.board.findIndex((array: any) => {
      return array.find((elem: any) => {
        return elem.piece === "king" && elem.color !== state.turn.color;
      });
    }) || 0;
  const testingX = state.board[testingY].findIndex((elem: any) => {
    return elem.piece === "king" && elem.color !== state.turn.color;
  });
  if (checkForCheck(potentialState, [testingX, testingY])) {
    if (checkForCheckMate(potentialState)) {
      return {
        ...potentialState,
        checkStatus: { check: true, checkMate: true },
      };
    } else {
      console.log("ese");
      return {
        ...potentialState,
        checkStatus: { check: true, checkMate: false },
      };
    }
  } else return potentialState;
};
export const newGame = () => {
  return defaultData();
};
