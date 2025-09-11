/**
 * Advanced Goat Bot Watchdog
 * Author: NTKhang
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const log = require("./logger/log.js");
const express = require("express");

const PORT = process.env.PORT || 3000;

// ---------------- Web Server ----------------
const app = express();
app.get("/", (req, res) => res.send("✅ Goat Bot is running!"));
app.listen(PORT, () => log.info(`🌐 Web server listening on port ${PORT}`));

// ---------------- Config ----------------
let botProcess = null;
let restartCount = 0;
const MAX_RESTARTS = 5;
const RESTART_DELAY = 3000; // 3s
const HEARTBEAT_TIMEOUT = 15000; // 15s
const MEMORY_LIMIT_MB = 600; // RAM limit

let lastHeartbeat = Date.now();

// ---------------- Log Error ----------------
function saveErrorLog(err) {
  try {
    const logDir = path.join(__dirname, "logs");
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
    const filePath = path.join(logDir, `error_${Date.now()}.log`);
    fs.writeFileSync(filePath, err.stack || JSON.stringify(err, null, 2));
  } catch (e) {
    console.error("Failed to write error log", e);
  }
}

// ---------------- Start Goat.js ----------------
function startBot() {
  if (restartCount >= MAX_RESTARTS) {
    log.err("CRASH LOOP DETECTED", "Bot crashed too many times.");
    return;
  }

  botProcess = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: ["pipe", "pipe", "pipe"],
    shell: true
  });

  botProcess.stdout.on("data", (data) => {
    const text = data.toString().trim();
    process.stdout.write(text + "\n"); // show bot logs
    if (text.includes("HEARTBEAT")) lastHeartbeat = Date.now();
  });

  botProcess.stderr.on("data", (data) => {
    log.err("BOT STDERR", data.toString());
  });

  botProcess.on("close", (code) => {
    if (code === 2) {
      restartCount++;
      log.warn(`🔄 Bot requested restart (${restartCount}/${MAX_RESTARTS}). Restarting...`);
      setTimeout(startBot, RESTART_DELAY);
    } else {
      log.info(`⚠️ Bot exited with code ${code}`);
    }
  });

  botProcess.on("error", (err) => {
    log.err("START BOT ERROR", err);
    saveErrorLog(err);
  });
}

// ---------------- Watchdog ----------------
setInterval(() => {
  const now = Date.now();
  if (!botProcess || botProcess.killed) return;

  // Heartbeat check
  if (now - lastHeartbeat > HEARTBEAT_TIMEOUT) {
    log.err("WATCHDOG", "Heartbeat timeout. Restarting Bot...");
    botProcess.kill("SIGINT");
    restartCount++;
    startBot();
  }

  // Memory check
  botProcess.kill("SIGUSR1"); // optional: send signal to Goat.js for memory report
}, 5000);

// ---------------- Handle unhandled rejections ----------------
process.on("unhandledRejection", (reason) => {
  log.err("UNHANDLED PROMISE REJECTION", reason);
  saveErrorLog(reason);
});

// ---------------- Handle uncaught exceptions ----------------
process.on("uncaughtException", (err) => {
  log.err("UNCAUGHT EXCEPTION", err);
  saveErrorLog(err);
});

// ---------------- Handle shutdown ----------------
process.on("SIGINT", () => {
  log.info("🛑 SIGINT received. Shutting down...");
  if (botProcess) botProcess.kill("SIGINT");
  process.exit();
});

process.on("SIGTERM", () => {
  log.info("🛑 SIGTERM received. Shutting down...");
  if (botProcess) botProcess.kill("SIGTERM");
  process.exit();
});

// ---------------- Start ----------------
startBot();
