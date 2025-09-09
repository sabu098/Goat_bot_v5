/**
@author NTKhang
! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
*/

const { spawn } = require("child_process");
const path = require("path");

// ---------- Web server to keep bot alive ----------
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Goat Bot is running!");
});

app.listen(PORT, () => {
  console.log(`🌐 Web server listening on port ${PORT}`);
});
// ----------------------------------------------------

// ---------- Function to start bot ----------
function startBot() {
  console.log("🚀 Starting Goat Bot...");

  const botPath = path.join(__dirname, "Goat.js");

  const child = spawn("node", [botPath], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("error", (err) => {
    console.error("❌ Failed to start bot:", err);
  });

  child.on("close", (code) => {
    if (code === 0) {
      console.log("⚡ Bot exited normally.");
    } else {
      console.error(`❌ Bot stopped with exit code ${code}. Restarting...`);
      setTimeout(startBot, 3000); // wait 3 sec before restart
    }
  });
}

startBot();
