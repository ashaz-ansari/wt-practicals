const fs = require("fs/promises");
const path = require("path");

const directory = path.join(__dirname, "demo-files");
const file = path.join(directory, "notes.txt");

async function main() {
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(file, "First line\n", "utf8");
  await fs.appendFile(file, "Second line\nThird line\n", "utf8");

  const content = await fs.readFile(file, "utf8");
  console.log("File content:");
  console.log(content);

  const stats = await fs.stat(file);
  console.log("File size:", stats.size, "bytes");
  console.log("Directory contents:", await fs.readdir(directory));

  await fs.copyFile(file, path.join(directory, "copy.txt"));
  await fs.rename(path.join(directory, "copy.txt"), path.join(directory, "renamed.txt"));
  console.log("After copy and rename:", await fs.readdir(directory));

  await fs.unlink(path.join(directory, "renamed.txt"));
  console.log("After delete:", await fs.readdir(directory));

  await fs.rm(directory, { recursive: true, force: true });
  console.log("Directory removed");
}

main().catch((error) => {
  console.error(error);
});
