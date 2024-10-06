const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3001; // Set to port 3001


app.use(express.json());

let namespaceRequests = {};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:namespace', (req, res) => {
  res.sendFile(path.join(__dirname, 'requests.html'));
});

app.all('/:namespace/*', (req, res) => {
  const { namespace } = req.params;
  const { method, headers, query, params, body } = req;

  const requestData = {
    method,
    // path: req.path,
    path: req.path.replace(`/${req.params.namespace}`, ''),
    headers,
    query,
    params,
    body,
    timestamp: new Date().toLocaleString(),
  };

  if (!namespaceRequests[namespace]) {
    namespaceRequests[namespace] = [];
  }

  namespaceRequests[namespace].unshift(requestData); // Add new request at the top

  io.of(`/${namespace}`).emit('newRequest', requestData);

  res.json({
    message: `${method} request received for namespace: ${namespace}`,
    receivedData: requestData,
  });

  console.log(`Received request for namespace: ${namespace}`, requestData);
});

io.on('connection', (socket) => {
  const namespace = socket.handshake.query.namespace;

  if (!namespace) {
    console.error("Namespace not provided in query!");
    return;
  }

  socket.join(namespace);
  console.log(`${namespace} connected to their namespace`);

  // socket.on('clearRequests', () => {
  //   namespaceRequests[namespace] = [];
  //   io.of(`/${namespace}`).emit('clearAllRequests');
  //   console.log(`Cleared requests for namespace: ${namespace}`);
  // });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
