// Author: Azad
// File: prefix.js

const fs = require("fs-extra");
const { utils } = global;

module.exports = {
config: {
name: "prefix",
version: "1.6",
author: "Azad",
countDown: 5,
role: 0,
description: "Change or check bot prefix in your chat or globally (admin only)",
category: "config",
guide: {
vi: "   {pn} <new prefix>: change prefix in your chat\n"
+ "   Example: {pn} #\n"
+ "   {pn} <new prefix> -g: change prefix globally (admin only)\n"
+ "   Example: {pn} # -g\n"
+ "   {pn} reset: reset prefix in your chat",
en: "   {pn} <new prefix>: change prefix in your chat\n"
+ "   Example: {pn} #\n"
+ "   {pn} <new prefix> -g: change prefix globally (admin only)\n"
+ "   Example: {pn} # -g\n"
+ "   {pn} reset: reset prefix in your chat"
}
},

langs: {  
    vi: {    
        reset: "Đã reset prefix về mặc định: %1",    
        onlyAdmin: "Chỉ admin mới có thể thay đổi prefix toàn hệ thống",    
        confirmGlobal: "Vui lòng react để xác nhận thay đổi prefix toàn hệ thống",    
        confirmThisThread: "Vui lòng react để xác nhận thay đổi prefix nhóm chat",    
        successGlobal: "Đã thay đổi prefix toàn hệ thống: %1",    
        successThisThread: "Đã thay đổi prefix nhóm chat: %1",    
        myPrefix: "🌐 System prefix: %1\n🛸 Thread prefix: %2"    
    },    
    en: {    
        reset: "Prefix has been reset to default: %1",    
        onlyAdmin: "Only admin can change system-wide prefix",    
        confirmGlobal: "Please react to confirm system-wide prefix change",    
        confirmThisThread: "Please react to confirm thread prefix change",    
        successGlobal: "System-wide prefix changed to: %1",    
        successThisThread: "Thread prefix changed to: %1",    
        myPrefix: "🌐 System prefix: %1\n🛸 Thread prefix: %2"    
    }    
},  

onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {    
    if (!args[0]) return message.SyntaxError();    

    if (args[0] === "reset") {    
        await threadsData.set(event.threadID, null, "data.prefix");    
        return message.reply(getLang("reset", global.GoatBot.config.prefix));    
    }    

    const newPrefix = args[0];    
    const formSet = { commandName, author: event.senderID, newPrefix };    

    let confirmText = "";    

    if (args[1] === "-g") {    
        if (role < 2) return message.reply(getLang("onlyAdmin"));    
        formSet.setGlobal = true;    
        confirmText = getLang("confirmGlobal");    
    } else {    
        formSet.setGlobal = false;    
        confirmText = getLang("confirmThisThread");    
    }    

    // Get sender name for styling    
    let senderName = "User";    
    try {    
        const userInfo = await message.api.getUserInfo(event.senderID);    
        senderName = userInfo[event.senderID].name || "User";    
    } catch (e) {}    

    // Fancy confirmation box with “Broder”    
    const boxConfirm = `

╔════════════════════════╗
👋 Hey, ${senderName} !
⚡ ${confirmText}
────────────────────────
💡 React to this message to confirm
╚════════════════════════╝
`.trim();

return message.reply(boxConfirm, (err, info) => {    
        formSet.messageID = info.messageID;    
        global.GoatBot.onReaction.set(info.messageID, formSet);    
    });    
},    

onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {    
    const { author, newPrefix, setGlobal } = Reaction;    
    if (event.userID !== author) return;    

    if (setGlobal) {    
        global.GoatBot.config.prefix = newPrefix;    
        fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));    
        return message.reply(getLang("successGlobal", newPrefix));    
    } else {    
        await threadsData.set(event.threadID, newPrefix, "data.prefix");    
        return message.reply(getLang("successThisThread", newPrefix));    
    }    
},    

onChat: async function ({ event, message, getLang, api }) {    
    if (event.body && event.body.toLowerCase() === "prefix") {    
        const botUptime = process.uptime();    
        const hours = Math.floor(botUptime / 3600);    
        const minutes = Math.floor((botUptime % 3600) / 60);    
        const seconds = Math.floor(botUptime % 60);    
        const uptimeText = `${hours}h ${minutes}m ${seconds}s`;    

        let senderName = "User";    
        try {    
            const userInfo = await api.getUserInfo(event.senderID);    
            senderName = userInfo[event.senderID].name || "User";    
        } catch (e) {}    

        const threadPrefix = utils.getPrefix(event.threadID);    
        const systemPrefix = global.GoatBot.config.prefix;    

        const boxMessage = `

╔════════════════════════════╗
🎉 Hey, ${senderName} ! 𝑌𝑜𝑢 𝑎𝑠𝑘 𝑚𝑦 𝑝𝑟𝑒𝑓𝑖𝑥: ${systemPrefix} 🎉
────────────────────────────
🕒 Bot Uptime: ⏳ ${uptimeText}
🌐 System Prefix: ${systemPrefix}
🛸 Thread Prefix: ${threadPrefix}
──
