// signup.js

async function registerUser(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

        // Log input field values
        console.log('Full Name:', fullName);
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Phone Number:', phone);
        console.log('Password:', password);
        console.log('Confirm Password:', confirmPassword);
    

    // Simple validation
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }


    try {
        const response = await fetch('http://localhost:8000/api/v1/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName,
                username,
                email,
                phone,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Signup successful
            console.log('Signup successful');
            console.log('Token:', data.token);

            // Store token in cookie or local storage
            // Example of storing in local storage
            localStorage.setItem('emegency_token', data.token);

            // Redirect user or perform any other action as needed
            window.location.href = 'index.html'; // Redirect to dashboard page
        } else {
            // Signup failed
            console.error('Signup failed:', data.message);
            alert('Signup failed: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
        alert('An error occurred. Please try again later.');
    }
}

function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
}

document.getElementById('username').innerText = 'JaneClarke26';
