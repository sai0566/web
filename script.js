// Login form submission
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || {};

      if (users[username] && users[username] === password) {
        localStorage.setItem('loggedInUser', username); // Store logged-in user
        window.location.href = 'success.html';
      } else {
        alert('Invalid username or password.');
      }
    });
  }

  // SIGNUP
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const username = document.getElementById('newUsername').value;
      const password = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users')) || {};

      if (users[username]) {
        alert('Username already exists.');
        return;
      }

      // Save new user
      users[username] = password;
      localStorage.setItem('users', JSON.stringify(users));

      alert('Signup successful! Please log in.');
      window.location.href = 'index.html';
    });
  }
});

function startGame(game) {
  localStorage.setItem('preferredGame', game); // Save the selected game
  document.getElementById('gameMenu').style.display = 'none';
  if (game === 'tictactoe') {
    document.getElementById('ticTacToeGame').style.display = 'block';
  } else if (game === '2048') {
    document.getElementById('game2048').style.display = 'block';
  }
}

function backToMenu() {
  document.getElementById('ticTacToeGame').style.display = 'none';
  document.getElementById('game2048').style.display = 'none';
  document.getElementById('gameMenu').style.display = 'block';
  document.removeEventListener('keydown', handleKey);
}

// 2048 Game Logic
const gridContainer = document.getElementById('grid-container');
let grid = [],
  score = 0,
  highScore = localStorage.getItem('highScore2048') || 0;

function init2048() {
  grid = Array.from({
    length: 4
  }, () => Array(4).fill(0));
  score = 0;
  addTile();
  addTile();
  drawGrid();
  document.addEventListener('keydown', handleKey);
}

function drawGrid() {
  gridContainer.innerHTML = '';
  for (let row of grid) {
    for (let cell of row) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.textContent = cell || '';
      tile.style.backgroundColor = getTileColor(cell);
      if (cell > 0) {
        tile.setAttribute('data-value', cell);
      }
      gridContainer.appendChild(tile);
    }
  }
  document.getElementById('score').textContent = score;
  document.getElementById('highScore').textContent = highScore;
}

function getTileColor(val) {
  const colors = {
    0: '#cdc1b4',
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e'
  };
  return colors[val] || '#3c3a32';
}

function addTile() {
  const empty = [];
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++)
      if (grid[i][j] === 0) empty.push([i, j]);
  if (empty.length) {
    const [i, j] = empty[Math.floor(Math.random() * empty.length)];
    grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    return true; // Tile was added
  }
  return false; // No empty tiles
}

function isGameOver() {
  // Check for empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        return false; // There's an empty cell, game is not over
      }
    }
  }

  // Check for possible merges (horizontally or vertically)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i][j] === grid[i][j + 1] || grid[j][i] === grid[j + 1][i]) {
        return false; // There's a possible merge, game is not over
      }
    }
  }

  return true; // No empty cells and no possible merges, game over
}

function handleKey(e) {
  const oldGrid = JSON.stringify(grid);
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    move(e.key.replace('Arrow', '').toLowerCase());
    if (JSON.stringify(grid) !== oldGrid) {
      addTile(); // Try to add a tile AFTER the move
      drawGrid();
    }
    // Check for game over AFTER drawing the grid
    if (isGameOver()) {
      setTimeout(() => alert('Game Over! Your score: ' + score), 100);
      document.removeEventListener('keydown', handleKey);
    }
  }
}

function move(dir) {
  const rotate = m => m[0].map((_, i) => m.map(row => row[i]));
  const reverse = m => m.map(r => r.reverse());
  let g = [...grid.map(r => [...r])];
  if (dir === 'up') g = rotate(g);
  if (dir === 'down') g = reverse(rotate(g));
  if (dir === 'right') g = g.map(r => r.reverse());

  for (let row of g) {
    for (let i = 0; i < 3; i++) {
      if (row[i] && row[i] === row[i + 1]) {
        row[i] *= 2;
        score += row[i];
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('highScore2048', highScore);
        }
        row[i + 1] = 0;
      }
    }
    let f = row.filter(v => v !== 0);
    while (f.length < 4) f.push(0);
    for (let i = 0; i < 4; i++) row[i] = f[i];
  }

  if (dir === 'up') grid = rotate(g);
  if (dir === 'down') grid = rotate(reverse(g));
  if (dir === 'left') grid = g;
  if (dir === 'right') grid = g.map(r => r.reverse());
}

function selectGame(game) {
  localStorage.setItem('preferredGame', game);
  window.location.reload(); // Reload to apply the choice on load
}

function startGame(game) {
  document.getElementById('gameMenu').style.display = 'none';
  document.getElementById('ticTacToeGame').style.display = 'none';
  document.getElementById('game2048').style.display = 'none';

  if (game === 'tictactoe') {
    document.getElementById('ticTacToeGame').style.display = 'block';
    resetGame();
  } else if (game === '2048') {
    document.getElementById('game2048').style.display = 'block';
    init2048();
  }
}

