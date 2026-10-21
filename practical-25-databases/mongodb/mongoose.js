const mongoose = require("mongoose");

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

async function main() {
  await mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/college");

  await Student.deleteMany({});

  const created = await Student.create({
    name: "Aarav",
    course: "Web Technology",
    marks: 88
  });

  console.log("Created student:", created);
  console.log("All students:", await Student.find({}));

  const updated = await Student.findByIdAndUpdate(
    created._id,
    { marks: 95 },
    { new: true }
  );

  console.log("Updated student:", updated);

  await Student.findByIdAndDelete(created._id);

  console.log("Remaining count:", await Student.countDocuments());

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
});
