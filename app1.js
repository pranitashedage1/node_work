const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // send HTML file on GET request
})

app.post('/submit-form', (req, res) => {
    const name = req.body.name; // access form data
    // Add validation logic here
    const hobby = req.body.hobby; // access form data
    res.send(`Entry is created for ${name} and hobby is ${hobby}`);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});