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

const relativeAvailabile = (
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
  const {  color } = state.board[y][x];
    const obstructionObject = scanObstruct(state, payload);
    const doublePawnY = color === "white" ? 5 : 2;
    const nextPiece = state.board[doublePawnY][x].piece;
    let check=false;
    state.board.forEach((elem: any, index: number) => {
      elem.forEach((innerElem: any, innerIndex: number) => {
        if(  relativeAvailabile(innerIndex,index,x,y,color,innerElem,obstructionObject, innerElem.piece,nextPiece)&&innerElem.piece!==color){
          check= true
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
  const testingY= newState.board.findIndex((array:any)=>{return array.find((elem:any)=>{return elem.piece==="king"&&elem.color!==state.turn.color})})
  const testingX=newState.board[testingY].findIndex((elem:any)=>{return elem.piece==="king"&&elem.color!==state.turn.color})
 
  return {...newState, checkStatus: {check: checkForCheck(newState, [testingX, testingY])}};

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
  const obstructionObject = scanObstruct(state, payload);
  const doublePawnY = color === "white" ? 5 : 2;
  const nextPiece = state.board[doublePawnY][x].piece;
  
  checkForCheck(state,payload)
  return {
    ...state,
    currentPiece: { piece, color, x, y },
    board: state.board.map((elem: any, index: number) =>
      elem.map((innerElem: any, innerIndex: number) => {
        if (
          relativeAvailabile(
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
          return { ...innerElem, available: "yes" };
        } else return { ...innerElem, available: "no" };
      })
    ),
  };
};
