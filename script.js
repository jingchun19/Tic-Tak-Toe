let player_confirm_btn = document.querySelector("#submit-btn");
let playerOne = "X";
let playerTwo = "O";
let currentPlayer = "X";
let moveCount = 0;

function playerSelection(playerOne, playerTwo, isPlayerOne) {
    let playerText = document.querySelector("#player-turn");
    playerText.innerHTML = isPlayerOne ? `PLAYER ONE (${playerOne}) TURN` : `PLAYER TWO (${playerTwo}) TURN`;
}

player_confirm_btn.addEventListener(`click`, (e) => {
    e.preventDefault();
    let isX = document.querySelector("#X").checked;
    playerOne = isX ? "X" : "O";
    playerTwo = isX ? "O" : "X";
    currentPlayer = playerOne;
    let selectionForm = document.querySelector(".form-modal");
    selectionForm.style.display = "none";
    playerSelection(playerOne, playerTwo, true);
})

const GameBoard = (function () {
    let boardArray = Array(3).fill(null).map(() => Array(3).fill(``));
    
    const checkWin = () => {
        const checkWinVertical = (board) => {
            for(let j = 0; j < 3; j++) {
                let firstElement = null;
                let count = 0;
                for(let i = 0; i < 3; i++) {
                    firstElement = (i == 0) ? board[i][j] : firstElement;
                    if (firstElement == ``) {
                        break;
                    }
                    count = (firstElement == board[i][j]) ? count + 1 : count;
                }
                if (count == 3) {
                    return true;
                }
            }
            return false;
        };
        const checkWinDiagonal = (board) => {
            // first win con: [0][0], [1][1], [2][2]
            if (board[0][0] !== '' && 
                board[0][0] === board[1][1] && 
                board[1][1] === board[2][2]) {
                return true;
            }

            // second win con: [2][0], [1][1], [0][2]
            if (board[2][0] !== '' &&
                board[2][0] === board[1][1] && 
                board[1][1] === board[0][2]) {
                return true;
            }

            // No diagonal win
            return false;
        };

        const checkWinHorizontal = (board) => {
            for(let i = 0; i < 3; i++) {
                let firstElement = null;
                let count = 0;
                for(let j = 0; j < 3; j++) {
                    firstElement = (j == 0) ? board[i][j] : firstElement;
                    if (firstElement == ``) {
                        break;
                    }
                    count = (firstElement == board[i][j]) ? count + 1 : count;
                }
                if (count == 3) {
                    return true;
                }
            }
            return false;
        };
        return checkWinDiagonal(boardArray) || checkWinHorizontal(boardArray) || checkWinVertical(boardArray);
    }

    const render = () => {
        let boardHTML = document.querySelector("#board");
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                boardHTML.innerHTML += `
                    <div class="board-item" id="${i}-${j}"></div>`;
            }
        }
    }

    const updateBoard = (row, col) => {
        boardArray[row][col] = currentPlayer;
    }

    return {
        checkWin, render, updateBoard
    };
})();

const Game = (function () {

    const switchPlayer = () => {
        let playerTEXT = document.querySelector("#player-turn");
        playerTEXT.innerHTML = (playerOne == currentPlayer) ? `PLAYER ONE (${playerOne}) TURN` : `PLAYER TWO (${playerTwo}) TURN`;
    };

    const makeMove = (row, col) => {
        let cellID = row + "-" + col;
        let classID = "#" + CSS.escape(cellID);
        let cell = document.querySelector(classID);
        cell.innerHTML = `
            <h1>${currentPlayer}</h1>
            `;
        GameBoard.updateBoard(row, col);
        let isEnd = GameBoard.checkWin();
        moveCount++;
        if (isEnd || moveCount == 9) {
            gameEnd(currentPlayer, (moveCount == 9 && !isEnd));
        }
        currentPlayer = (currentPlayer == playerOne) ? playerTwo : playerOne;
        switchPlayer();
    }

    
    return {
        makeMove
    };
})();

function gameEnd(player, draw) {
    let gameEndCard = document.createElement(`div`);
    let gameEnd_modal = document.querySelector(".gameEnd");
    let playerNumber = (player == playerOne) ? "ONE" : "TWO";
    gameEndCard.innerHTML = !draw ? `
        <div class="header">
            <h2 class="player-win"> CONGRATS PLAYER ${playerNumber} </h2>
        </div>
        <div class="button-res">
            <button class="restart-btn" onclick="restartGame()"> Restart </button>
        </div>` :
        `<div class="header">
            <h2 class="player-win"> DRAW </h2>
        </div>
        <div class="button-res">
            <button class="restart-btn" onclick="restartGame()"> Restart </button>
        </div>`;
    gameEnd_modal.appendChild(gameEndCard);
    gameEnd_modal.style.display = "flex";
}

function restartGame() {
    location.reload();
}

const board = (function () {
    let boardArray = Array(3).fill(null).map(() => Array(3).fill(``));
    console.log(boardArray);
    const makePlayerMove = (row, column, player) => {
        boardArray[row][column] = player;
        render(boardArray);
        let isWin = checkWin(boardArray);
        if (isWin) {
            gameEnd(player);
        }
        currentPlayer = (player == playerOne) ? playerTwo : playerOne;
    }

    return {
        makePlayerMove, boardArray
    };
})();

GameBoard.render();

let boardCells = document.querySelectorAll(".board-item");

boardCells.forEach(cell => {
    cell.addEventListener(`click`, (e) => {
        let cellArray = cell.id.split("-", 2);
        console.log(cellArray);
        let row = Number(cellArray[0]);
        let col = Number(cellArray[1]);
        Game.makeMove(row, col);
    }, {once: true});
})


