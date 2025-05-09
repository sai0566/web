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
