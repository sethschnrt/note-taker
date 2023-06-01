// Include packages needed for this application
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Set up Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static directory to be served
app.use(express.static(path.join(__dirname, '/public')));

// API routes
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8'));
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8'));
    const newNote = req.body;
    newNote.id = uuidv4();
    notes.push(newNote);
    fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(notes));
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json'), 'utf8'));
    const newNotes = notes.filter(note => note.id !== req.params.id);
    fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(newNotes));
    res.json(newNotes);
});

// HTML routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Starts the server to begin listening
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});