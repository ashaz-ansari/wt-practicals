const os = require("os");
const util = require("util");

console.log("Node.js version:", process.version);
console.log("V8 version:", process.versions.v8);
console.log("Platform:", process.platform);
console.log("Architecture:", process.arch);
console.log("Current working directory:", process.cwd());
console.log("Script file:", process.argv[1]);
console.log("Arguments:", process.argv.slice(2));
console.log("NODE_ENV:", process.env.NODE_ENV || "development");
console.log("Memory usage:", util.inspect(process.memoryUsage()));
console.log("Process uptime:", process.uptime().toFixed(2), "seconds");
console.log("CPU cores:", os.cpus().length);
console.log("Total memory:", (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), "GB");
console.log("Home directory:", os.homedir());
console.log("Global object type:", typeof global);
console.log("Utility formatting:", util.format("%s has %d items worth %d", "Cart", 3, 450));
console.log("Extended array method demo:", [1, 2, 3].map((number) => number * 10).join(", "));

class Course {
  constructor(name) {
    this.name = name;
  }

  describe() {
    return this.name + " is part of the Web Technology practical.";
  }
}

console.log(new Course("Node.js").describe());

process.on("exit", (code) => {
  console.log("Process exit event with code:", code);
});
