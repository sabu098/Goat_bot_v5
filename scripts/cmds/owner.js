// ✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦
//    OWNER & BOT INFO COMMAND
//    Author: Azad
//    Version: 3.6
// ✦━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✦

module.exports = {
  config: {
    name: "owner",
    version: 3.6,
    author: "Azad",
    longDescription: "Stylish hardcoded owner & bot info card with emojis",
    category: "Special",
    guide: {
      en: "{p}{n}",
    },
  },

  onStart: async function ({ api, event, message }) {
    const mainMedia = "https://files.catbox.moe/1d9xsl.mp4";
    const fallbackMedia = "https://scontent.xx.fbcdn.net/v/t1.15752-9/537397354_1980840699345865_2351462868400401293_n.jpg";

    let attachment;
    try {
      attachment = await global.utils.getStreamFromURL(mainMedia);
    } catch {
      try {
        attachment = await global.utils.getStreamFromURL(fallbackMedia);
      } catch {
        attachment = null;
      }
    }

    const body = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
╭─╼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╾─╮
│           👑 OWNER INFO 👑
│
│ 🧑‍💼 Name       : Azad
│ 🪪 Username   : azadxxx075
│ 🎂 Birthday   : 17 July
│ 🐸 Age        : 18
│ 📚 Study      : 🚬
│ 💕 Relation   : Single
│ 📱 Contact    : 019747624**
│ ✉️ Email      : azadxxx92929@email.com
│ 🌍 Location   : Chittagong, Bangladesh
│ 🕋 Religion   : Islam
│ 🌐 Facebook   : fb.com/profile.php?id=61578365162382
│ 🎮 Hobby      : Gaming
│ 💻 Skill      : JavaScript, Node.js, Bot Dev
│ 🎵 Fav Song   : sesh-kanna
│ 🕐 Timezone   : GMT+6 (Bangladesh)
│
│           🤖 BOT INFO 🤖
│
│ 🛠 Bot Name   : ✰🪽°𝙉𝙚𝙯𝙪𝙠𝙤 𝘾𝙝𝙖𝙣°🐰࿐
│ 🔰 Prefix     : )
│ 👑 Author     : Azad
│
│         ⚡ Powered by Azad ⚡
╰─╼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╾─╯
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    message.reply({
      body,
      attachment
    });
  }
};
