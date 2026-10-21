const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 4000;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
    fs.readFile(path.join(__dirname, "index.html"), (error, data) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Unable to load the page");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
    return;
  }

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

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(port, () => {
  console.log("XML web service running at http://localhost:" + port);
});
