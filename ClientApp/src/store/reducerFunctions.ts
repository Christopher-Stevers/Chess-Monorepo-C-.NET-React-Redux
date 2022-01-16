import { EMLINK } from "constants";
import { relative } from "path";

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
const legalPawn = (
  currentX: number,
  currentY: number,
  pieceX: number,
  pieceY: number,
  innerElem: any,
  color: string,
  nextPiece: string
) => {
  const playingDir = color === "white" ? -1 : 1;
  if (
    (currentX === pieceX &&
      innerElem.piece === "" &&
      (currentY === pieceY + playingDir ||
        //double move
        (((pieceY === 1 && currentY === pieceY + 2 && color === "black") ||
          (pieceY === 6 && currentY === pieceY - 2 && color === "white")) &&
          nextPiece === ""))) ||
    ((currentX === pieceX + 1 || currentX === pieceX - 1) &&
      innerElem.piece !== "" &&
      currentY === pieceY + playingDir &&
      color !== innerElem.color &&
      innerElem.color)
  ) {
    return true;
  }
};
const legalRook = (
  currentX: number,
  currentY: number,
  pieceX: number,
  pieceY: number,
  d1: number,
  d2: number,
  d3: number,
  d4: number
) => {
  return (
    (currentY === pieceY && d1 <= currentX && currentX <= d2) ||
    (currentX === pieceX && d3 <= currentY && currentY <= d4)
  );
};
const legalKnight = (
  currentX: number,
  currentY: number,
  pieceX: number,
  pieceY: number
) => {
  if (
    Math.abs(currentX - pieceX) + Math.abs(currentY - pieceY) === 3 &&
    Math.abs(currentX - pieceX) < 3 &&
    Math.abs(currentY - pieceY) < 3
  ) {
    return true;
  }
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
  while (j < y2) {
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
  y2: any
) => {
  const availableArr = [];
  const obstruct = attackDir < 0 ? y1[1] : y2[1];
  const leftDiOb = attackDir < 0 ? d4 : d3;
  const rightDiOb = attackDir < 0 ? d2 : d1;
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
const legalBishop = (
  currentX: number,
  currentY: number,
  pieceX: number,
  pieceY: number,
  d1: number,
  d2: number,
  d3: number,
  d4: number
) => {
  if (
    (pieceX - currentX === pieceY - currentY &&
      d1 >= currentX &&
      currentX >= d4) ||
    (pieceX - currentX === -pieceY + currentY &&
      d3 <= currentX &&
      currentX <= d2)
  ) {
    return true;
  } else return false;
};
const availableMoves = (
  x: number,
  y: number,
  piece: string,
  obstructionObject: any,
  attackDir: number,
  board: any
) => {
  const { d1, d2, d3, d4, x1, y1, x2, y2 } = obstructionObject;
  switch (piece) {
    case "pawn":
      return pawnMoves(x, y, attackDir, d1, d2, d3, d4, y1, y2);
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
const relativeAvailable = (
  currentX: number,
  currentY: number,
  pieceX: number,
  pieceY: number,
  color: string,
  innerElem: any,
  obstructionObject: any,
  piece: any,
  nextPiece: string
) => {
  const { x1, x2, y1, y2, x1y1, x2y1, x1y2, x2y2 } = obstructionObject;
  //can't move to own color.
  if ((currentX === pieceX && currentY === pieceY) || color === innerElem.color)
    return false;
  switch (piece) {
    case "king":
      return (
        pieceX - 1 <= currentX &&
        currentX <= pieceX + 1 &&
        pieceY - 1 <= currentY &&
        currentY <= pieceY + 1
      );
    case "pawn":
      return legalPawn(
        currentX,
        currentY,
        pieceX,
        pieceY,
        innerElem,
        color,
        nextPiece
      );
    case "bishop":
      return legalBishop(
        currentX,
        currentY,
        pieceX,
        pieceY,
        x1y1[0],
        x2y1[0],
        x1y2[0],
        x2y2[0]
      );
    case "rook":
      return legalRook(
        currentX,
        currentY,
        pieceX,
        pieceY,
        x1[0],
        x2[0],
        y1[1],
        y2[1]
      );
    case "queen":
      return (
        legalRook(
          currentX,
          currentY,
          pieceX,
          pieceY,
          x1[0],
          x2[0],
          y1[1],
          y2[1]
        ) ||
        legalBishop(
          currentX,
          currentY,
          pieceX,
          pieceY,
          x1y1[0],
          x2y1[0],
          x1y2[0],
          x2y2[0]
        )
      );
    case "knight":
      return legalKnight(currentX, currentY, pieceX, pieceY);
    default:
      return false;
  }
  /*
        //Handle every place it can go.
        return (
          (piece === "pawn" &&
           )) ||
          ((piece === "bishop" || piece === "queen") &&
            ) ||
          ((piece === "rook" || piece === "queen") &&
            ) ||
          (legalKnight(currentX, currentY, pieceX, pieceY) && piece === "knight")
        )
*/
};

export const checkForCheck = (state: any, payload: any) => {
  const [x, y] = payload;
  const { color } = state.board[y][x];
  const obstructionObject = scanObstruct(state, payload);
  const doublePawnY = color === "white" ? 5 : 2;
  const nextPiece = state.board[doublePawnY][x].piece;
  let check = false;
  const attackDir = color === "white" ? -1 : 1;
  const checkArr = [];
  const { d1, d2, d3, d4, x1, y1, x2, y2 } = obstructionObject;
  const rookKing = rookMoves(x, y, x1[0], y1[1], x2[0], y2[1]);
  const bishopKing = bishopMoves(x, y, d1, d2, d3, d4);
  console.log(bishopKing)
  const knightKing = knightMoves(x, y);
  const pawnKing = pawnMoves(x, y, attackDir, d1, d2, d3, d4, y1, y2);
  console.log(payload)
  //console.log("input", payload[0], payload[1])
  const myForEach = (testingArr: any, testingPiece: any) => {
    let inDanger = false;
    testingArr.forEach((elem: any, index: number) => {
      //console.log("run",elem[0], elem[1])
      if (withinBoard(elem[0]) && withinBoard(elem[1]) && !inDanger) {
        // console.log(testingPiece,state.board[elem[1]][elem[0]].piece,state.board[elem[1]][elem[0]].color,color)
        if (
          testingPiece === state.board[elem[1]][elem[0]].piece &&
          state.board[elem[1]][elem[0]].color !== color
        ) {
          console.log("exec");
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

  state.board.forEach((elem: any, index: number) => {
    elem.forEach((innerElem: any, innerIndex: number) => {
      if (
        relativeAvailable(
          innerIndex,
          index,
          x,
          y,
          color,
          innerElem,
          obstructionObject,
          innerElem.piece,
          nextPiece
        ) &&
        innerElem.piece !== color
      ) {
        //check = true;
      }
    });
  });
  return check;
};

const legalQueen = () => {};
const legalKing = () => {};
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
//check if move is legal and set available accordingly.
export const showAllAvailableSpots = (
  state: any,
  payload: [number, number]
) => {
  const [x, y] = payload;
  const board = state.board;
  const { piece, color } = state.board[y][x];
  const otherOption = (x: any, a: any, b: any) => {
    return x === a ? a : b;
  };
  //check for obstructions in the possible paths.

  //execute scanObstruct
  const obstructionObject = scanObstruct(state, payload);
  const doublePawnY = color === "white" ? 5 : 2;
  const attackDir = color === "black" ? 1 : -1;
  const nextPiece = state.board[doublePawnY][x].piece;
  const possibleAttacks = availableMoves(
    x,
    y,
    piece,
    obstructionObject,
    attackDir,
    state.board
  );
  const { d1, d2, d3, d4, x1, y1, x2, y2 } = obstructionObject;
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
    let intoCheck = false;
    if (withinBoard(attackArr[0]) && withinBoard(attackArr[1])) {
      const potentialBoardState = moveToAvailableSpot(
        potentialState,
        attackArr
      );
console.log(potentialBoardState.board)
      const testingY = potentialBoardState.board.findIndex((array: any) => {
        return array.find((elem: any) => {
          return elem.piece === "king" && elem.color === state.turn.color;
        });
      });
      console.log(testingY)
      if(testingY>=0){
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

  console.log(checkArr);
  const returnedState= {
    ...potentialState,

    board: potentialState.board.map((elem: any, index: number) => {
     return  elem.map((innerElem: any, innerIndex: number) => {
        console.log(
          checkArr.some((checkTuple: any) => {
            return compareTuple([innerIndex, index], checkTuple);
          })
        );
        if (
          (checkArr.some((checkTuple: any) => {
            return compareTuple([innerIndex, index], checkTuple);
          })&&potentialState.currentPiece.color===potentialState.turn.color)
        ){
          return {
            ...innerElem,
            available: "no",
          };}
        else
          return {
            ...innerElem,
          };
      });
    }),
  };
  console.log(returnedState);
  return returnedState;
  /*
      
        if (
          relativeAvailable(
            innerIndex,
            index,
            x,
            y,
            color,
            innerElem,
            obstructionObject,
            piece,
            nextPiece
          )
        ) {
          const potentialState = {
            ...state,
            turn: { color: otherOption(color, "white", "black") },
            board: state.board.map((elem: any, testingIndex: number) => {
              return elem.map(
                (innerTestingElem: any, innerTestingIndex: number) => {
                  if (innerTestingIndex === x && testingIndex === y) {
                    return { piece: "" };
                  }
                  if (
                    innerTestingIndex === innerIndex &&
                    testingIndex === index
                  ) {
                    return state.board[y][x];
                  } else return innerTestingElem;
                }
              );
            }),
          };
*/
  /* const testingY = potentialState.board.findIndex((array: any) => {
    return array.find((elem: any) => {
      return elem.piece === "king" && elem.color === state.turn.color;
    });
  });
  if (testingY < 0) return { ...innerElem, available: "no" };
  const testingX = potentialState.board[testingY].findIndex((elem: any) => {
    return elem.piece === "king" && elem.color === state.turn.color;
  });
  if (
    false //checkForCheck(potentialState, [testingX, testingY]            )
  ) {
    //return { ...innerElem, available: "no" };
  } else return { ...innerElem, available: "yes" };*/
};

//If move is legal execute move.
export const moveToAvailableSpot = (state: any, payload: [number, number]) => {
  const [x, y] = payload;
  const newState = {
    board: state.board.map((elem: any, index: number) =>
      elem.map((innerElem: any, innerIndex: number) => {
        // Check if we can move there.
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
  };
  const testingY = newState.board.findIndex((array: any) => {
    return array.find((elem: any) => {
      return elem.piece === "king" && elem.color !== state.turn.color;
    });
  });
  const testingX = newState.board[testingY].findIndex((elem: any) => {
    return elem.piece === "king" && elem.color !== state.turn.color;
  });
  const inCheck = false; //checkForCheck(newState, [testingX, testingY]);
  let checkMate = false;

  return { ...newState, checkStatus: { check: inCheck, checkMate } };
};
