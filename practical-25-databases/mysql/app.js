const mysql = require("mysql2/promise");

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "college"
  });

  await connection.execute(
    "CREATE TABLE IF NOT EXISTS students (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, course VARCHAR(100) NOT NULL, marks INT NOT NULL)"
  );

  await connection.execute(
    "INSERT INTO students (name, course, marks) VALUES (?, ?, ?)",
    ["Aarav", "Web Technology", 88]
  );

  const [rows] = await connection.execute("SELECT * FROM students");
  console.log("All students:", rows);

  await connection.execute(
    "UPDATE students SET marks = ? WHERE name = ?",
    [95, "Aarav"]
  );

  const [updated] = await connection.execute(
    "SELECT * FROM students WHERE name = ?",
    ["Aarav"]
  );
  console.log("Updated student:", updated);

  await connection.execute(
    "DELETE FROM students WHERE name = ?",
    ["Aarav"]
  );

  const [remaining] = await connection.execute("SELECT * FROM students");
  console.log("Remaining students:", remaining);

  await connection.end();
}

main().catch((error) => {
  console.error(error);
});
