const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient(process.env.MONGO_URL || "mongodb://127.0.0.1:27017");

  await client.connect();

  const database = client.db("college");
  const students = database.collection("students");

  await students.deleteMany({});

  await students.insertMany([
    { name: "Aarav", course: "Web Technology", marks: 88 },
    { name: "Meera", course: "Web Technology", marks: 92 },
    { name: "Rohan", course: "Web Technology", marks: 76 }
  ]);

  console.log("All students:", await students.find({}).toArray());

  await students.updateOne(
    { name: "Aarav" },
    { $set: { marks: 95 } }
  );

  console.log("Updated student:", await students.findOne({ name: "Aarav" }));

  await students.deleteOne({ name: "Rohan" });

  console.log("Remaining count:", await students.countDocuments());
  console.log("Remaining students:", await students.find({}).toArray());

  await client.close();
}

main().catch((error) => {
  console.error(error);
});
