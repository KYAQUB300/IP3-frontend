document.addEventListener('DOMContentLoaded', function () {
    // Fetch currently logged-in user's information
    const user = JSON.parse(localStorage.getItem('user'));
    // console.log(user)
    const username = user ? user.username : 'Guest';
    // console.log(user ? user.username : 'Guest')

    // Update the welcome message with the username
      // Update the welcome message with the username
      const welcomeMessage = document.querySelector('.user-profile h2');
      if (welcomeMessage) {
          welcomeMessage.textContent = `Welcome, ${username}!`;
      } else {
          console.error('.user-profile h2 element not found');
      }
  
    // Add event listener to the logout link
    const logoutLink = document.querySelector('.side-menu li:nth-child(2) a');
    logoutLink.addEventListener('click', logout);
});

function logout() {
    fetch('http://localhost:8000/api/v1/user/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Logout failed. Please try again.');
        }
        return response.json();
    })
    .then(data => {
        // Clear local storage
        localStorage.removeItem('user');
        localStorage.removeItem('emergency_token');
        // Redirect to login page or perform any other action
        window.location.href = 'index.html'; // Redirect to index.html after logout
    })
    .catch(error => {
        alert(error.message);
    });
}
