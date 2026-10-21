const http = require("http");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");

const port = 3000;

const page = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Practical 24A - Streams and HTTP</title>
</head>
<body>
<h1>Practical 24A: Streams and HTTP</h1>
<form action="/submit" method="post">
<input name="name" placeholder="Enter your name" required>
<button>Send POST Data</button>
</form>
<p><a href="/stream">Download streamed file</a></p>
<p><a href="/generated">Stream generated data</a></p>
</body>
</html>`;

const server = http.createServer((req, res) => {
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", req.headers);

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(page);
    return;
  }

  if (req.method === "GET" && req.url === "/stream") {
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": "attachment; filename=sample-data.txt"
    });
    fs.createReadStream(path.join(__dirname, "sample-data.txt")).pipe(res);
    return;
  }

  if (req.method === "GET" && req.url === "/generated") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    const generated = Readable.from([
      "First generated line\n",
      "Second generated line\n",
      "Third generated line\n"
    ]);
    generated.pipe(res);
    return;
  }

  if (req.method === "POST" && req.url === "/submit") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const params = new URLSearchParams(body);
      const name = params.get("name") || "Guest";

      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({
        message: "POST data received",
        name: name,
        contentType: req.headers["content-type"],
        rawBody: body
      }));
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(port, () => {
  console.log("Server running at http://localhost:" + port);
});
