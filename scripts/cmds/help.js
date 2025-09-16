const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

// Image rotation state
let imageIndex = 0;
const images = [
  "https://i.imgur.com/FqD68L9.jpeg",
  "https://i.imgur.com/y6Ktrjk.jpeg",
  "https://i.imgur.com/s1z38No.jpg",
  "https://i.imgur.com/VSxxpm3.jpeg"
];

module.exports = {
  config: {
    name: "help",
    version: "1.0",
    author: "𝘼𝙯 𝙖𝙙 👻🩸",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Show all commands (Stylish SMS Style)" },
    longDescription: { en: "Display all commands in a stylish bordered list" },
    category: "system",
  },

  onStart: async function ({ message, args, event }) {
    const prefix = getPrefix(event.threadID);

    // Rotate image
    const currentImage = images[imageIndex];
    imageIndex = (imageIndex + 1) % images.length;

    // Command-specific help
    if (args[0]) {
      const cmdName = args[0].toLowerCase();
      const command = commands.get(cmdName) || commands.get(aliases.get(cmdName));
      if (!command) return message.reply(`💀👻 No such command: ${cmdName}`);

      const aliasList = command.config.aliases?.join(", ") || "None";
      const singleMsg = `╔════════════════════════╗
🔥  Command: ${command.config.name} ⚡
📄  Desc: ${command.config.shortDescription?.en || "No description"}
🌟  Version: ${command.config.version || "1.0"}
👤  Author: ${command.config.author || "Unknown"}
⏱️  Cooldown: ${command.config.countDown || 5}s
💡  Alias: ${aliasList}
╚════════════════════════╝`;

      return message.reply({
        body: singleMsg,
        attachment: await global.utils.getStreamFromURL(currentImage)
      });
    }

    // All commands in stylish format
    const categories = {};
    for (const [name, cmd] of commands) {
      const cat = cmd.config.category || "Uncategorized";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    let msg = `╔════════════════════════╗
💫  🪽°𝙉𝙚𝙯𝙪𝙠𝙤 𝘾𝙝𝙖𝙣°🐰 ︵✰
╚════════════════════════╝\n`;

    for (const category of Object.keys(categories).sort()) {
      const emoji = "⚡"; // emoji for all categories
      msg += `┏━━━ ${emoji} ${category.toUpperCase()} ${emoji} ━━━┓\n`;
      for (const c of categories[category].sort()) {
        msg += `┃ • ${c}\n`;
      }
      msg += `┗━━━━━━━━━━━━━━━━━━━━━━┛\n`;
    }

    // Footer
    msg += `╔════════════════════════╗
💎 Total Commands: ${commands.size}
🔰 Prefix: ${prefix}
👤 Dev: 𝘼𝙯 𝙖𝙙 👻🩸
╚════════════════════════╝`;

    await message.reply({
      body: msg,
      attachment: await global.utils.getStreamFromURL(currentImage)
    });
  },
};
