// Server (Node.js)
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    setInterval(() => {
      res.write('data: ' + new Date().toLocaleTimeString() + '\n\n');
    }, 3000);
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Server-Sent Events Example</h1>');
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// Client (HTML)
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSE Example</title>
</head>
<body>
  <h1>Server-Sent Events Example</h1>
  <div id="events"></div>

  <script>
    if (typeof(EventSource) !== "undefined") {
      const eventSource = new EventSource('/events');

      eventSource.onmessage = function(event) {
        const newElement = document.createElement("p");
        newElement.textContent = "New message: " + event.data;
        document.getElementById("events").appendChild(newElement);
      };

      eventSource.onopen = function(event) {
        console.log("Connection to server opened.");
      };

      eventSource.onerror = function(event) {
        if (event.target.readyState === EventSource.CLOSED) {
          console.log("Connection to server closed.");
        } else {
          console.error("Event occurred.");
        }
      };
    } else {
      console.log("Your browser does not support Server-Sent Events.");
    }
  </script>
</body>
</html>
