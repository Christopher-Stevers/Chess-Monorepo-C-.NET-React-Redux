const withinBoard = (x: number) => {
  return 0 <= x && x <= 7;
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
  };
};
const checkForCheck = (state: any, payload: any) => {
  const [x, y] = payload;
  console.log(scanObstruct(state, payload));
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
       ( ((pieceY === 1 && currentY === pieceY + 2 && color === "black") ||
        (pieceY === 6 && currentY === pieceY + -2 && color === "white"))&&nextPiece==="")
        )) ||
    ((currentX === pieceX + 1 || currentX === pieceX - 1) &&
      innerElem.piece !== "" &&
      currentY === pieceY + playingDir &&
      color === "white" &&
      color !== innerElem.color &&
      innerElem.color)
  ) {
    console.log(pieceX, pieceY);
    return true;
  }
  return false;
};
const legalRook = () => {};
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
const legalBishop = () => {};
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
//If move is legal execute move.
export const moveToAvailableSpot = (state: any, payload: [number, number]) => {
  checkForCheck(state, payload);
  const [x, y] = payload;

  return {
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
};
//check if move is legal and set available accordingly.
export const showAllAvailableSpots = (
  state: any,
  payload: [number, number]
) => {
  const [x, y] = payload;
  const { piece, color } = state.board[y][x];
  //check for obstructions in the possible paths.

  //execute scanObstruct
  const obvj = scanObstruct(state, payload);
  const { x1, x2, y1, y2, x1y1, x2y1, x1y2, x2y2 } = obvj;
  return {
    ...state,
    currentPiece: { piece, color, x, y },
    board: state.board.map((elem: any, index: number) =>
      elem.map((innerElem: any, innerIndex: number) => {
        //can't move to own color.
        if ((innerIndex === x && index === y) || color === innerElem.color)
          return {
            ...innerElem,
            available: "no",
          };
        if (legalKnight(innerIndex, index, x, y) && piece === "knight") {
          return {
            ...innerElem,
            available: "yes",
          };
        }

        if (piece === "king") {
          if (
            x - 1 <= innerIndex &&
            innerIndex <= x + 1 &&
            y - 1 <= index &&
            index <= y + 1
          ) {
            return {
              ...innerElem,
              available: "yes",
            };
          }
        }
        //why are pawns so complicated.

        const playingDir = color === "white" ? -1 : 1;
        if (
          piece === "pawn" &&
          legalPawn(
            innerIndex,
            index,
            x,
            y,
            innerElem,
            color,
            state.board[y + playingDir][x].piece
          )
        ) {
          console.log("myfunc");
          return {
            ...innerElem,
            available: "yes",
          };
        }
        if (
          ((x - innerIndex === y - index &&
            x1y1[0] >= innerIndex &&
            innerIndex >= x2y2[0]) ||
            (x - innerIndex === -y + index &&
              x1y2[0] <= innerIndex &&
              innerIndex <= x2y1[0])) &&
          (piece === "queen" || piece === "bishop")
        ) {
          return {
            ...innerElem,
            available: "yes",
          };
        }
        if (
          innerIndex === x &&
          y1[1] <= index &&
          index <= y2[1] &&
          (piece === "queen" || piece === "rook")
        ) {
          return {
            ...innerElem,
            available: "yes",
          };
        }
        if (
          index === y &&
          x1[0] <= innerIndex &&
          innerIndex <= x2[0] &&
          (piece === "queen" || piece === "rook")
        ) {
          return {
            ...innerElem,
            available: "yes",
          };
        } else
          return {
            ...innerElem,
            available: "no",
          };
      })
    ),
  };
  /*return {
    board: state.board.map((elem: any, index: number) =>
      elem.map((innerElem: any, innerIndex: number) => {
        if (innerIndex === x && index === y)
          return {
            ...innerElem,
            available: "no",
          };
        if (innerIndex === x && obvj.y1 <= index && index <=obvj.y2){
          return {
            ...innerElem,
            available: "yes",
          };}
        if (index === y&& obvj.x1 <= innerIndex && innerIndex <= obvj.x2){
          return {
            ...innerElem,
            available: "yes",
          };}
        else
          return {
            ...innerElem,
            available: "no",
          };
      })
    ),
  };*/
};
