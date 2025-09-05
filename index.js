/**
 * @author NTKhang
 * Official source: https://github.com/ntkhang03/Goat-Bot-V2
 *
 * ⚠️ Do not change the author name or remove this notice.
 */

const { spawn } = require("child_process");
const express = require("express");
const log = require("./logger/log.js"); // Ensure this path is correct

const app = express();
const PORT = process.env.PORT || 3000;

// Health Check for Render
app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
});

// Function to start the bot
function startBot() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    if (code === 2) {
      log.info("Restarting Project...");
      startBot(); // auto-restart
    }
  });
}

// Start the bot
startBot();
