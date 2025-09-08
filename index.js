/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere.
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");
const express = require("express");
const axios = require("axios");

// ---------- Web server to keep bot alive ----------
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("✅ Goat Bot is running!"));

app.listen(PORT, () => console.log(`🌐 Web server listening on port ${PORT}`));

// ---------- Self-ping to stay awake ----------
setInterval(() => {
  axios.get(`http://localhost:${PORT}/`)
    .then(() => console.log("Pinged self to stay awake"))
    .catch(err => console.log("Ping failed:", err.message));
}, 5 * 60 * 1000); // every 5 minutes
// --------------------------------------------------

// ---------- Start Goat.js safely ----------
let restarted = false;

function startProject() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    if (!restarted && code !== 0) {
      log.info("Goat.js crashed. Restarting once...");
      restarted = true;
      startProject();
    } else {
      log.info(`Goat.js exited with code ${code}. No more restarts.`);
    }
  });

  // Graceful shutdown
  process.on("SIGINT", () => {
    log.info("Shutting down...");
    child.kill();
    process.exit();
  });

  process.on("SIGTERM", () => {
    log.info("Received SIGTERM. Shutting down...");
    child.kill();
    process.exit();
  });
}

startProject();
