/* eslint-disable @typescript-eslint/no-explicit-any */
/** @jsxImportSource @emotion/react */
import React, {useReducer, Reducer} from "react";
export const App: React.FC = () => {
    return <Game />;
};

type genGrid = Array<Array<null | string>>;

const generateGrid = (rows: number, cols: number, mapper: any): genGrid => {
    return Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(null).map(mapper));
};

const TicTacToeGrid = () => {
    return generateGrid(3, 3, () => null);
};




interface actionType {
    type: string;
    payload?: any;
}

interface stateType {
    grid: genGrid;
    turn: string;
    status: string;
}

const NEXT_TURN: Record<string,any> = {
    X: "O",
    O: "X"
};

const clone = (state: stateType) => JSON.parse(JSON.stringify(state));
type gridValue = string | null;

const checkThree = (a: gridValue ,b: gridValue,c: gridValue): boolean => {
    if( !a || !b || !c) return false;
    return a===b && b===c;
};

const checkForWin = (grid: genGrid): boolean => {
   const [nw, n, ne, w, c, e, sw, s, se] = grid.flat();

   return (
    checkThree(nw,n,ne) ||
    checkThree(sw,s,se) ||
    checkThree(w,c,e)   ||
    checkThree(nw,w,sw) ||
    checkThree(ne,e,se) ||
    checkThree(nw,c,se) ||
    checkThree(ne,c,sw) ||
    checkThree(n,c,s)
   );
};

const checkForDraw = (grid: genGrid) => {
    return !checkForWin(grid) && grid.flat().filter(Boolean).length === grid.flat().length;
};
const reducer: Reducer<stateType, actionType> = (state,action): stateType => {
    if(state.status === "completed" && action.type !== "RESET") return state;
    switch(action.type) {
        case "RESET": {
            return initialState;
        }
        break;
        case "CLICK": {
            const {x,y} = action.payload;
            const { grid, turn } = state;
            if(grid[y][x]) return state;
            const nextState = clone(state);
            nextState.grid[y][x] = turn;
            if(checkForWin(nextState.grid)) {
                nextState.status = "completed";
                return nextState;
            }
            if( checkForDraw(nextState.grid)) return initialState;
            nextState.turn = NEXT_TURN[turn];
            return nextState;
        }
        break;
        default:
            return state;
    }
    return state;
};

const initialState = {
    grid: TicTacToeGrid(),
    turn: "X",
    status: "In Progress"
};

const Game: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { grid , turn, status} = state;
    const handleClick = (x: number,y: number) => {
        dispatch({type: "CLICK", payload:{x,y}});
    };
    const reset = () => dispatch({type:"RESET"});
    return (
        <div css={{display: "block"}}>
             <div><button onClick= {reset}> RESET </button></div>
             <div> Next Turn : {turn} </div>
             <div>{status === "completed" ? `${turn} Won` : null}</div>
            <Grid grid={grid} handleClick={handleClick}/>
        </div>
    );
};

interface gridProps {
  grid: genGrid;
  handleClick: any;
}

const Grid: React.FC<gridProps> = ({ grid, handleClick }: gridProps) => {
    return (
        <div css={{display: "inline-block"}}>
            <div css={{
                backgroundColor: "grey",
                display: "grid",
                gridTemplateRows: `repeat(${grid.length}, 1fr)`,
                gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
                gridGap: 2
            }}>
                {grid.map((row, rowIdx) =>
                    row.map((value, colIdx) => (
                        <Cell key={`${colIdx}-${rowIdx}`} value={value} onClick={() => handleClick(colIdx,rowIdx)}/>
                    ))
                )}
            </div>
        </div>
    );
};

interface cellProps {
  value: null | string;
  onClick: any;
}

const Cell: React.FC<cellProps> = ({ value , onClick}: cellProps) => {
    return (
        <div css={{
            backgroundColor: "white",
            width: "100px",
            height: "100px"
        }}>
            <button
                css={{
                width: "100%",
                height:"100%"
                }}
                type="button"
                onClick={onClick}
            >
                {value}
            </button>
        </div>
    );
};
