import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  const classes = props.value.isWin ? "square square-winner" : "square";
  return (
    <button className={classes} onClick={props.onClick}>
      {props.value.text}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(i) {
    var cols = [];
    for (var j = 0; j < 3; j++) {
      cols.push(this.renderSquare(i*3 + j));
    }
    return (
      <div className="board-row" key={i}>
        {cols}
      </div>
    );
  }

  renderBoard() {
    var rows = [];
    for (var i = 0; i < 3; i++) {
      rows.push(this.renderRow(i));
    }
    return rows;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill({text: null, isWin: false}),
        move: null
      }],
      stepNumber: 0,
      xIsNext: true,
      listAscending: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = JSON.parse(JSON.stringify(current.squares)); /* deep copy */
    if (calculateWinner(squares) || squares[i].text) {
      return;
    }
    const nextLetter = this.state.xIsNext ? 'X' : 'O';
    squares[i] = {text: nextLetter, isWin: false};
    this.setState({
      history: history.concat([{
        squares: squares,
        move: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  onAscendingToggle() {
    this.setState({
      listAscending: !this.state.listAscending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const full = isFull(current.squares);

    const moves = history.map((step, move) => {
      const i = step.move;
      const desc1 = move ?
        'Go to move #' + move + ' (' + colNum(i) + ',' + rowNum(i) + ')' :
        'Go to game start';
      const desc = step === current ?
        <b>{desc1}</b> :
        desc1;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (full) {
      status = 'Game result: Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.onAscendingToggle()}>
              {this.state.listAscending ? 'Show history descending' : 'Show history ascending'}
            </button>
          </div>
          <ol>{this.state.listAscending ? moves : moves.slice().reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a].text
      && squares[a].text === squares[b].text
      && squares[a].text === squares[c].text)
    {
      squares[a].isWin = true;
      squares[b].isWin = true;
      squares[c].isWin = true;
      return squares[a].text;
    }
  }
  return null;
}

function isFull(squares) {
  for (let i = 0; i < 9; i++) {
    if (!squares[i].text) {
      return false;
    }
  }
  return true;
}

function colNum(i) {
  return i % 3 + 1;
}

function rowNum(i) {
  return Math.floor(i / 3) + 1;
}
