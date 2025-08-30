const { spawn } = require("child_process");
const log = require("./logger/log.js");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Web server to keep the bot alive
app.get("/", (req, res) => {
  res.send("✅ Goat Bot is running!");
});

app.listen(PORT, () => {
  console.log(`🌐 Web server listening on port ${PORT}`);
});

// Command loading
const fs = require('fs');
const path = require('path');

const commandsPath = path.join(__dirname, 'commands');
fs.readdir(commandsPath, (err, files) => {
  if (err) {
    console.error('Error loading commands:', err);
    return;
  }

  files.forEach(file => {
    if (file.endsWith('.js')) {
      console.log(`Loading command: ${file}`);
      require(`./commands/${file}`);
    }
  });
});

// Start Goat Bot
function startProject() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    if (code === 2) {
      log.info("Restarting Goat Bot...");
      startProject();
    }
  });
}

startProject();
