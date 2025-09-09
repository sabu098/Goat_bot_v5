const axios = require("axios");

function roleTextToString(role) {
  switch (role) {
    case 0: return "🟢 Everyone";
    case 1: return "🟡 Group Admins";
    case 2: return "🔴 Bot Admins";
    default: return "❓ Unknown";
  }
}

// Category emoji map
const categoryIcons = {
  info: "📚",
  system: "⚙️",
  admin: "🛡️",
  fun: "🎮",
  games: "🎲",
  economy: "💰",
  media: "🎬",
  ai: "🤖",
  owner: "👑",
  misc: "✨",
  uncategorized: "📦"
};

module.exports = {
  config: {
    name: "help",
    aliases: ["use", "cmdl"],
    version: "2.0",
    author: "Azad",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Sleek & stylish command menu" },
    longDescription: { en: "Get detailed command usage with modern stylish look" },
    category: "info",
    guide: { en: "{pn} / help cmdName\n{pn} -c <categoryName>" },
    priority: 1,
  },

  onStart: async function ({ message, args, event }) {
    const { threadID } = event;

    // 🔹 Azad's FB ID & avatar
    const ownerUid = "61578365162382"; 
    let avatarStream = null;
    try {
      const response = await axios.get(
        `https://graph.facebook.com/${ownerUid}/picture?height=300&width=300&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "stream" }
      );
      avatarStream = response.data;
    } catch {
      avatarStream = null;
    }

    // fallback prefix
    let prefix = "!";
    try {
      if (global.utils && typeof global.utils.getPrefix === "function") {
        prefix = global.utils.getPrefix(threadID) || "!";
      }
    } catch { prefix = "!"; }

    const commands = global.GoatBot?.commands;
    const aliases = global.GoatBot?.aliases;

    if (!commands || !aliases) return await message.reply("❌ Commands are not loaded yet.");

    // ----- Full Help Menu -----
    if (!args.length) {
      let msg = `╔════════════════════════════╗
︵✰[_🪽°𝙉𝙚𝙯𝙪𝙠𝙤 𝘾𝙝𝙖𝙣°🐰_]࿐ — 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 ✨
╚════════════════════════════╝\n`;

      const categories = {};
      for (const [name, cmd] of commands) {
        // ✅ Remove role filter — show all commands
        const cat = (cmd.config.category || "Uncategorized").toLowerCase();
        categories[cat] = categories[cat] || [];
        categories[cat].push(name);
      }

      const sortedCats = Object.keys(categories).sort();
      for (const cat of sortedCats) {
        const icon = categoryIcons[cat] || "📦";
        msg += `\n╭─ ${icon} ${cat.toUpperCase()} ─────────╮\n`;
        categories[cat].sort().forEach(c => msg += `│ 🔹 ${c}\n`);
        msg += `╰─────────────────────────╯\n`;
      }

      msg += `\n📌 Total Commands: ${commands.size}
💡 Usage: ${prefix}help <command>
👑 Owner: 🅰🆉🅰🅳
🔗 FB: facebook.com/profile.php?id=${ownerUid}\n`;

      return await message.reply({ body: msg, attachment: avatarStream ? [avatarStream] : [] });
    }

    // ----- Category Help -----
    else if (args[0] === "-c") {
      if (!args[1]) return await message.reply("❗ Please specify a category.");

      const categoryName = args[1].toLowerCase();
      const filtered = Array.from(commands.values()).filter(
        cmd => (cmd.config.category || "").toLowerCase() === categoryName
      );
      if (!filtered.length) return await message.reply(`❌ No commands in "${categoryName}"`);

      const icon = categoryIcons[categoryName] || "📦";
      let msg = `╔════════════════════╗
📂 ${icon} ${categoryName.toUpperCase()} COMMANDS
╚════════════════════╝\n`;

      filtered.sort((a,b)=>a.config.name.localeCompare(b.config.name))
              .forEach(cmd => msg += `│ 🔹 ${cmd.config.name}\n`);
      msg += `╰────────────────────╯`;

      return await message.reply({ body: msg, attachment: avatarStream ? [avatarStream] : [] });
    }

    // ----- Command Details -----
    else {
      const commandName = args[0].toLowerCase();
      const alias = aliases.get(commandName);
      const command = commands.get(commandName) || (alias && commands.get(alias));
      if (!command) return await message.reply(`❌ Command "${commandName}" not found.`);

      const cfg = command.config;
      const usage = (cfg.guide?.en || "No guide")
        .replace(/{p}/g, prefix)
        .replace(/{n}/g, cfg.name);

      const msg = `╔══════════════════════════════╗
🌟 COMMAND: ${cfg.name.toUpperCase()}
╚══════════════════════════════╝

📌 Description: ${cfg.longDescription?.en || "No description"}
🛠 Aliases: ${cfg.aliases?.length ? cfg.aliases.join(", ") : "None"}
⚡ Version: ${cfg.version || "1.0"}
👤 Role: ${roleTextToString(cfg.role)}
⏱ Cooldown: ${cfg.countDown || 1}s
✍️ Author: ${cfg.author || "Unknown"}

📖 Usage:
${usage}

📝 Notes:
︵✰[_🪽°𝙉𝙚𝙯𝙪𝙠𝙤 𝘾𝙝𝙖𝙣°🐰_]࿐ content cannot be changed
♕︎ Owner: 🅰🆉🅰🅳 ♕

🔗 FB: facebook.com/profile.php?id=${ownerUid}`;

      return await message.reply({ body: msg, attachment: avatarStream ? [avatarStream] : [] });
    }
  },
};
