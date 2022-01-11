export const tranformToPawn =(state: any, payload: string)=>{
return {...state,
board: state.board.map((elem:any)=>{
  return elem.map((innerElem:any)=>{
    if(innerElem.choose){
      return    {...innerElem,
    choose: false,
    piece: payload
  }}
    return innerElem;
  })
})}
}
//did we win
export const setWin =(state:any, payload: string)=>{
  return {...state, win: {color: payload}} 
}
//If move is legal execute move.
export const moveToAvailableSpot =(state: any, payload:[number, number])=>{
  console.log(state.turn);
  const [x,y]=payload;
  
return {
  board: state.board.map((elem: any, index: number) =>
  elem.map((innerElem: any, innerIndex: number) => {
    // Check if we can move there.
    if(innerElem.available==="yes"&&index===y&&innerIndex===x){
      //Handle pawn grow up
      if(state.currentPiece.piece==="pawn"&&(index===0||index===7)){
        return { ...state.currentPiece,
          choose:true,
          available: "no"}
      }
      return{ ...state.currentPiece,
      available: "no"}
    }
    if(state.currentPiece.x===innerIndex&&state.currentPiece.y===index&&state.board[y][x].available==="yes"){
      
      return {
        color: "",
        piece:"",
        available: "no",
      }
    }
    return {...innerElem,
    available:"no"};
  })),
  currentPiece:{piece: ""},
  
  turn:{color:(state.turn.color==="white")?"black":"white"},
  win: ""
};
}
//check if move is legal and set available accordingly.
export const showAllAvailableSpots = (
  state: any,
  payload: [number, number]
) => {
  const [x, y] = payload;
  const { piece, color } = state.board[y][x];
  //check for obstructions in the possible paths.
  const scanObstruct = () => {
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
      return [currentX, currentY];
    };
//create object showing where obstructions are hit on each direction and diagonal.
    return {
      x1: scanIndie(-1, 0)[0],
      x2: scanIndie(1, 0)[0],
      y1: scanIndie(0, -1)[1],
      y2: scanIndie(0, 1)[1],
      x1y1: scanIndie(1, 1)[0],
      x2y1: scanIndie(1, -1)[0],
      x1y2: scanIndie(-1, 1)[0],
      x2y2: scanIndie(-1, -1)[0],
    };
  };
  //execute scanObstruct
  const obvj = scanObstruct();
  console.log( obvj.x2, obvj.x1);
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
          if((piece==="knight")&&(Math.abs(innerIndex-x)+Math.abs(index-y))===3&&Math.abs(innerIndex-x)<3&&Math.abs(index-y)<3){
            return {
              ...innerElem,
              available: "yes"
            }
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
        if (piece === "pawn") {
          if (
              (innerIndex === x &&
                  innerElem.piece === "" &&
                  (index === y + 1 || (y === 1 && index === y + 2)) &&
                  color === "black") ||
              (innerIndex === x &&
                  innerElem.piece === "" &&
                  (index === y - 1 || (y === 6 && index === y + -2)) &&
                  color === "white") ||
              ((innerIndex === x + 1 || innerIndex === x - 1) &&
                  innerElem.piece !== "" &&
                  index === y + 1 &&
                  color === "black" &&
                  color !== innerElem.color &&
                  innerElem.color) ||
              ((innerIndex === x + 1 || innerIndex === x - 1) &&
                  innerElem.piece !== "" &&
                  index === y - 1 &&
                  color === "white" &&
                  color !== innerElem.color &&
                  innerElem.color)
          ) {
            return {
              ...innerElem,
              available: "yes",
            };
          }
          return {
            ...innerElem,
            available: "no",
          };
        }
        if (
          ((x - innerIndex === y - index &&
            obvj.x1y1 >= innerIndex &&
            innerIndex >= obvj.x2y2) ||
            (x - innerIndex === -y + index &&
              obvj.x1y2 <= innerIndex &&
              innerIndex <= obvj.x2y1)) &&
          (piece === "queen" || piece === "bishop")
        ) {
          return {
            ...innerElem,
            available: "yes",
          };
        }
        if (
          innerIndex === x &&
          obvj.y1 <= index &&
          index <= obvj.y2 &&
          (piece === "queen" || piece === "rook")
        ) {
          return {
            ...innerElem,
            available: "yes",
          };
        }
        if (
          index === y &&
          obvj.x1 <= innerIndex &&
          innerIndex <= obvj.x2 &&
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
        console.log(innerIndex)
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
