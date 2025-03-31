const express = require('express');
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }));

let entries = []

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index2.html')
});

app.post('/submit_entry', (req, res) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email

    const entry = {id: entries.length + 1, firstName, lastName, email}
    entries.push(entry)
    res.redirect('/entries')
    
});

app.get('/entries', (req, res) =>{
    if (entries.length === 0){
        req.res(`No entries found`)
    }
    
    let responseHtml = "<h2>Entries:</h2><ul>";
    entries.forEach(entry => {
        responseHtml += `<li>First Name: ${entry.firstName}, Last Name: ${entry.lastName}, Email: ${entry.email}</li>`;
    });
    responseHtml += "</ul>";

    res.send(responseHtml);
        
})

app.listen(port, () => {
    console.log(`server is running. Go to website http://localhost:${port}`)
});

