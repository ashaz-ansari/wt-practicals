const EventEmitter = require("events");

const emitter = new EventEmitter();

console.log("Program start");

process.nextTick(() => {
  console.log("process.nextTick callback");
});

queueMicrotask(() => {
  console.log("Microtask callback");
});

setTimeout(() => {
  console.log("setTimeout callback");
}, 0);

setImmediate(() => {
  console.log("setImmediate callback");
});

emitter.on("message", (data) => {
  console.log("Listener 1 received:", data);
});

emitter.on("message", (data) => {
  console.log("Listener 2 received:", data);
});

emitter.emit("message", "Broadcast message");

emitter.once("welcome", () => {
  console.log("Welcome listener executed once");
});

emitter.emit("welcome");
emitter.emit("welcome");

let ticks = 0;

const interval = setInterval(() => {
  ticks++;
  console.log("setInterval tick:", ticks);

  if (ticks === 3) {
    clearInterval(interval);
    console.log("Interval cleared");
  }
}, 300);

function processData(value, callback) {
  setTimeout(() => {
    if (!value) {
      callback(new Error("Value is required"));
      return;
    }
    callback(null, "Processed " + value);
  }, 100);
}

processData("", (error, result) => {
  if (error) {
    console.error("Callback error:", error.message);
    return;
  }
  console.log(result);
});

processData("student data", (error, result) => {
  if (error) {
    console.error("Callback error:", error.message);
    return;
  }
  console.log(result);
});

emitter.on("error", (error) => {
  console.error("Emitter error:", error.message);
});

emitter.emit("error", new Error("Sample broadcast error"));

setTimeout(() => {
  console.log("Timers finished");
}, 1200);
