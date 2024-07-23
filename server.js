const express = require('express');
const path = require('path');
const fs = require('fs');
const {randomUUID} = require('crypto');
// crypto.randomUUID
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// function readJsonDB(jsonDB= "db.json") {
//   return fs.readFile(path.join(__dirname, 'db', jsonDB), 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading db.json:', err);
//       // return res.status(500).json({ error: 'Failed to read notes' });
//     }
//     console.log(data);
//     return JSON.parse(data)
  
// })
  
// }

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    console.log(data);
    if (err) {
      console.error('Error reading db.json:', err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = randomUUID();

  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }

    let notes;
    try {
      notes = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing db.json:', parseError);
      return res.status(500).json({ error: 'Failed to parse notes' });
    }

    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        console.error('Error writing to db.json:', err);
        return res.status(500).json({ error: 'Failed to save note' });
      }
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req,res)=> {
  // console.log({req,res});
  const {id} = req.params
  // let notesDB = readJsonDB()
  fs.readFile(path.join(__dirname, 'db', jsonDB), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      // return res.status(500).json({ error: 'Failed to read notes' });
    }
    console.log(data);
    const notesDB = JSON.parse(data)
  
    if (!notesDB) {
      return res.status(400).send("Connot read notesDB!")
    }
    // notesDB = JSON.parse(notesDB)
    console.log(notesDB);
    
    const filteredNotesDB = notesDB.filter((note)=>{
      console.log(note);
      return note.id !== id 
    })
  
    console.log(filteredNotesDB);
    res.status(200).send("Successfully Deleted Note!")
})

})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}. Open http://localhost:${PORT} in your browser.`));