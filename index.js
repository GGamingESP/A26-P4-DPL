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

app.post("/api/users", (req, res) => {
  let usernames = req.body.username ;
  let newUser = {
    username: usernames,
    _id: crypto.randomUUID(),
    log: [],
  }
  userArray.push(newUser);
  res.json({newUser})
})

app.get("/api/users", (req, res) => {
  let userResponse = userArray.map((user) => {
    return {
      _id: user._id,
      username: user.username,
    };
  });
  res.json({userResponse});
})

app.post('/api/users/:_id/exercises', (req, res) => {
  try {
    const userId = req.params._id;
    const user = userArray.find(user => user._id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { description, duration, date = new Date().toDateString() } = req.body;


    const exercise = { description, duration, date };
    user.log.push(exercise);

    userArray.filter((users) => users._id !== user._id);
    userArray.push(user)

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:_id/logs', (req, res) => {
  try {
    const userId = req.params._id;
    const user = userArray.find(user => user._id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { from, to, limit } = req.query;

    let filteredLog = user.log.slice();

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
