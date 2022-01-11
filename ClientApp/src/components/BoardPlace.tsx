import React, { FC, } from "react";
import { connect } from "react-redux";
import * as BoardStore from "../store/Board";
import "./Layout.css";

import "./BoardPlace.css";

type props = {
  title: any;
  turn: any;
  currentPiece: any;
  index: number;
  outerIndex: number;
  showAvailable: Function;
  moveToPlace: Function;
  pawnTransform: Function;
  showWin: Function;
};
const BoardPlace: FC<props> = ({
  title,
  turn,
  index,
  outerIndex,
  currentPiece,
  showAvailable,
  moveToPlace,
  pawnTransform,
  showWin
}) => {
  const boardPieces: any = ["rook", "knight", "bishop", "queen"];
  if(title.piece==="king"&&title.color!==turn.color&&title.available==="yes"){
      showWin(turn.color);
  }
  function handlePlaceClick() {
      console.log(currentPiece, turn)
    if (currentPiece.piece&&title.available==="yes"&&currentPiece.color===turn.color) {
      moveToPlace(index, outerIndex);
    } else showAvailable(index, outerIndex);
  }
  /*
    function toLetter(input: number) {
        const arr = ["h", "g", "f", "e", "d", "c", "b", "a"];
        return arr[input];
    }*/
  const handlePawnClick = (e:any) => {
    console.log(e.target.alt);
    pawnTransform(e.target.alt);
  };
  return (
    <div
      onClick={handlePlaceClick}
      className={
        title.available === "yes"
          ? "red"
          : (outerIndex + index) % 2 === 0
          ? "black"
          : "white"
      }
    >
      {title.choose ? (
        <div className="chooseOverlay boardContainer">
          <div className="chooseModal">
            {boardPieces.map(function (elem: any) {
              return (
                <button name={elem} className="chooseButton" onClick={handlePawnClick}>
                  {" "}
                  <img
                    alt={elem}
                    className="pieceImg"
                    src={`chessPieces/${title.color + elem}.png`}
                  ></img>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        title.piece && (
          <img
            alt={`chessPieces/${title.color + " " + title.piece}`}
            className="pieceImg"
            src={`chessPieces/${title.color + title.piece}.png`}
          ></img>
        )
      )}
    </div>
  );
};
export default connect(null, BoardStore.actionCreators)(BoardPlace);
