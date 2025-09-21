const { config } = global.GoatBot;
const { client } = global;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "whitelistthread",
    aliases: ["wlt"],
    version: "1.5",
    author: "NTKhang | Modify Azad",
    countDown: 5,
    role: 2,
    description: {
      en: "Add, remove, edit whitelist threads"
    },
    category: "owner",
    guide: {
      en: '   {pn} add <tid>: Add thread to whitelist'
        + '\n   {pn} remove <tid>: Remove thread from whitelist'
        + '\n   {pn} list: Show all whitelist threads'
        + '\n   {pn} mode <on | off>: Enable or disable whitelist mode'
    }
  },

  langs: {
    en: {
      added: "✅ | Added %1 threads to whitelist:\n%2",
      already: "⚠ | %1 threads already in whitelist:\n%2",
      removed: "✅ | Removed %1 threads from whitelist:\n%2",
      notFound: "⚠ | %1 threads not in whitelist:\n%2",
      list: "📌 | Whitelist threads:\n%1",
      turnedOn: "✅ | Whitelist mode enabled (only whitelist threads can use bot)",
      turnedOff: "❌ | Whitelist mode disabled (everyone can use bot now)"
    }
  },

  onStart: async function ({ message, args, event, getLang }) {
    switch (args[0]) {
      case "add": {
        if (!args[1]) return message.reply("⚠ | Please enter thread ID to add");
        let tids = args.filter(id => !isNaN(id));
        const notAdded = [];
        const already = [];
        for (const tid of tids) {
          if (config.whiteListModeThread.whiteListThreadIds.includes(tid)) {
            already.push(tid);
          } else {
            config.whiteListModeThread.whiteListThreadIds.push(tid);
            notAdded.push(tid);
          }
        }
        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(
          (notAdded.length > 0 ? getLang("added", notAdded.length, notAdded.join("\n")) : "") +
          (already.length > 0 ? getLang("already", already.length, already.join("\n")) : "")
        );
      }

      case "remove": {
        if (!args[1]) return message.reply("⚠ | Please enter thread ID to remove");
        let tids = args.filter(id => !isNaN(id));
        const removed = [];
        const notFound = [];
        for (const tid of tids) {
          if (config.whiteListModeThread.whiteListThreadIds.includes(tid)) {
            config.whiteListModeThread.whiteListThreadIds.splice(config.whiteListModeThread.whiteListThreadIds.indexOf(tid), 1);
            removed.push(tid);
          } else {
            notFound.push(tid);
          }
        }
        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(
          (removed.length > 0 ? getLang("removed", removed.length, removed.join("\n")) : "") +
          (notFound.length > 0 ? getLang("notFound", notFound.length, notFound.join("\n")) : "")
        );
      }

      case "list": {
        const tids = config.whiteListModeThread.whiteListThreadIds;
        if (tids.length === 0) return message.reply("⚠ | No thread in whitelist");
        return message.reply(getLang("list", tids.join("\n")));
      }

      case "mode": {
        if (!args[1]) return message.reply("⚠ | Please choose `on` or `off`");
        const value = args[1].toLowerCase() === "on";
        config.whiteListModeThread.enable = value;
        if (value === false) {
          config.whiteListModeThread.whiteListThreadIds = []; // সব whitelist thread clear
        }
        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(getLang(value ? "turnedOn" : "turnedOff"));
      }

      default:
        return message.reply("⚠ | Wrong syntax");
    }
  }
};
