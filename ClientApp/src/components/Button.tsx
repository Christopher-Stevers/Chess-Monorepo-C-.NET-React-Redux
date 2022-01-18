import React, { FC, } from "react";
import { connect } from "react-redux";
import * as BoardStore from "../store/Board";



type props = {
    reloadBoard: Function;
  };
const Button: FC<props> = ({
  reloadBoard
}) => {
    const handleClick=()=>{
        reloadBoard()
    }
    return (
        <button onClick={handleClick}>New Game</button>)
}

export default connect(null, BoardStore.actionCreators)(Button);
