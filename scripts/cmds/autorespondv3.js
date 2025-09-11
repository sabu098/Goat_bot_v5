module.exports = {
  config: {
    name: "autorespondv3",
    version: "3.3",
    author: "Haru (optimized + completed by Azad)",
    cooldown: 5,
    role: 0,
    shortDescription: "Autoresponds with reactions and replies",
    longDescription: "Ignores balance commands but responds to other triggers.",
    category: "fun",
    guide: "?autorespondv3",
  },

  onStart: async () => {},

  onChat: async ({ api, event }) => {
    const { body = "", messageID, threadID } = event;
    const text = body.toLowerCase();

    // ✅ Ignore balance card commands
    const ignoredCommands = ["?bal", "?bl", "?mybalcard"];
    if (ignoredCommands.some(cmd => text.startsWith(cmd))) return;

    // Word → Emoji mapping
    const wordToEmoji = {
      "hello ": "💋", "august": "💥", "jonell": "🤌", "david": "🤚",
      "purple": "🫴", "fritz": "👁️‍🗨️", "sab": "💨", "haru": "🙊", "gays": "🤮", "kim": "🤡",
      "dia": "💚", "bts gays": "🤡", "ginanun": "💚", "gaganunin": "💚", "pfft": "💚",
      "xyrene": "💚", "gumanun": "💚",
      "jo": "😾", "ariii": "😾", "sobhan gay": "😾", "galit": "😾",
      "wtf": "😼", "fck": "😼", "haaays": "😼", "naku": "😼", "ngi ": "😼", "ngi": "😼",
      "ngek": "😼", "nge ": "😼", "nge": "😼", "luh": "😼", "lah": "😼",
      "pill": "😸", "laugh": "😸", "lt ": "😸", "lt": "😸", "gagi": "😸", "huy": "😸", "hoy": "😸",
      "prodia": "🌀", "sdxl": "🌀", "bardv3": "🌀", "tanongv2": "🌀", "-imagine": "🌀",
      "genimg": "🌀", "tanongv4": "🌀", "kamla": "🤓", "-shortcut": "🌀", "imagine": "🌀",
      "textpro": "🌀", "photofy": "🌀",
      "hi": "😮‍💨", "salut": "🫡", "bjr": "👋", "bonjour": "👋",
      " salut": "👋", "👋": "👋", "bonsoir": "👋", "slt": "👋",
      "🔥": "🔥", ".jpg": "🔥", "astig": "🔥", "damn": "🔥", "angas": "🔥",
      "galing": "🔥", "husay": "🔥",
      "merde": "💩", "caca": "💩", "shit": "💩",
      "beurk": "🤢", "dégueulasse": "🤢", "dégeu": "🤢", "horrible": "🤢", "vomir": "🤢",
      "amour": "🌸", "câlin": "🌸", "tendresse": "🌸", "gentillesse": "🌸", "bienveillance": "🌸",
      "douceur": "🌸", "complicité": "🌸", "gratitude": "🌸", "bonheur": "🌸", "amitié": "🌸",
      "gays": "😂", "mia khalifa ": "😂", "yamate kudasai ": "😂", "bitch": "😂",
      "son of bitch ": "😂", "you ass hole": "😂", "amusant": "😂", "hilarant": "😂",
      "loufoque": "😂", "bouffonnerie": "😂", "cocasse": "😂", "burlesque": "😂", "rigolo": "😂",
      "absurde": "😂", "irrévérencieux": "😂", "ironique": "😂", "ironie": "😂", "parodie": "😂",
      "esprit": "😂", "facétieux": "😂",
      "cool": "😎", "formidable": "😎", " 😎": "😎",
      "super": "⚡", "aesther": "⚡",
      "prefix": "🤖", "robot": "🤖",
      "nathan": "🔰", "barro": "🔰",
      "bien": "✔️", "ok": "✅",
      "congrats": "🎉", "mia khalifa no more ": "🎉", "goddess-anaïs": "🎉",
      "xd": "😆",
      "restart": "✅",
      "fuck": "🖕", "enculer": "🖕", "fdp": "🖕", "🖕": "🖕",
      "goddess-anaïs": "🌼",
      "mmmh": "😇", "kiii": "🧐",
      "aesther": "💍",
      "anjara": "💵", "anjara ": "😝",
      "oui": "✨", 
      "wrong": "✖️", "faux": "✖️",
      "araara": "😽",
      "kindly provide the question": "🤡", "clone": "🤡", " sanchokuin": "🤡", "bakugo": "🤡",
      "bruh": "😕",
      "kindly provide": "👎",
      "*thea": "🌩️", "tatakae": "🌩️", "damare": "🌩️",
      "tué": "🔪",
      "bby": "🤍",
    };

    // Replies
    const replies = { "loft": "~~𝙾𝚞𝚒 ?? 🙃🌷" };

    // Apply emoji reactions
    for (const [word, emoji] of Object.entries(wordToEmoji)) {
      if (text.includes(word)) api.setMessageReaction(emoji, messageID, () => {}, true);
    }

    // Apply text replies
    for (const [trigger, reply] of Object.entries(replies)) {
      if (text.includes(trigger)) api.sendMessage(reply, threadID, messageID);
    }
  }
};
