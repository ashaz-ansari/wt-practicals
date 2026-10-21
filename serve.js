const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 8000;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".sql": "text/plain; charset=utf-8"
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/soap") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const cityMatch = body.match(/<city>([\s\S]*?)<\/city>/);
      const city = cityMatch ? cityMatch[1].trim() : "Unknown";
      const temperature = city.toLowerCase() === "pune" ? 29 : 31;
      const responseXml = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetWeatherResponse xmlns="http://example.com/weather">
      <city>${escapeXml(city)}</city>
      <temperature>${temperature}</temperature>
      <unit>Celsius</unit>
    </GetWeatherResponse>
  </soap:Body>
</soap:Envelope>`;

      res.writeHead(200, { "Content-Type": "text/xml; charset=utf-8" });
      res.end(responseXml);
    });
    return;
  }

  const requestPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = path.join(root, requestPath === "/" ? "index.html" : requestPath);
  const relativePath = path.relative(root, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    fs.readFile(filePath, (readError, data) => {
      if (readError) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }

      const extension = path.extname(filePath).toLowerCase();
      const contentType = contentTypes[extension] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });
});

server.listen(port, () => {
  console.log("Static server running at http://localhost:" + port);
});
