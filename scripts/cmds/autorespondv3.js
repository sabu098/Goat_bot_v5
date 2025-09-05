module.exports = {
config: {
name: "autorespondv3",
version: "2.1.0",
author: "Haru",
cooldown: 5,
role: 0,
shortDescription: "Autoresponds with reactions and replies",
longDescription: "Autoresponds with reactions and replies based on specific words or triggers (regex-based).",
category: "fun",
guide: "?autorespondv3",
},

onStart: async ({ api, event }) => {},

onChat: async ({ api, event }) => {
const { body, messageID, threadID } = event;
if (!body) return;

const text = body.toLowerCase();  

// Regex-based reactions  
const emojiPatterns = [  
  { emoji: "💜", pattern: /\b(hello|august|jonell|david|purple|fritz|sab|haru|gays|kim)\b/ },  
  { emoji: "💚", pattern: /\b(dia|bts gays|ginanun|gaganunin|pfft|xyrene|gumanun)\b/ },  
  { emoji: "😾", pattern: /\b(jo|ariii|sobhan gay|galit)\b/ },  
  { emoji: "😼", pattern: /\b(wtf|fck|haaays|naku|ngi|ngek|nge|luh|lah)\b/ },  
  { emoji: "😸", pattern: /\b(pill|laugh|lt|gagi|huy|hoy)\b/ },  
  { emoji: "🌀", pattern: /\b(prodia|sdxl|bardv3|tanongv2|-imagine|genimg|tanongv4|kamla|-shortcut|imagine|textpro|photofy)\b/ },  
  { emoji: "👋", pattern: /\b(hi|hello|salut|bjr|bonjour|bonsoir|slt)\b|👋/ },  
  { emoji: "🔥", pattern: /(🔥|\.jpg|astig|damn|angas|galing|husay)/ },  
  { emoji: "💩", pattern: /\b(merde|caca|shit)\b/ },  
  { emoji: "🤢", pattern: /\b(beurk|dégueulasse|dégeu|horrible|vomir)\b/ },  
  { emoji: "🌸", pattern: /\b(amour|câlin|tendresse|gentillesse|bienveillance|douceur|complicité|gratitude|bonheur|amitié)\b/ },  
  { emoji: "😂", pattern: /\b(gays|mia khalifa|yamate kudasai|bitch|son of bitch|you ass hole|amusant|hilarant|loufoque|bouffonnerie|cocasse|burlesque|rigolo|absurde|irrévérencieux|ironique|ironie|parodie|esprit|facétieux)\b/ },  
  { emoji: "😎", pattern: /\b(cool|formidable)\b|😎/ },  
  { emoji: "⚡", pattern: /\b(super|aesther)\b/ },  
  { emoji: "🤖", pattern: /\b(prefix|robot)\b/ },  
  { emoji: "🔰", pattern: /\b(nathan|barro)\b/ },  
  { emoji: "✔️", pattern: /\b(bien|ok)\b/ },  
  { emoji: "🎉", pattern: /\b(congrats|mia khalifa no more|goddess-anaïs)\b/ },  
  { emoji: "😆", pattern: /\b(xd)\b/ },  
  { emoji: "♻️", pattern: /\b(restart)\b/ },  
  { emoji: "🖕", pattern: /(fuck|enculer|fdp|🖕)/ },  
  { emoji: "🌼", pattern: /\b(goddess-anaïs)\b/ },  
  { emoji: "😑", pattern: /\b(mmmh|kiii)\b/ },  
  { emoji: "💍", pattern: /\b(aesther)\b/ },  
  { emoji: "💵", pattern: /\b(anjara)\b/ },  
  { emoji: "😝", pattern: /\b(anjara)\b/ },  
  { emoji: "✨", pattern: /\b(oui|super)\b/ },  
  { emoji: "✖️", pattern: /\b(wrong|faux)\b/ },  
  { emoji: "😽", pattern: /\b(araara)\b/ },  
  { emoji: "🤡", pattern: /\b(kindly provide the question|clone|sanchokuin|bakugo)\b/ },  
  { emoji: "😕", pattern: /\b(bruh)\b/ },  
  { emoji: "👎", pattern: /\b(kindly provide)\b/ },  
  { emoji: "🌩️", pattern: /\b(\*thea|tatakae|damare)\b/ },  
  { emoji: "🔪", pattern: /\b(tué)\b/ },  
];  

// Replies  
const replyPatterns = [  
  { pattern: /\bloft\b/, reply: "~~𝙾𝚞𝚒 ?? 🙃🌷" }  
];  

// React check  
for (const { emoji, pattern } of emojiPatterns) {  
  if (pattern.test(text)) {  
    api.setMessageReaction(emoji, messageID, () => {}, true);  
    break; // stop after first match  
  }  
}  

// Reply check  
for (const { pattern, reply } of replyPatterns) {  
  if (pattern.test(text)) {  
    api.sendMessage(reply, threadID, messageID);  
  }  
}

}
};
