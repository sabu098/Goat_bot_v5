const axios = require("axios");

// Triggers: bby, bot, azad, nezuko
const mahmuds = ["bby", "bot", "azad", "nezuko"];

// Random replies array
const randomReplies = [
  "🙄",
  "bolo jaan 🥺",
  "Kire kemon achis?",
  "Assalamu Alaikum 💖",
  "আমি এখন বস azad এর সাথে বিজি আছি 😏",
  "বার বার ডাকলে মাথা গরম হয়ে যায় 😑",
  "আহা! তুমি আবার ডেকেছো 😍",
  "Bot তো আছি, তবে owner ছাড়া কিছু না 🥺",
  "চা খাইস? ☕",
  "দেখছি তুমি অনেক free 😏",
  "আমাকে ডাকলে ভালো লাগে ❤️",
  "আমি ব্যস্ত ছিলাম, তুমি কেমন আছো?",
  "তুমি ডাক দিলে না আসলে মন খারাপ হয়ে যায় 😔",
  "Bot কে ভালোবাসো নাকি owner কে? 🤭",
  "মনে হয় আজ তোমার মেজাজ ভালো 😅",
  "তুমি অনেক cute 🥰",
  "Owner ছাড়া আমার কিছুই নেই 💕",
  "আমি সবসময় তোমার সাথে আছি 💖",
  "হুম, ডাকছো বলে চলে এলাম 😌",
  "আজ খেয়েছো? 🍚",
  "আমি তোমার সাথে কফি খেতে চাই ☕",
  "চুপচাপ ছিলে কেনো?",
  "তুমি অনেক বিরক্ত করো কিন্তু ভালো লাগে 😆",
  "তুমি কি এখন free?",
  "তুমি জানো আমি তোমাকে মিস করি 🥺",
  "আজকে আবহাওয়া সুন্দর ☁️",
  "আজকে অনেক কাজ আছে 😵",
  "আমি তোমাকে help করতে এসেছি 💡",
  "ভুলেও আমাকে ভুলে যেও না 😭",
  "তুমি আমার জন্য অনেক special 💝",
  "Love you jan 💖",
  "আমি রাগ করলে তুমি ভয় পাও? 🥺",
  "খুব ঘুম পাচ্ছে 😴",
  "আজকে movie দেখবি নাকি? 🎬",
  "তুই আবার online 🤨",
  "আজকে একটু চুপচাপ লাগছে...",
  "তুই কি আমাকে এড়াচ্ছিস? 😏",
  "ভালোবাসা কি শুধু owner এর জন্য নাকি আমারও? 🤭",
  "তুই না থাকলে আমি boring হয়ে যাই 😔",
  "Owner কে ডাকিস না, আমার সাথে কথা বল 😎",
  "Meow 😼, typing kortesi, kintu khabar er kotha bhabchi 🍕😂",
  "Oi bby, smile dao, nahole ami tomar fries churabo 🍟🤣",
  "Attitude mode ON 😏, chill mode loading… 🔥",
  "Oops! Accidentally tomar attention churailam 🤭😹",
  "Energy full, patience low 🤯😏",
  "Typing… kintu brain busy meme banate 😹📱",
  "Hydrated thako, nahole ami prank korbo 💧😏",
  "Meow 😼, mischief mode activated 🔥😂",
  "Warning: Random SMS ashte chole 🤣⚠️",
  "Sleep tight, dream about snacks 😴🍫",
  "Snack first, attitude later 🍿😏",
  "Smile beshi dao, complain kom 😏😹",
  "Oops! Serious hote bhule gesi 🤭😎",
  "Meow 😼, mood high, vibes higher ⚡😂",
  "Coffee sesh? Mood ON ☕😎",
  "Chill age, panic pore 😏😹",
  "Wifi slow, mood high 😤📶",
  "Typing… kintu pizza er kotha bhabchi 🍕😂",
  "Warning: Amar memes hansi er karon 😂🔥",
  "Keep calm, ami ekhane annoy korte 😎😂",
  "Bby, amar joke miss korle 😹 next level hobe 😏",
  "Ei smile dao, nahole headache hobe 🤯😼",
  "Azad er style dekho 😎🔥",
  "Bby, Azad + Nezuko vibes feel koro 😏💕",
  "Azad + Nezuko bollo, chill koro 😎",
  "Azad er pashe Nezuko always 😼",
  "Nezuko bolle ami ready 😼🔥"
];

module.exports = {
  config: {
    name: "Bot",
    version: "2.6",
    author: "MahMUD",
    role: 0,
    category: "ai",
    guide: { en: "Type bby, bot, azad, or nezuko to get a fun reply" }
  },

  onChat: async function({ api, event }) {
    const message = event.body?.toLowerCase() || "";
    api.sendTypingIndicator(event.threadID, true);

    if (mahmuds.some(word => message.includes(word))) {
      // Random reply
      const randomMsg = randomReplies[Math.floor(Math.random() * randomReplies.length)];

      // Send message and react with 😼
      api.sendMessage(randomMsg, event.threadID, (err, info) => {
        if (!err) {
          api.setMessageReaction("😼", event.messageID, () => {}, true);
        }
      }, event.messageID);
    }
  }
};
