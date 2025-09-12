const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

// Image rotation state
let imageIndex = 0; // keeps track of which image to show next
const images = [
  "https://i.imgur.com/FqD68L9.jpeg",
  "https://i.imgur.com/y6Ktrjk.jpeg",
  "https://i.imgur.com/s1z38No.jpg", // .jpe converted to .jpg
  "https://i.imgur.com/VSxxpm3.jpeg"
];

module.exports = {
  config: {
    name: "help",
    version: "1.0",
    author: "𝘼𝙯 𝙖𝙙 👻🩸",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Show all command list (Bordered SMS Style)" },
    longDescription: { en: "Display all commands in a single bordered message" },
    category: "system",
  },

  onStart: async function ({ message, args, event }) {
    const prefix = getPrefix(event.threadID);

    // Determine which image to show
    const currentImage = images[imageIndex];
    imageIndex = (imageIndex + 1) % images.length; // move to next for next help request

    // 🔎 Command specific help
    if (args[0]) {
      const cmdName = args[0].toLowerCase();
      const command = commands.get(cmdName) || commands.get(aliases.get(cmdName));
      if (!command) return message.reply(`💀👻 No such command: ${cmdName}`);

      const singleMsg = `╔═══════════════════════╗
💀 𝘾𝙤𝙢𝙢𝙖𝙣𝙙: ${command.config.name} ⚔️
📜 𝘿𝙚𝙨𝙘𝙧𝙞𝙥𝙩𝙞𝙤𝙣: ${command.config.shortDescription?.en || "No description"} 
🔥 𝙑𝙚𝙧𝙨𝙞𝙤𝙣: ${command.config.version || "1.0"} 
👤 𝘼𝙪𝙩𝙝𝙤𝙧: ${command.config.author || "Unknown"} 
🔑 𝙍𝙤𝙡𝙚: ${command.config.role || 0} 
⏳ 𝘾𝙤𝙤𝙡𝙙𝙤𝙬𝙣: ${command.config.countDown || 5}s
╚═══════════════════════╝`;

      return message.reply({
        body: singleMsg,
        attachment: await global.utils.getStreamFromURL(currentImage)
      });
    }

    // 📚 Full help list
    const categories = {};
    for (const [name, cmd] of commands) {
      const cat = cmd.config.category || "Uncategorized";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    let msg = `╔════════════════════════════════╗
⚔️ ︵✰[🪽°𝙉𝙚𝙯𝙪𝙠𝙤 𝘾𝙝𝙖𝙣°🐰]࿐ 👻🩸
𝙥𝙧𝙚𝙛𝙞𝙭: ${prefix}
╚════════════════════════════════╝\n`;

    for (const category of Object.keys(categories).sort()) {
      const cmds = categories[category].sort();
      msg += `╔─ ${category.toUpperCase()} ─╗\n`;
      msg += cmds.join('  ') + '\n';
      msg += `╚────────────────────────────╝\n`;
    }

    msg += `╔════════════════════════════════╗
🔰 𝙏𝙤𝙩𝙖𝙡 𝘾𝙤𝙢𝙢𝙖𝙣𝙙𝙨: ${commands.size}
♻️ 𝙥𝙧𝙚𝙛𝙞𝙭: ${prefix}
👤   𝘿𝙚𝙫:  𝘼𝙯 𝙖𝙙
╚════════════════════════════════╝`;

    await message.reply({
      body: msg,
      attachment: await global.utils.getStreamFromURL(currentImage)
    });
  },
};
