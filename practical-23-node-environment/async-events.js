const EventEmitter = require("events");

const emitter = new EventEmitter();

console.log("Program start");

process.nextTick(() => console.log("process.nextTick callback"));
queueMicrotask(() => console.log("Microtask callback"));
setTimeout(() => console.log("setTimeout callback"), 0);
setImmediate(() => console.log("setImmediate callback"));

emitter.on("message", (data) => console.log("Listener 1:", data));
emitter.on("message", (data) => console.log("Listener 2:", data));
emitter.emit("message", "Broadcast message");

let ticks = 1;
const interval = setInterval(() => {
  console.log("setInterval tick:", ticks);
  if (ticks++ === 3) clearInterval(interval);
}, 300);

function processData(value, callback) {
  setTimeout(() => callback(null, "Processed " + value), 100);
}

processData("student data", (error, result) => console.log(result));

setTimeout(() => console.log("Timers finished"), 1000);
