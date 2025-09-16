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
    longDescription: "Stylish owner info with video attachment",
    category: "info",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const ownerInfo = {
      name: "✨ your'azad ✨", // fixed syntax
      class: '📚 pori na',
      group: '👥 😽',
      gender: '🚹 𝑴𝑨𝑳𝑬',
      birthday: '🎂 7-03-2007',
      religion: '☪️ 𝑰𝑺𝑳𝑨𝑴',
      hobby: '🎯 𝑭𝒍𝒊𝒓𝒕𝒊𝒏𝒈 😼',
      fb: 'https://www.facebook.com/profile.php?id=61578365162382',
      relationship: '💔 𝑺𝑰𝑵𝑮𝑳𝑬',
      height: '📏 jani na 😴'
    };

    const response = `
✦━━━━━━━━━━━━━━━━━✦
💫 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 💫
✦━━━━━━━━━━━━━━━━━✦
┃ 🔹 𝗡𝗔𝗠𝗘: ${ownerInfo.name}
┃ 🔹 𝗖𝗟𝗔𝗦𝗦: ${ownerInfo.class}
┃ 🔹 𝗚𝗥𝗢𝗨𝗣: ${ownerInfo.group}
┃ 🔹 𝗚𝗘𝗡𝗗𝗘𝗥: ${ownerInfo.gender}
┃ 🔹 𝗕𝗜𝗥𝗧𝗛𝗗𝗔𝗬: ${ownerInfo.birthday}
┃ 🔹 𝗥𝗘𝗟𝗜𝗚𝗜𝗢𝗡: ${ownerInfo.religion}
┃ 🔹 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣: ${ownerInfo.relationship}
┃ 🔹 𝗛𝗢𝗕𝗕𝗬: ${ownerInfo.hobby}
┃ 🔹 𝗛𝗘𝗜𝗚𝗛𝗧: ${ownerInfo.height}
┃ 🔹 𝗙𝗕: ${ownerInfo.fb}
✦━━━━━━━━━━━━━━━━━✦
✨ Bot made with 💖 by Azad ✨
✦━━━━━━━━━━━━━━━━━✦`;

    const ASSETS_DIR = path.join(__dirname, 'assets');
    const CACHE_DIR  = path.join(__dirname, 'cache');
    const LOCAL_VIDEO = path.join(ASSETS_DIR, 'owner.mp4');
    const TEMP_VIDEO  = path.join(CACHE_DIR, 'owner_video.mp4');
    const FALLBACK_URL = 'https://i.imgur.com/9L8GPlu.mp4';

    // Ensure folders exist
    [ASSETS_DIR, CACHE_DIR].forEach(dir => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    const sendWithAttachment = (filePath) => new Promise(resolve => {
      api.sendMessage({ body: response, attachment: fs.createReadStream(filePath) }, event.threadID, err => resolve(!err));
    });

    const sendTextOnly = () => new Promise(resolve => {
      api.sendMessage({ body: response }, event.threadID, err => resolve(!err));
    });

    const downloadVideo = async (url, outPath, timeoutMs = 15000) => {
      try {
        const res = await axios.get(url, { responseType: 'arraybuffer', timeout: timeoutMs, maxContentLength: 25 * 1024 * 1024 });
        fs.writeFileSync(outPath, Buffer.from(res.data));
        return true;
      } catch (err) {
        console.error('Video download failed:', err.message);
        return false;
      }
    };

    try {
      let sent = false;

      // 1️⃣ Try local video first
      if (fs.existsSync(LOCAL_VIDEO)) {
        sent = await sendWithAttachment(LOCAL_VIDEO);
      } else {
        // 2️⃣ Try fallback video
        const downloaded = await downloadVideo(FALLBACK_URL, TEMP_VIDEO);
        if (downloaded) {
          sent = await sendWithAttachment(TEMP_VIDEO);
        } else {
          // 3️⃣ Send text only if all else fails
          sent = await sendTextOnly();
        }
      }

      // Clean temp video
      if (fs.existsSync(TEMP_VIDEO)) fs.unlinkSync(TEMP_VIDEO);

      // React if sent
      if (sent) api.setMessageReaction('🫡', event.messageID, () => {}, true);

    } catch (err) {
      console.error('Owner command failed:', err);
      await sendTextOnly();
    }
  }
};

const wrapper = new GoatWrapper(module.exports, __filename);
wrapper.applyNoPrefix({ allowPrefix: true });
