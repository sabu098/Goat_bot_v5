const log = require("./logger/log.js");

// ---------------- Heartbeat ----------------
const HEARTBEAT_INTERVAL = 5000;
setInterval(() => {
  process.stdout.write("HEARTBEAT\n");
}, HEARTBEAT_INTERVAL);

// ---------------- Memory Monitor ----------------
const MEMORY_CHECK_INTERVAL = 10000; // every 10s
const MEMORY_LIMIT_MB = 600;

setInterval(() => {
  const usedMB = process.memoryUsage().heapUsed / 1024 / 1024;
  if (usedMB > MEMORY_LIMIT_MB) {
    log.err("MEMORY LIMIT EXCEEDED", `Used: ${usedMB.toFixed(2)}MB`);
    process.exit(2); // trigger watchdog restart
  }
}, MEMORY_CHECK_INTERVAL);

// ---------------- Bot Main ----------------
function startBot() {
  log.info("🐐 Goat Bot starting...");

  // Your bot setup here (client.listen(), commands, etc.)

  // Simulated bot activity
  setInterval(() => {
    log.info("Goat Bot alive!");
  }, 10000);
}

startBot();
