const fs = require('fs');
const path = require('path');

const commandsPath = path.join(__dirname, 'cmds');
let commands = {};

// Function to load all commands
function loadCommands() {
  commands = {};
  const files = fs.readdirSync(commandsPath);
  files.forEach(file => {
    if (file.endsWith('.js')) {
      const cmd = require(path.join(commandsPath, file));
      commands[cmd.name] = cmd;
    }
  });
  console.log('Commands loaded:', Object.keys(commands));
}

// Initial load
loadCommands();

// Watch for file changes
fs.watch(commandsPath, (eventType, filename) => {
  if (!filename.endsWith('.js')) return;

  // Clear cache for the changed file
  const filePath = path.join(commandsPath, filename);
  delete require.cache[require.resolve(filePath)];

  // Reload commands
  loadCommands();
});
