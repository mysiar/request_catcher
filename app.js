const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server); // Attach socket.io to the server
const port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Array to store incoming requests
let requests = [];

// Serve the static HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Helper function to handle all request types
function handleRequest(req, res) {
  const { method, headers, query, params, body, path } = req;

  // Filter out requests with "User-Agent" headers indicating a browser
  const userAgent = headers['user-agent'];

  if (userAgent && (userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari'))) {
    // If the request is coming from a browser, ignore it and return a standard response
    return res.status(204).send(); // 204 No Content
  }

  // Filter out requests to static assets (like index.html, socket.io.js, etc.)
  const staticFileExtensions = ['.html', '.js', '.css', '.png', '.jpg', '.svg'];
  if (staticFileExtensions.some(ext => path.endsWith(ext))) {
    return res.status(204).send(); // Ignore static asset requests
  }

  // Create an object to store all request details
  const requestData = {
    method,
    path,
    headers,
    query,
    params,
    body,
  };

  // Store the request in memory
  requests.push(requestData);

  // Emit the new request to all connected clients
  io.emit('newRequest', requestData);

  // Respond to the HTTP request
  res.json({
    message: `${method} request received and displayed`,
    receivedData: requestData,
  });

  console.log('Received external request:', requestData);
}

// Use the helper function for all types of HTTP requests
app.all('*', handleRequest);

// WebSocket connection event
io.on('connection', (socket) => {
  console.log('A client connected');

  // Send all stored requests to the new client
  requests.forEach((request) => {
    socket.emit('newRequest', request);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
