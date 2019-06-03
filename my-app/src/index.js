import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={`square ${props.winStyle}`} onClick={props.onClick}>
      {props.value}
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
        winStyle={this.props.winLine.includes(i) ? 'win' : ''}
      />
    );
  }

  render() {
    let layout = [];
    let rowSquares = [];
    const squareCols = 3;
    const squareRows = 3;
    let squaresAdded = 0;

    for (let i = 0; i < squareRows; i++) {
      for (let j = 0; j < squareCols; j++) {
        rowSquares.push(this.renderSquare(squaresAdded++));
      }
      layout.push(
        <div key={i} className='board-row'>
          {rowSquares}
        </div>
      );
      rowSquares = [];
    }

    return <div>{layout}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          column: null,
          row: null
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      descOrder: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    let col, row;
    if (i < 3) {
      row = 1;
      col = i + 1;
    } else if (i >= 3 && i < 6) {
      row = 2;
      col = i - 2;
    } else {
      row = 3;
      col = i - 5;
    }

    this.setState({
      history: history.concat([
        {
          squares: squares,
          column: col,
          row: row
        }
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  changeOrder() {
    this.setState({
      descOrder: !this.state.descOrder
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const orderText = this.state.descOrder ? 'Descending' : 'Ascending';

    const moves = history.map((step, move) => {
      const desc = move
        ? 'Go to move #' + move + ' (' + step.column + ', ' + step.row + ')'
        : 'Go to game start';

      return (
        <li key={move}>
          <button
            onClick={() => {
              this.jumpTo(move);
            }}
            className={this.state.stepNumber === move ? 'active' : ''}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + current.squares[winner[0]];
    } else if (current.squares.every(value => value != null) && !winner) {
      status = 'Draw Game!';
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            winLine={winner ? winner : []}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <button onClick={() => this.changeOrder()}>{orderText}</button>
          <ol reversed={this.state.descOrder}>
            {this.state.descOrder ? moves.slice().reverse() : moves}
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      console.log([a, b, c]);
      return [a, b, c];
    }
  }
  return null;
}
