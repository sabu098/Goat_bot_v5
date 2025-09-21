const { config } = global.GoatBot;
const { client } = global;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "whitelist",
    aliases: ["wl"],
    version: "1.5",
    author: "NTKhang | Modify Azad",
    countDown: 5,
    role: 2,
    description: {
      en: "Add, remove, edit whitelist users"
    },
    category: "owner",
    guide: {
      en: '   {pn} add <uid>: Add user to whitelist'
        + '\n   {pn} remove <uid>: Remove user from whitelist'
        + '\n   {pn} list: Show all whitelist users'
        + '\n   {pn} mode <on | off>: Enable or disable whitelist mode'
    }
  },

  langs: {
    en: {
      added: "✅ | Added %1 users to whitelist:\n%2",
      already: "⚠ | %1 users already in whitelist:\n%2",
      removed: "✅ | Removed %1 users from whitelist:\n%2",
      notFound: "⚠ | %1 users not in whitelist:\n%2",
      list: "📌 | Whitelist users:\n%1",
      turnedOn: "✅ | Whitelist mode enabled (only whitelist users can use bot)",
      turnedOff: "❌ | Whitelist mode disabled (everyone can use bot now)"
    }
  },

  onStart: async function ({ message, args, event, getLang }) {
    switch (args[0]) {
      case "add": {
        if (!args[1]) return message.reply("⚠ | Please enter user ID to add");
        let uids = args.filter(id => !isNaN(id));
        const notAdded = [];
        const already = [];
        for (const uid of uids) {
          if (config.whiteListMode.whiteListIds.includes(uid)) {
            already.push(uid);
          } else {
            config.whiteListMode.whiteListIds.push(uid);
            notAdded.push(uid);
          }
        }
        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(
          (notAdded.length > 0 ? getLang("added", notAdded.length, notAdded.join("\n")) : "") +
          (already.length > 0 ? getLang("already", already.length, already.join("\n")) : "")
        );
      }

      case "remove": {
        if (!args[1]) return message.reply("⚠ | Please enter user ID to remove");
        let uids = args.filter(id => !isNaN(id));
        const removed = [];
        const notFound = [];
        for (const uid of uids) {
          if (config.whiteListMode.whiteListIds.includes(uid)) {
            config.whiteListMode.whiteListIds.splice(config.whiteListMode.whiteListIds.indexOf(uid), 1);
            removed.push(uid);
          } else {
            notFound.push(uid);
          }
        }
        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(
          (removed.length > 0 ? getLang("removed", removed.length, removed.join("\n")) : "") +
          (notFound.length > 0 ? getLang("notFound", notFound.length, notFound.join("\n")) : "")
        );
      }

      case "list": {
        const uids = config.whiteListMode.whiteListIds;
        if (uids.length === 0) return message.reply("⚠ | No user in whitelist");
        return message.reply(getLang("list", uids.join("\n")));
      }

      case "mode": {
        if (!args[1]) return message.reply("⚠ | Please choose `on` or `off`");
        const value = args[1].toLowerCase() === "on";
        config.whiteListMode.enable = value;
        if (value === false) {
          config.whiteListMode.whiteListIds = []; // সব whitelist user clear
        }
        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(getLang(value ? "turnedOn" : "turnedOff"));
      }

      default:
        return message.reply("⚠ | Wrong syntax");
    }
  }
};
