const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"), { index: false }));

const users = [
  { id: 1, name: "Aarav" },
  { id: 2, name: "Meera" }
];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
  res.send("About page from an Express route.");
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const user = users.find((item) => item.id === Number(req.params.id));

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
});

app.post("/api/users", (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  const user = {
    id: users.length + 1,
    name: req.body.name
  };

  users.push(user);
  res.status(201).json(user);
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log("Express server running at http://localhost:" + port);
});
