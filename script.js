// Check if the emergency_token is in local storage
const emergencyToken = localStorage.getItem('emergency_token');

if (emergencyToken) {
    // Token exists, user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    const { fullName } = user;
    showWelcomeMessage(fullName);
} else {
    // Token doesn't exist, show login form
    document.getElementById('loginForm').style.display = 'block';
}

function authenticate(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8000/api/v1/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Invalid username or password. Please try again.');
        }
        return response.json();
    })
    .then(data => {
        // Authentication successful
        const { user } = data.data;
        const { fullName } = user;

        showWelcomeMessage(fullName);
        // Store user session in local storage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('emergency_token', JSON.stringify(data.token));
    })
    .catch(error => {
        // Authentication failed
        alert(error.message);
    });

    // Clear the input fields
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function showWelcomeMessage(fullName) {
    // Display the welcome message
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('welcomeMessage').style.display = 'block';
    document.getElementById('emergencyContactSection').style.display = 'block';
    document.getElementById('userFullName').textContent = fullName;
}

function sendAlert() {
    // Add logic to send alert to the specified emergency contact
    alert('Emergency alert sent!');
}

document.getElementById('username').innerText = 'JaneClarke26';
