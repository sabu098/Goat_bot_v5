const { spawn } = require("child_process");
const log = require("./logger/log.js");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Fake Web Server for Render ----------
app.get("/", (req, res) => {
  res.send("✅ Goat Bot is running!");
});

app.listen(PORT, () => {
  console.log(`🌐 Web server listening on port ${PORT}`);
});
// --------------------------------------------------

// ---------- PM2 Process Management for Goat Bot ----------
const pm2 = require("pm2");

pm2.connect((err) => {
  if (err) {
    console.error("Failed to connect to PM2:", err);
    process.exit(2);
  }

  pm2.start(
    {
      script: "Goat.js", // Bot script that you want to keep running
      name: "GoatBot", // Process name in PM2
      instances: 1, // Run only one instance
      autorestart: true, // Auto restart on crash
      watch: false, // No file watching
      max_memory_restart: "1G", // Restart if memory usage exceeds 1GB (optional)
    },
    (err, apps) => {
      if (err) {
        console.error("Error starting Goat Bot:", err);
        return;
      }
      console.log("Goat Bot started with PM2!");
    }
  );
});

// ---------- Restart Logic for Goat Bot ----------
function startProject() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  child.on("close", (code) => {
    if (code === 2) {
      log.info("Restarting Goat Bot...");
      startProject();
    }
  });
}

startProject();
