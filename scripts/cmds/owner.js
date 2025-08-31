const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "owner",
    aliases: ["info"],
    author: "Azad",
    role: 0,
    shortDescription: "Owner info",
    longDescription: "Stylish owner information with reliable video handling",
    category: "info",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    // -------- Owner text --------
    const ownerInfo = {
      name: '✨ 𝐀ɭoŋe Loveʀ ✨',
      class: '📚 🙄😳',
      group: '👥 😥',
      gender: '🚹 𝑴𝑨𝑳𝑬',
      birthday: '🎂 7-03-2007',
      religion: '☪️ 𝑰𝑺𝑳𝑨𝑴',
      hobby: '🎯 𝑭𝒍𝒊𝒓𝒕𝒊𝒏𝒈 😼🫵',
      fb: 'https://www.facebook.com/profile.php?id=61578365162382',
      relationship: '💔 𝑨𝑳𝑾𝑨𝒀𝑺 𝑩𝑬 𝑺𝑰𝑵𝑮𝑳𝑬',
      height: '📏 jani na 😴🗿'
    };

    const response =
`💫 ━━━━『 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 』━━━━ 💫

🔹 𝗡𝗔𝗠𝗘: ${ownerInfo.name}
🔹 𝗖𝗟𝗔𝗦𝗦: ${ownerInfo.class}
🔹 𝗚𝗥𝗢𝗨𝗣: ${ownerInfo.group}
🔹 𝗚𝗘𝗡𝗗𝗘𝗥: ${ownerInfo.gender}
🔹 𝗕𝗜𝗥𝗧𝗛𝗗𝗔𝗬: ${ownerInfo.birthday}
🔹 𝗥𝗘𝗟𝗜𝗚𝗜𝗢𝗡: ${ownerInfo.religion}
🔹 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣: ${ownerInfo.relationship}
🔹 𝗛𝗢𝗕𝗕𝗬: ${ownerInfo.hobby}
🔹 𝗛𝗘𝗜𝗚𝗛𝗧: ${ownerInfo.height}
🔹 𝗙𝗕: ${ownerInfo.fb}

✨ Bot made with 💖 by Azad ✨`;

    // -------- Video handling (safe-first) --------
    const ASSETS_DIR = path.join(__dirname, 'assets');
    const CACHE_DIR  = path.join(__dirname, 'cache');
    const LOCAL_VIDEO = path.join(ASSETS_DIR, 'owner.mp4');   // <-- এখানে নিজের ভিডিও রাখো
    const TEMP_VIDEO  = path.join(CACHE_DIR, 'owner_video.mp4');

    // চাইলে একটি ব্যাকআপ URL রাখলাম; না লাগলেও সমস্যা নেই
    const FALLBACK_URL = 'https://files.catbox.moe/7xk7i5.mp4'; // উদাহরণ; কাজ না করলে শুধু টেক্সট যাবে

    // Ensure cache dir
    try { if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR); } catch {}

    const sendWithAttachment = (filePath) => {
      return new Promise((resolve) => {
        api.sendMessage({
          body: response,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, (err) => {
          resolve(!err);
        });
      });
    };

    const sendTextOnly = () => {
      return new Promise((resolve) => {
        api.sendMessage({ body: response }, event.threadID, (err) => {
          resolve(!err);
        });
      });
    };

    // ডাউনলোড হেল্পার (প্রয়োজনে)
    const downloadWithTimeout = async (url, outPath, timeoutMs = 10000) => {
      const res = await axios.get(url, { responseType: 'arraybuffer', timeout: timeoutMs, maxContentLength: 25 * 1024 * 1024 });
      fs.writeFileSync(outPath, Buffer.from(res.data));
      return outPath;
    };

    try {
      let sent = false;

      if (fs.existsSync(LOCAL_VIDEO)) {
        // লোকাল ভিডিও থাকলে সেটাই পাঠাও (সবচেয়ে সেফ)
        sent = await sendWithAttachment(LOCAL_VIDEO);
      } else {
        // লোকাল না থাকলে—শুধু তখনই ব্যাকআপ লিংক ট্রাই করো
        try {
          await downloadWithTimeout(FALLBACK_URL, TEMP_VIDEO, 10000);
          sent = await sendWithAttachment(TEMP_VIDEO);
        } catch (e) {
          // ব্যাকআপও ফেল করলে টেক্সট-অনলি
          sent = await sendTextOnly();
        } finally {
          // টেম্প ফাইল থাকলে মুছে দাও
          try { if (fs.existsSync(TEMP_VIDEO)) fs.unlinkSync(TEMP_VIDEO); } catch {}
        }
      }

      // রিঅ্যাকশন
      if (sent) {
        api.setMessageReaction('🫡', event.messageID, () => {}, true);
      }
    } catch (err) {
      // যাই হোক, ফাইনাল ফোলব্যাক—টেক্সট পাঠাও; কোনো স্ট্যাক ট্রেস দেখাবে না ইউজারকে
      await sendTextOnly();
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
