import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as BoardStore from '../store/Board';
import BoardPlace from "./BoardPlace";
import "./Board.css";


type BoardProps =
    BoardStore.BoardState &
    typeof BoardStore.actionCreators &
    RouteComponentProps<{}>;

class Board extends React.PureComponent<BoardProps> {
    public render() {
        const capitalize=(word:string)=>{
            const firstLetter=word.slice(0,1);
            const wordRegex= /(^\w)(\w*)/
            const value= word.replace(wordRegex, `${firstLetter.toUpperCase()}$2`);
            return value;

        }
        return (
            <React.Fragment>
                <h1>Board</h1>
                <p>Check? {this.props.checkStatus.check.toString()}</p>
                <p>{capitalize(this.props.turn.color)}{(this.props.win.color)? " already won.":`'s turn.`} </p>

                  <div className="board">
                    {this.props.board.map((elem: any, outerIndex:number) => 
                        elem.map((innerElem: string, index: number) => <BoardPlace   currentPiece={this.props.currentPiece} turn={this.props.turn} title={innerElem} index={index} outerIndex={outerIndex} /> )

                    )}
                </div>
               
            </React.Fragment>
        );
    }
};

export default connect(
    (state: ApplicationState) => state.board,
    BoardStore.actionCreators
)(Board);