function backToMenu() {
  document.getElementById('ticTacToeGame').style.display = 'none';
  document.getElementById('game2048').style.display = 'none';
  document.getElementById('gameMenu').style.display = 'block';
  document.removeEventListener('keydown', handleKey);
}

// Check for preferred game on load
document.addEventListener('DOMContentLoaded', () => {
  const preferredGame = localStorage.getItem('preferredGame');
  if (preferredGame) {
    startGame(preferredGame);
  } else {
    document.getElementById('gameMenu').style.display = 'block'; // Show menu if no preference
  }
  render(); // Initial render for Tic Tac Toe (hidden initially)
});

// script.js - MODIFIED Tic Tac Toe with Improved AI

// --- General UI Elements ---
const gameBoard = document.getElementById('gameBoard');
const gameStatus = document.getElementById('gameStatus');
const scoreboard = document.getElementById('scoreboard');
const difficultySelect = document.getElementById('difficulty');

// --- Game State ---
let board = Array(9).fill(null);
let currentPlayer = 'X';
let scores = { X: 0, O: 0 };
let gameOver = false;
let difficulty = 'easy'; // Default difficulty
let loggedInUser = localStorage.getItem('loggedInUser') || 'Player X';

// --- Difficulty Change Handler ---
function changeDifficulty() {
    difficulty = difficultySelect.value;
    resetGame(); // Reset the game when difficulty changes
}

// --- Check for Winner ---
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    for (const [a, b, c] of winPatterns) {
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    return board.includes(null) ? null : 'Draw';
}

// --- Handle Player Click ---
function handleClick(i) {
    if (board[i] || gameOver || currentPlayer !== 'X') {
        return;
    }
    board[i] = 'X';
    renderBoard();
    let result = checkWinner();
    if (result) {
        return endGame(result);
    }
    currentPlayer = 'O';
    gameStatus.textContent = "AI is thinking...";
    setTimeout(aiMove, 1000); // Introduce a slight delay for the AI's "thinking"
}

// --- AI Makes a Move (Difficulty-Based) ---
function aiMove() {
    let bestMoveIndex;

    if (difficulty === 'easy') {
        bestMoveIndex = findRandomMove();
    } else if (difficulty === 'medium') {
        bestMoveIndex = findBlockingOrWinningMove() || findRandomMove();
    } else if (difficulty === 'hard') {
        bestMoveIndex = minimax(board, 'O').index;
    }

    if (bestMoveIndex !== undefined) {
        board[bestMoveIndex] = 'O';
        renderBoard();
        let result = checkWinner();
        if (result) {
            return endGame(result);
        }
        currentPlayer = 'X';
        gameStatus.textContent = `${loggedInUser}'s turn`;
    }
}

// --- AI Helper Functions ---

function findRandomMove() {
    const availableSpots = board.reduce((acc, val, index) => {
        if (val === null) {
            acc.push(index);
        }
        return acc;
    }, []);

    if (availableSpots.length > 0) {
        let randomIndex = Math.floor(Math.random() * availableSpots.length);
        return availableSpots[randomIndex];
    }
    return undefined; // No move available
}

function findBlockingOrWinningMove() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            if (checkWinner() === 'O') {
                board[i] = null;
                return i; // AI can win
            }
            board[i] = 'X';
            if (checkWinner() === 'X') {
                board[i] = null;
                return i; // Player can win, so block
            }
            board[i] = null;
        }
    }
    return undefined; // No winning or blocking move found
}

function minimax(newBoard, player) {
    const availSpots = newBoard.map((v, i) => v === null ? i : null).filter(i => i !== null);

    const winner = checkWinner();
    if (winner === 'X') return { score: -10 };
    if (winner === 'O') return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            move.score = minimax(newBoard, 'X').score;
        } else {
            move.score = minimax(newBoard, 'O').score;
        }

        newBoard[availSpots[i]] = null;
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

// --- Update the Game Board UI ---
function renderBoard() {
    gameBoard.innerHTML = '';
    board.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (value) {
            cell.classList.add(value.toLowerCase());
            cell.textContent = value;
        }
        cell.addEventListener('click', () => handleClick(index));
        gameBoard.appendChild(cell);
    });
    updateScoreboard();
}

// --- Reset the Game ---
function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameOver = false;
    gameStatus.textContent = `${loggedInUser}'s turn`;
    renderBoard();
}

// --- Handle Game End ---
function endGame(result) {
    gameOver = true;
    if (result === 'Draw') {
        gameStatus.textContent = "It's a Draw!";
    } else {
        gameStatus.textContent = `Player ${result} wins!`;
        scores[result]++;
    }
    updateScoreboard();
}

// --- Reset Scores ---
function resetScores() {
    scores = { X: 0, O: 0 };
    updateScoreboard();
    resetGame();
}

// --- Update Scoreboard UI ---
function updateScoreboard() {
    scoreboard.textContent = `${loggedInUser}: ${scores.X} | AI (O): ${scores.O}`;
}

// --- Initial Board Render and Difficulty Setup ---
renderBoard();
difficultySelect.addEventListener('change', changeDifficulty);
