#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const packageRoot = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, "manifest.json"), "utf8"));
const packageInfo = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));

function printHelp() {
  console.log(`wt ${packageInfo.version}

Download Web Technology practicals by practical number.

Usage:
  wt <number> [options]
  wt all [options]
  wt --list

Options:
  -d, --dir <folder>  Destination folder (default: current folder)
  -f, --force         Overwrite existing files with different content
  -l, --list          List available practicals
  -h, --help          Show this help

Examples:
  wt 5
  wt 18 --dir downloaded
  wt 23
  wt 24C
  wt 25E --force`);
}

function printList() {
  console.log("Available practicals:\n");

  Object.keys(manifest).forEach((key) => {
    console.log(key.padEnd(4) + "  " + manifest[key].title);
  });

  console.log("\nUse wt <number> to download a practical.");
}

function parseArgs(args) {
  const options = {
    number: null,
    destination: null,
    force: false,
    list: false,
    help: false
  };

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--list" || arg === "-l") {
      options.list = true;
    } else if (arg === "--force" || arg === "-f") {
      options.force = true;
    } else if (arg === "--dir" || arg === "-d") {
      index++;
      if (index >= args.length) {
        throw new Error("Missing value for --dir.");
      }
      options.destination = args[index];
    } else if (arg.startsWith("--dir=")) {
      options.destination = arg.slice("--dir=".length);
    } else if (arg.startsWith("-")) {
      throw new Error("Unknown option: " + arg);
    } else if (!options.number) {
      options.number = arg;
    } else {
      throw new Error("Unexpected argument: " + arg);
    }
  }

  return options;
}

function normalizeKey(value) {
  const cleaned = String(value)
    .trim()
    .toUpperCase()
    .replace(/^PRACTICAL[\s-]*/, "")
    .replace(/[\s-]+/g, "");
  const match = cleaned.match(/^0*(\d+)([A-E])?$/);

  if (!match) {
    return null;
  }

  return String(Number(match[1])) + (match[2] || "");
}

function resolveKeys(input) {
  if (String(input).toLowerCase() === "all") {
    return Object.keys(manifest);
  }

  const key = normalizeKey(input);

  if (!key) {
    return [];
  }

  if (manifest[key]) {
    return [key];
  }

  return Object.keys(manifest).filter((itemKey) => {
    const suffix = itemKey.slice(key.length);
    return itemKey.startsWith(key) && suffix.length === 1 && suffix >= "A" && suffix <= "E";
  });
}

function collectFiles(source, relative, output) {
  const stats = fs.statSync(source);

  if (stats.isDirectory()) {
    fs.readdirSync(source, { withFileTypes: true }).forEach((entry) => {
      if (entry.name === "node_modules" || entry.name === ".git") {
        return;
      }
      collectFiles(path.join(source, entry.name), path.join(relative, entry.name), output);
    });
    return;
  }

  output.push({ source: source, relative: relative });
}

function expandEntries(keys) {
  const files = [];
  const seen = new Set();

  keys.forEach((key) => {
    manifest[key].paths.forEach((entryPath) => {
      const source = path.join(packageRoot, entryPath);

      if (!fs.existsSync(source)) {
        throw new Error("Missing packaged file: " + entryPath);
      }

      const found = [];
      collectFiles(source, entryPath, found);

      found.forEach((file) => {
        if (seen.has(file.relative)) {
          return;
        }
        seen.add(file.relative);
        files.push(file);
      });
    });
  });

  return files;
}

function filesAreEqual(first, second) {
  const firstStats = fs.statSync(first);
  const secondStats = fs.statSync(second);

  if (!secondStats.isFile() || firstStats.size !== secondStats.size) {
    return false;
  }

  return fs.readFileSync(first).equals(fs.readFileSync(second));
}

function displayPath(relative) {
  return relative.split(path.sep).join("/");
}

function download(keys, options) {
  const files = expandEntries(keys);
  const destinationRoot = path.resolve(process.cwd(), options.destination || ".");

  if (fs.existsSync(destinationRoot) && !fs.statSync(destinationRoot).isDirectory()) {
    throw new Error("Destination is not a folder: " + destinationRoot);
  }

  const copies = [];
  const skipped = [];
  const conflicts = [];

  files.forEach((file) => {
    const target = path.join(destinationRoot, file.relative);

    if (!fs.existsSync(target)) {
      copies.push({ source: file.source, target: target, relative: file.relative });
      return;
    }

    if (fs.statSync(target).isFile() && filesAreEqual(file.source, target)) {
      skipped.push(file);
      return;
    }

    conflicts.push({ source: file.source, target: target, relative: file.relative });
  });

  if (conflicts.length > 0 && !options.force) {
    console.error("These files already exist with different content:\n");
    conflicts.forEach((file) => {
      console.error("  " + displayPath(file.relative));
    });
    console.error("\nUse --force to overwrite them.");
    process.exitCode = 1;
    return;
  }

  if (options.force) {
    copies.push(...conflicts);
  }

  copies.forEach((file) => {
    try {
      fs.mkdirSync(path.dirname(file.target), { recursive: true });
      fs.copyFileSync(file.source, file.target);
      console.log("Copied: " + displayPath(file.relative));
    } catch (error) {
      console.error("Could not copy " + displayPath(file.relative) + ": " + error.message);
      process.exitCode = 1;
    }
  });

  skipped.forEach((file) => {
    console.log("Skipped (unchanged): " + displayPath(file.relative));
  });

  console.log("\nSelected:");
  keys.forEach((key) => {
    console.log("  " + key + "  " + manifest[key].title);
  });
  console.log("\nDestination: " + destinationRoot);

  const hints = [];
  keys.forEach((key) => {
    if (manifest[key].hint && !hints.includes(manifest[key].hint)) {
      hints.push(manifest[key].hint);
    }
  });

  if (hints.length > 0) {
    console.log("\nNext steps:");
    hints.forEach((hint) => {
      console.log("  " + hint);
    });
  }
}

function main() {
  let options;

  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    console.error("Run wt --help for usage.");
    process.exitCode = 1;
    return;
  }

  if (options.help || (!options.number && !options.list)) {
    printHelp();
    return;
  }

  if (options.list) {
    printList();
    return;
  }

  const keys = resolveKeys(options.number);

  if (keys.length === 0) {
    console.error("Unknown practical number: " + options.number);
    console.error("Run wt --list to see available practicals.");
    process.exitCode = 1;
    return;
  }

  try {
    download(keys, options);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
