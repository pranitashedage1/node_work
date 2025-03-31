const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let entries = [];

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit-form', (req, res) => {
    const { name, hobby } = req.body;
    
    const newEntry = { id: entries.length + 1, name, hobby };
    entries.push(newEntry);

    res.redirect('/entries');
});

// Render the table with search functionality
app.get('/entries', (req, res) => {
    let tableHTML = `
        <html>
        <head>
            <title>Entries</title>
        </head>
        <body>
            <h2>Submitted Entries</h2>

            <input type="text" id="searchId" placeholder="Enter ID to search">
            <button onclick="searchEntry()">Search</button>

            <table border="1">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Hobby</th>
                    <th>Action</th>
                </tr>`;

    entries.forEach(entry => {
        tableHTML += `
            <tr>
                <td>${entry.id}</td>
                <td>${entry.name}</td>
                <td id="hobby-${entry.id}">${entry.hobby}</td>
                <td>
                    <button onclick="editHobby(${entry.id})">Edit</button>
                </td>
            </tr>`;
    });

    tableHTML += `
            </table>
            <br>
            <a href="/">Go back</a>
            
            <script>
                function editHobby(id) {
                    const newHobby = prompt("Enter new hobby:");
                    if (newHobby) {
                        fetch('/update-hobby/' + id, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ hobby: newHobby })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                document.getElementById('hobby-' + id).innerText = newHobby;
                            }
                        });
                    }
                }

                function searchEntry() {
                    const searchId = document.getElementById("searchId").value;
                    if (!searchId) {
                        alert("Please enter an ID to search.");
                        return;
                    }

                    // Redirect to new page for entry details
                    window.location.href = "/entry/" + searchId;
                }
            </script>
        </body>
        </html>`;

    res.send(tableHTML);
});

// Show a new page with entry details
app.get('/entry/:id', (req, res) => {
    const entryId = parseInt(req.params.id);
    const entry = entries.find(e => e.id === entryId);

    if (entry) {
        res.send(`
            <html>
            <head>
                <title>Entry Details</title>
            </head>
            <body>
                <h2>Entry Details</h2>
                <p><strong>ID:</strong> ${entry.id}</p>
                <p><strong>Name:</strong> ${entry.name}</p>
                <p><strong>Hobby:</strong> ${entry.hobby}</p>
                <br>
                <a href="/entries">Go back</a>
            </body>
            </html>
        `);
    } else {
        res.send(`<h2>Entry not found</h2><br><a href="/entries">Go back</a>`);
    }
});

// Update hobby
app.put('/update-hobby/:id', (req, res) => {
    const entryId = parseInt(req.params.id);
    const { hobby } = req.body;

    const entry = entries.find(e => e.id === entryId);
    if (entry) {
        entry.hobby = hobby;
        res.json({ success: true, message: "Hobby updated successfully" });
    } else {
        res.status(404).json({ success: false, message: "Entry not found" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
