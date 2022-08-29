const elements = {
    game: document.querySelector('#game'),
    cells: document.querySelectorAll('#game .cell'),
    turn: document.querySelector('.turn'),
}

function Player(value) {
    this.value = value;
}

function allEqual(values) {
    let result = true;

    if (values.some(item => !item)) { return false; }

    for (let i = 1; i < values.length && result; i++) {
        result = values[i - 1] == values[i];
        if (!result) { break; }
    }

    return result;
}

function Game(game) {
    this.turn = 0;
    this.ai = true;
    this.players = [
        new Player('x'),
        new Player('o'),
    ];

    this.over = false;
    this.win = null;

    this.winPlace = null;

    this.state = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    if (game) {
        this.state = game.state.map(row => {
            return row.map(col => ({ value: col.value }));
        });
        this.turn = game.turn;
        this.over = game.over;
        this.win = game.win;
        this.winPlace = game.winPlace;
    }

    this.reset = function() {
        this.turn = 0;
        this.over = false;
        this.win = null;
        this.winPlace = null;

        this.state.forEach(row => {
            row.forEach(cell => {
                cell.element.classList.remove('o');
                cell.element.classList.remove('x');
                cell.value = null;
            });
        });

        this.draw();
    }

    this.setup = function () {
        elements.cells.forEach((cell, i) => {
            const col = i % 3;
            const row = parseInt(i / 3);

            this.state[row][col] = {
                value: null,
                element: cell,
            };

            cell.addEventListener('click', () => {
                if ((this.ai && this.turn !== 0) || this.state[row][col].value || this.over) { return; }

                this.place(row, col);

                if (this.over) {
                    this.draw();
                    return;
                }

                if (this.ai) {
                    const move = this.minimax().bestMove;
                    this.place(move[0], move[1]);
                }

                this.evaluateGame();
                this.draw();
            });
        });
    }

    this.evaluateGame = function() {
        const rows = [
            allEqual([this.state[0][0].value, this.state[0][1].value, this.state[0][2].value]),
            allEqual([this.state[1][0].value, this.state[1][1].value, this.state[1][2].value]),
            allEqual([this.state[2][0].value, this.state[2][1].value, this.state[2][2].value]),
        ];
        const cols = [
            allEqual([this.state[0][0].value, this.state[1][0].value, this.state[2][0].value]),
            allEqual([this.state[0][1].value, this.state[1][1].value, this.state[2][1].value]),
            allEqual([this.state[0][2].value, this.state[1][2].value, this.state[2][2].value]),
        ];
        const diagonals = [
            allEqual([this.state[0][0].value, this.state[1][1].value, this.state[2][2].value]),
            allEqual([this.state[2][0].value, this.state[1][1].value, this.state[0][2].value]),
        ];

        const rowIndex = rows.findIndex(r => r);
        const colIndex = cols.findIndex(r => r);
        const diagonalIndex = diagonals.findIndex(r => r);

        if (rowIndex !== -1) {
            this.winPlace = {
                index: rowIndex,
                type: 'row',
            };
        } else if (colIndex !== -1) {
            this.winPlace = {
                index: colIndex,
                type: 'col',
            };
        } else if (diagonalIndex !== -1) {
            this.winPlace = {
                index: diagonalIndex,
                type: 'diagonal',
            };
        }

        if (rowIndex !== -1 || colIndex !== -1 || diagonalIndex !== -1) {
            this.win = this.turn;
        }

        if (rowIndex !== -1 || colIndex !== -1 || diagonalIndex !== -1 || !this.get_available_moves().length) {
            this.over = true;
        }
    }

    this.place = function(row, col) {
       this.state[row][col].value = this.players[this.turn].value;

       this.evaluateGame();

       this.turn = this.turn === 0 ? 1 : 0;
    }

    this.draw = function() {
        if (this.win !== null) {
            elements.turn.innerHTML = `Player ${this.players[this.win].value} won`;
        } else {
            elements.turn.innerHTML = `It's ${this.players[this.turn].value}'s turn`;
        }

        elements.game.classList.forEach(value => elements.game.classList.remove(value));
        if (this.winPlace && this.winPlace.type) {
            elements.game.classList.add(`win-${this.winPlace.type}`);
            elements.game.classList.add(`win-${this.winPlace.type}-${this.winPlace.index}`);
        }

        this.state.forEach(row => {
            row.forEach(cell => {
                cell.element.classList.remove('o');
                cell.element.classList.remove('x');

                if (cell.value) {
                    cell.element.classList.add(cell.value);
                }
            });
        });
    }

    this.get_available_moves = function() {
        const moves = [];
        this.state.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (!cell.value) {
                    moves.push([rowIndex, colIndex]);
                }
            });
        });

        return moves;
    }

    this.get_new_state = function(move) {
        const newGame = new Game(this);
        newGame.place(move[0], move[1]);
        return newGame;
    }

    // ------------------------------------

    this.minimax = function() {
        if (this.over) {
            return { score: this.score(), bestMove: null };
        }

        let scores = [];
        let moves = [];

        let bestScore;
        let bestIndex = -1;

        if (this.turn === 0) {
            bestScore = Infinity;
        } else {
            bestScore = -Infinity;
        }

        const available_moves = this.get_available_moves();
        available_moves.forEach(move => {
            const possible_game = this.get_new_state(move);
            const minimaxResult = possible_game.minimax();

            scores.push(minimaxResult.score);
            moves.push(move);

            if (
                (this.turn === 0 && minimaxResult.score !== null && minimaxResult.score < bestScore) ||
                (this.turn === 1 && minimaxResult.score !== null && minimaxResult.score > bestScore)
            ) {
                bestScore = minimaxResult.score;
                bestIndex = scores.length - 1;
            }
        });


        return { bestMove: moves[bestIndex] || null, score: bestScore };
    }

    this.score = function() {
        switch(this.win) {
            case 0: return -10; // player
            case 1: return 10; // opponent
            default: return 0;
        }
    }
}


const game = new Game();
game.setup();
game.draw();

// document.addEventListener('click', () => {
//     if (game.over) {
//         game.reset();
//     }
// });

document.addEventListener('keydown', () => {
    if (game.over) {
        game.reset();
    }
});