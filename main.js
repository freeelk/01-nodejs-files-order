const http = require('http');
const fs = require('fs');
const path = require('path');

if (process.env.INTERVAL === void 0) {
  console.error('Environment variable INTERVAL not defined');
  process.exit(1);
}

if (process.env.TIMEOUT === void 0) {
  console.error('Environment variable TIMEOUT not defined');
  process.exit(1);
}

const timeout = process.env.TIMEOUT;
const interval = process.env.INTERVAL;
const index = fs.readFileSync(path.join(__dirname, 'index.html'));

const app = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
});

const io = require('socket.io').listen(app);

io.on('connection', function (socket) {
  console.log(`Client connected. Socket id: ${socket.id}.`);

  const sendTime = function () {
    let time = new Date();

    socket.emit('time', {'time': time.toUTCString()});
    console.log(`Emitted ${time.toUTCString()} to socket with id ${socket.id}.`);
  };

  let intervalId = setInterval(sendTime, interval);

  const stopSending = function () {
    clearInterval(intervalId);
    socket.emit('stop', {'message': 'Sending stopped'});
    console.log(`Sending to ${socket.id} stopped, socket will be disconnected.`);
    socket.disconnect();
  };

  setTimeout(stopSending, timeout);

  socket.emit('start', {'message': 'Sending started.'});

  socket.on('disconnect', function () {
    console.log(`Client with socket id ${socket.id} has been disconnected.`);
  });
});

app.listen(3000);
