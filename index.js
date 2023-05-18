const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        allowedHeaders: [
            "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"
        ],
    }
});
const cors = require('cors');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const corsOpts = {
    origin: '*',
    methods: [
        'GET',
        'POST',
        'PUT',
        'PETCH'
    ],
    allowedHeaders: [
        'Content-Type',
    ],
};
app.use(cors(corsOpts));

let intervalId = null;
let daysToAdd = 0;
let sData = [[new Date().getTime(), 44]];

io.on('connection', (socket) => {

    const [latestTimestamp, latestValue] = sData[sData.length - 1];
    socket.emit('stockData', [latestTimestamp, latestValue]);

    intervalId = setInterval(() => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + daysToAdd);
      const now = currentDate.getTime();
      const value = Math.floor(Math.random() * 10) + 40;
      const newData = [now, value];
      sData.push(newData);
      io.emit('stockData', newData);
      daysToAdd++;
    }, 1000);

  socket.on('disconnect', () => {
    clearInterval(intervalId);
    socket.disconnect(true);
  });
});


server.listen(3000, () => {
    console.log('Server started on port 3000');
});