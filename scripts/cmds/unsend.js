module.exports = {
  config: {
    name: "unsend",
    aliases: ["un", "u", "uns", "unsent"],
    version: "2.5",
    author: "NTKhang | Azad 💥", //author change korle tor marechudi 
    countDown: 5,
    role: 0,
    description: {
      en: "Delete bot messages (works with prefix + no prefix in group)"
    },
    category: "box chat",
    guide: {
      en: "Reply to a bot's message and type unsend"
    },
    usePrefix: false
  },

  // sms list 
  errors: [
    "আরে আরে'খানকিরপোলা'মেসেজ রিপ্লাই না দিলে আমি ডিলিট করবো কিভাবে_🙄?",
    "এত আবাল কোথা থেকে আসিস রে'মেসেজ মেসেজ রিপ্লাই না করে ডিলিট করতে বলছিস'কেন_🤡?",
    "গাধা! রিপ্লাই দে আগে, তার পড়ে মেসেজ ডিলিট করবো_😇?",
    "তোরে দিয়ে বট চালানো মানে ছাগল গরু কে গিটার ধরানো_🤣?",
    "আবাল ছোদা নাকি তুই রিপ্লাই দে তার পড়ে কমান্ড কর_😒?",
    "চোখ থাকতে দেখিস না কেন? রিপ্লাই দে_😦?",
    "তুই এতটা গেঁয়ো কেন হইলি রে?",
    "বোকাচোদা, আগে রিপ্লাই দে তারপর কমান্ড চালা_😾?",
    "তোরে দিয়ে কিছু হবে না, তুই তো অনেক  বড়ো খানকির পোলা তাই রিপ্লাই না দিয়ে'U'এটা দিলি_☠️?",
    "আহ সোনা গো আমার রিপ্লাই কি তোমার আব্বা দিবে নাকি তুমি সোনা_😟?"
  ],

  // wrap text in a box
  boxText(text) {
    return `✦━━━━━━━━━━━━━━━━━✦\n${text}\n✦━━━━━━━━━━━━━━━━━✦`;
  },

  
  async handleUnsend({ event, message, api }) {
    const botID = api.getCurrentUserID();

    // Check if there is a replied message
    if (!event.messageReply || !event.messageReply.messageID) {
      const arr = this.errors;
      const randomError = arr[Math.floor(Math.random() * arr.length)];
      return message.reply(this.boxText(randomError));
    }

    // Only allow deleting bot's own messages
    if (event.messageReply.senderID !== botID) {
      const arr = this.errors;
      const randomError = arr[Math.floor(Math.random() * arr.length)];
      return message.reply(this.boxText(randomError));
    }

    try {
      // Delete the bot's message (no success message)
      await message.unsend(event.messageReply.messageID);
    } catch (e) {
      return message.reply(this.boxText("⚠️ Failed to unsend message."));
    }
  },

  // Run when command is used with prefix
  onStart: async function (ctx) {
    return this.handleUnsend(ctx);
  },

  // Run in group chat without prefix
  onChat: async function ({ event, message, api }) {
    if (!event.isGroup) return;

    const body = event.body?.toLowerCase()?.trim();
    if (!body) return;

    if (["unsend", "un", "u", "uns", "unsent"].includes(body)) {
      return this.handleUnsend({ event, message, api });
    }
  }
};
