const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(express.json());

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Student = mongoose.model("Student", studentSchema);

app.get("/", (req, res) => {
  res.send("MongoDB CRUD API is running.");
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "Invalid student id" });
      return;
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "Invalid student id" });
      return;
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ error: "Invalid student id" });
      return;
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }

    res.json({ message: "Student deleted", student: student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function start() {
  await mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/college");
  app.listen(port, () => {
    console.log("CRUD API running at http://localhost:" + port);
  });
}

start().catch((error) => {
  console.error(error);
});
