const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3001; // Set to port 3001

// Middleware to parse JSON bodies
app.use(express.json());

// Object to store incoming requests for each namespace
let namespaceRequests = {};

// Serve the root landing page with instructions
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Request Catcher</h1>
    <p>This application allows multiple users to catch HTTP requests in their own namespaces.</p>
    <p>To get started, please go to <code>/default</code> or create your own unique namespace by going to <code>/your-namespace</code>.</p>
    <p>Example: <a href="/default">/default</a></p>
  `);
});

// Serve the static HTML file for each namespace
app.get('/:namespace', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle all types of requests for specific namespaces
app.all('/:namespace/*', (req, res) => {
  const { namespace } = req.params;
  const { method, headers, query, params, body } = req;

  // Create an object to store all request details
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

  // Initialize the request array for the namespace if not existing
  if (!namespaceRequests[namespace]) {
    namespaceRequests[namespace] = [];
  }

  // Store the request in memory for the specific namespace
  namespaceRequests[namespace].unshift(requestData); // Add new request at the top

  // Emit the new request to the specific namespace
  io.of(`/${namespace}`).emit('newRequest', requestData);

  // Respond to the HTTP request
  res.json({
    message: `${method} request received for namespace: ${namespace}`,
    receivedData: requestData,
  });

  console.log(`Received request for namespace: ${namespace}`, requestData);
});

// Socket.io connection for each namespace
io.on('connection', (socket) => {
  const namespace = socket.handshake.query.namespace;

  if (!namespace) {
    console.error("Namespace not provided in query!");
    return;
  }

  // Join the user's namespace
  socket.join(namespace);
  console.log(`${namespace} connected to their namespace`);

  // Handle clearing of requests for this namespace
  socket.on('clearRequests', () => {
    namespaceRequests[namespace] = [];
    io.of(`/${namespace}`).emit('clearAllRequests');
    console.log(`Cleared requests for namespace: ${namespace}`);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
