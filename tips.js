function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    console.log(localStorage.getItem('user'))
    const username = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : 'Guest';
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = username;
    }
    profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';

    document.querySelector('#logoutLink').addEventListener('click', logout);

}

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
        localStorage.removeItem('user');
        localStorage.removeItem('emergency_token');
        window.location.href = 'index.html'; // Redirect to index.html after logout
    })
    .catch(error => console.error('Error logging out:', error));
}