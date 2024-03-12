document.addEventListener('DOMContentLoaded', function () {
    fetchEmergencyContacts();
});

function fetchEmergencyContacts() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user._id : null;

    if (!userId) {
        console.error('User ID not found in local storage.');
        return;
    }

    fetch(`http://localhost:8000/api/v1/emergency/${userId}`)
    .then(response => response.json())
    .then(data => {
        const contactTable = document.getElementById('contactList');
        contactTable.innerHTML = ''; // Clear existing table

        // Create table header
        const tableHeader = document.createElement('tr');
        tableHeader.innerHTML = `
            <th>Name</th>
            <th>Contact Number</th>
            <th>Action</th>
        `;
        contactTable.appendChild(tableHeader);

        // Populate table with contacts
        data.forEach(contact => {
            const tableRow = document.createElement('tr');
            tableRow.id = `contact_${contact._id}`;
            tableRow.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.contactNumber}</td>
                <td>
                    <button onclick="updateContact('${contact._id}')">Update</button>
                    <button onclick="deleteContact('${contact._id}')">Delete</button>
                </td>
            `;
            contactTable.appendChild(tableRow);
        });
    })
    .catch(error => console.error('Error fetching emergency contacts:', error));
}


function addEmergencyContact(event) {
    event.preventDefault();

    const contactName = document.getElementById('contactName').value;
    const contactNumber = document.getElementById('contactNumber').value;

    if (contactName.trim() === '' || contactNumber.trim() === '') {
        alert('Please enter both contact name and number.');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
        alert('User information not found.');
        return;
    }

    console.log(user, contactName, contactNumber)

    fetch('http://localhost:8000/api/v1/emergency', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: contactName,
            contactNumber: contactNumber,
            user: user
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error adding emergency contact.');
        }
        return response.json();
    })
    .then(data => {
        // Update the contact list after successful addition
        fetchEmergencyContacts();
        // Clear input fields
        document.getElementById('contactName').value = '';
        document.getElementById('contactNumber').value = '';
    })
    .catch(error => {
        console.error('Error adding emergency contact:', error);
        alert('Error adding emergency contact. Please try again.');
    });
}


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

function updateContact(contactId) {
    console.log(contactId)
    // Fetch the contact data to update
    fetch(`http://localhost:8000/api/v1/emergency/one/${contactId}`)
    .then(response => {
        console.log(response)
        if (!response.ok) {
            throw new Error('Failed to fetch contact data.');
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
        // Populate the input fields with the contact data
        document.getElementById('contactName').value = data.name;
        document.getElementById('contactNumber').value = data.contactNumber;

        // Change the button text to indicate update mode
        document.getElementById('btn').textContent = 'Update Contact';
        document.getElementById('btn').setAttribute('onclick', `submitUpdate('${contactId}')`);
    })
    .catch(error => console.error('Error fetching contact data:', error));
}


function submitUpdate(contactId) {
    const updatedName = document.getElementById('contactName').value;
    const updatedNumber = document.getElementById('contactNumber').value;

    // Construct the updated contact object
    const updatedContact = {
        name: updatedName,
        contactNumber: updatedNumber
    };

    // Send a PUT request to update the contact
    fetch(`http://localhost:8000/api/v1/emergency/${contactId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedContact)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update contact.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Contact updated successfully:', data);
                // Change the button text to indicate update mode
                document.getElementById('btn').textContent = 'Add Contact';
                document.getElementById('btn').removeAttribute('onclick', `submitUpdate('${contactId}')`);
                window.location.reload()
        // Reload the page or update the contact list as needed
    })
    .catch(error => console.error('Error updating contact:', error));
}


function deleteContact(contactId) {
    // Send a DELETE request to delete the contact
    fetch(`http://localhost:8000/api/v1/emergency/${contactId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete contact.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Contact deleted successfully:', data);

        // Remove the deleted contact from the DOM
        console.log(`contact_${contactId}`)
        window.location.reload();
        
    })
    .catch(error => console.error('Error deleting contact:', error));
}
