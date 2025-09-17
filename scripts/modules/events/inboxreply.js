// Author: Azad
// File: modules/events/inboxReply.js

module.exports = {
  config: {
    name: "inboxReply",
    eventType: ["message"],
    author: "Azad",
    version: "2.1",
    description: "Stylish auto reply in inbox",
  },

  onStart: async function ({ api, event }) {
    try {
      const prefixList = global.GoatBot.config.prefix;
      let body = event.body || "";

      // Prefix থাকলে কিছু করবে না
      if (prefixList.some(p => body.startsWith(p))) return;

      // Sender name fetch
      const userInfo = await api.getUserInfo(event.senderID);
      const senderName = userInfo[event.senderID].name;

      // Stylish auto reply message
      const reply = `
✦━━━━━━━━━━━━✦
👋 হ্যালো ${senderName}  

আমি ✰🪽°𝙉𝙚𝙯𝙪𝙠𝙤 𝘾𝙝𝙖𝙣°🐰࿐ Bot 🤖

💡 Prefix ছাড়া কিছু লিখলে আমি শুধু auto reply দিবো।  
📌 Command ব্যবহার করতে চাইলে prefix দিয়ে লিখো।

✦━━━━━━━━━━━━✦
✨ Powered by Azad
`;

      api.sendMessage(reply, event.threadID, event.messageID);
    } catch (e) {
      console.log("Inbox reply error:", e);
    }
  },
};
