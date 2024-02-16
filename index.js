const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let userArray = [];
let logArray = [] ;

app.post("/api/users", (req, res) => {
  let username = req.body.username ;
  let newUser = {
    username: username,
    _id: crypto.randomUUID()
  }
  userArray.push(newUser);
  res.json(newUser)
})

app.get("/api/users", (req, res) => {
  res.json(userArray);
})

app.post('/api/users/:_id/exercises', (req, res) => {
  try {
    const userIndex = users.findIndex(user => user._id === req.params._id);

    if (userIndex === -1) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const exerciseData = {
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date || new Date().toDateString()
    };

    users[userIndex].log.push(exerciseData);
    res.json(users[userIndex]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:_id/logs', (req, res) => {
  try {
    const user = users.find(user => user._id === req.params._id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { from, to, limit } = req.query;

    let filteredLog = user.log;

    if (from) {
      filteredLog = filteredLog.filter(log => new Date(log.date) >= new Date(from));
    }

    if (to) {
      filteredLog = filteredLog.filter(log => new Date(log.date) <= new Date(to));
    }

    if (limit) {
      filteredLog = filteredLog.slice(0, limit);
    }

    res.json({
      username: user.username,
      count: user.log.length,
      _id: user._id,
      log: filteredLog
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
