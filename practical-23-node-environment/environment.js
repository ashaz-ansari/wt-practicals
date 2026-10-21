const os = require("os");

console.log("Node.js version:", process.version);
console.log("V8 version:", process.versions.v8);
console.log("Platform:", process.platform);
console.log("Architecture:", process.arch);
console.log("Working directory:", process.cwd());
console.log("Arguments:", process.argv.slice(2));
console.log("Environment:", process.env.NODE_ENV || "development");
console.log("Memory usage:", process.memoryUsage());
console.log("CPU cores:", os.cpus().length);
console.log("Total memory:", (os.totalmem() / 1024 ** 3).toFixed(2), "GB");
