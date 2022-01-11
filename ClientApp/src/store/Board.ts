import {  Reducer } from "redux";
import {
  showAllAvailableSpots,
  moveToAvailableSpot,
  tranformToPawn,
  setWin
} from "./reducerFunctions";
// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface BoardState {
  board: any;
  currentPiece: any;
  turn: any;
  win: any;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export interface ShowAvailable {
  type: "SHOW_AVAILABLE";
}
export interface MoveToPlace {
  type: "MOVE_TO_PLACE";
}
export interface PawnTransform {
  type: "PAWN_TRANSFORM";
}
export interface ShowWin {
  type: "SHOW_WIN";
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  showAvailable: (x: number, y: number) =>
    ({
      type: "SHOW_AVAILABLE",
      payload: [x, y],
    } as ShowAvailable),

  moveToPlace: (x: number, y: number) =>
    ({
      type: "MOVE_TO_PLACE",
      payload: [x, y],
    } as MoveToPlace),
  pawnTransform: (payload: string) =>
    ({
      type: "PAWN_TRANSFORM",
      payload,
    } as PawnTransform),
  showWin: (payload: string) => ({ type: "SHOW_WIN", payload }),
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<BoardState> = (
  state: BoardState | undefined,
  incomingAction: any
): BoardState => {
  if (state === undefined) {
    //inner index=row outerIndex=column
    return {
      currentPiece: { piece: "" },
      turn: { color: "white" },
      win: { color: "" },
      board: [
        [
          {
            piece: "rook",
            color: "black",
            available: "no",
          },
          {
            piece: "knight",
            color: "black",
            available: "no",
          },
          {
            piece: "bishop",
            color: "black",
            available: "no",
          },
          {
            piece: "queen",
            color: "black",
            available: "no",
          },
          {
            piece: "king",
            color: "black",
            available: "no",
          },
          {
            piece: "bishop",
            color: "black",
            available: "no",
          },
          {
            piece: "knight",
            color: "black",
            available: "no",
          },
          {
            piece: "rook",
            color: "black",
            available: "no",
          },
        ],
        [
          {
            piece: "pawn",
            color: "black",
            available: "no",
          },
          {
            piece: "pawn",
            color: "black",
            available: "no",
          },
          {
            piece: "pawn",
            color: "black",
            available: "no",
          },
          {
            piece: "pawn",
            color: "black",
            available: "no",
          },
          {
            piece: "pawn",
            color: "black",
            available: "no",
          },
          {
            piece: "pawn",
            color: "black",
            available: "no",
          },
          {
            piece: "pawn",
            color: "black",
            available: "no",
          },
          {
            piece: "pawn",
            color: "black",
            available: "no",
          },
        ],
        [
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
        ],
        [
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
        ],
        [
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
        ],
        [
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
          {
            piece: "",
            color: "",
            available: "no",
          },
        ],
        [
          {
            piece: "pawn",
            color: "white",
            available: "no",
          },
          {
            piece: "pawn",
            color: "white",
            available: "no",
          },
          {
            piece: "pawn",
            color: "white",
            available: "no",
          },
          {
            piece: "pawn",
            color: "white",
            available: "no",
          },
          {
            piece: "pawn",
            color: "white",
            available: "no",
          },
          {
            piece: "pawn",
            color: "white",
            available: "no",
          },
          {
            piece: "pawn",
            color: "white",
            available: "no",
          },
          {
            piece: "pawn",
            color: "white",
            available: "no",
          },
        ],
        [
          {
            piece: "rook",
            color: "white",
            available: "no",
          },
          {
            piece: "knight",
            color: "white",
            available: "no",
          },
          {
            piece: "bishop",
            color: "white",
            available: "no",
          },
          {
            piece: "queen",
            color: "white",
            available: "no",
          },
          {
            piece: "king",
            color: "white",
            available: "no",
          },
          {
            piece: "bishop",
            color: "white",
            available: "no",
          },
          {
            piece: "knight",
            color: "white",
            available: "no",
          },
          {
            piece: "rook",
            color: "white",
            available: "no",
          },
        ],
      ],
    };
  }
  const action = incomingAction;
  switch (action.type) {
    case "SHOW_AVAILABLE":
      return showAllAvailableSpots(state, action.payload);
    case "MOVE_TO_PLACE":
      return moveToAvailableSpot(state, action.payload);
    case "PAWN_TRANSFORM":
      return tranformToPawn(state, action.payload);
    case "SHOW_WIN":
        return setWin(state, action.payload);

    default:
      return state;
  }
};
