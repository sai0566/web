// Login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form from submitting
  
        // Get input values
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
  
        // Simple validation (for demonstration purposes)
        if(username === 'admin' && password === 'password') {
          // Redirect to success page
          window.location.href = 'success.html';
        } else {
          alert('Invalid username or password. Please try again.');
        }
      });
    }
  
    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form submission
  
        // Retrieve form values
        var username = document.getElementById('newUsername').value;
        var password = document.getElementById('newPassword').value;
        var confirmPassword = document.getElementById('confirmPassword').value;
  
        // Basic validation
        if(password !== confirmPassword) {
          alert('Passwords do not match. Please try again.');
          return;
        }
  
        // Here, you would typically send the data to the server for processing.
        // For demonstration purposes, we'll redirect to the login page.
        alert('Signup successful! Please log in.');
        window.location.href = 'new.html';
      });
    }
  });
  