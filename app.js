const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server); // Attach socket.io to the server
const port = 3001;

function handleRequest (req, res) {
  const { method, headers, query, params, body, path } = req;

  const userAgent = headers['user-agent'];

  if (userAgent && (userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari'))) {
    return res.status(204).send();
  }

  const staticFileExtensions = ['.html', '.js', '.css', '.png', '.jpg', '.svg'];
  if (staticFileExtensions.some(ext => path.endsWith(ext))) {
    return res.status(204).send(); // Ignore static asset requests
  }

  const requestData = {
    method,
    path,
    headers,
    query,
    params,
    body,
  };

  requests.push(requestData);

  io.emit('newRequest', requestData);

  res.json({
    message: `${method} request received and displayed`,
    receivedData: requestData,
  });

  console.debug('Received external request:', requestData);
}


app.use(express.json());

let requests = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.all('*', handleRequest);

io.on('connection', (socket) => {
  console.debug('A client connected');

  requests.forEach((request) => {
    socket.emit('newRequest', request);
  });

  socket.on('disconnect', () => {
    console.debug('A client disconnected');
  });
});

server.listen(port, () => {
  console.debug(`Server running on port ${port}`);
});
