require("dotenv").config(); // load .env variables
const { spawn } = require("child_process");
const log = require("./logger/log.js");
const http = require("http");

const isWebService = !!process.env.PORT;

let crashCount = 0;
const MAX_CRASHES = 5;

function startProject() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    crashCount++;
    if (crashCount > MAX_CRASHES) {
      log.error(`Goat-Bot crashed ${crashCount} times. Stopping auto-restart.`);
      return;
    }
    log.info(`Goat-Bot exited with code ${code}. Restarting...`);
    setTimeout(startProject, 5000); // 5 seconds wait
  });
}

startProject();

if (!isWebService) {
  process.stdin.resume();
  log.info("Running as Background Worker (no web port required).");
} else {
  const port = process.env.PORT || 10000;
  http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Goat-Bot is running 24/7!\n");
  }).listen(port, "0.0.0.0", () => {
    log.info(`Running as Web Service on port ${port}.`);
  });
}

setInterval(() => {
  log.info("Goat-Bot is alive 24/7...");
}, 3600 * 1000);
