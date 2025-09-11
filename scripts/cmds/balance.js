const { createCanvas, loadImage } = require("canvas");
const GIFEncoder = require("gifencoder");
const fs = require("fs");
const os = require("os");

module.exports = {
  config: {
    name: "balance",
    version: "2.8",
    aliases: ["bal", "bl", "mybalcard"],
    author: "Azad",
    role: 0,
    shortDescription: "Optimized animated bank card GIF",
    longDescription: "Shows real avatar, ID, balance, membership, neon glow & sparkles in a GIF.",
    category: "fun",
    guide: "{pn}",
  },

  onStart: async () => { return; },

  onCall: async ({ api, event, usersData }) => {
    const { threadID, messageID, senderID } = event;

    let balance = "$0.00";
    let memberType = "SILVER";

    try {
      if (usersData) {
        if (typeof usersData.getBalance === "function") {
          const bal = await usersData.getBalance(senderID);
          if (bal !== undefined && bal !== null) balance = `$${bal.toFixed(2)}`;
        }
        if (typeof usersData.getMembership === "function") {
          const mem = await usersData.getMembership(senderID);
          if (mem) memberType = mem.toUpperCase();
        }
      }
    } catch {}

    const cardLast4 = Math.floor(1000 + Math.random() * 9000);

    let profilePic;
    try {
      if (usersData && typeof usersData.getAvatarUrl === "function") {
        profilePic = await loadImage(await usersData.getAvatarUrl(senderID));
      }
    } catch {
      try { profilePic = await loadImage("https://i.imgur.com/DefaultAvatar.png"); }
      catch { profilePic = null; }
    }

    try {
      const width = 450;
      const height = 225;
      const encoder = new GIFEncoder(width, height);
      const tempFile = `${os.tmpdir()}/bankcard_${senderID}_${Date.now()}.gif`;
      const stream = fs.createWriteStream(tempFile);
      encoder.createReadStream().pipe(stream);

      encoder.start();
      encoder.setRepeat(0);
      encoder.setQuality(12);

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      const orbitCenter = { x: 375, y: 60 };
      const infoCenter = { x: 110, y: 130 };
      const sparkles = [];
      for (let i = 0; i < 12; i++) {
        sparkles.push({
          radius: Math.random() * 2 + 1,
          angle: Math.random() * Math.PI * 2,
          distance: Math.random() * 40 + 10,
          speed: Math.random() * 0.1 + 0.02,
          center: i % 2 === 0 ? orbitCenter : infoCenter
        });
      }

      const colorCycle = t => {
        const r = Math.floor(127 * Math.sin(0.3 * t) + 128);
        const g = Math.floor(127 * Math.sin(0.3 * t + 2) + 128);
        const b = Math.floor(127 * Math.sin(0.3 * t + 4) + 128);
        return `rgb(${r},${g},${b})`;
      };

      const countdownStart = 5;
      const framesPerNumber = 4;
      const totalFrames = countdownStart * framesPerNumber;
      encoder.setDelay(1000 / framesPerNumber);

      for (let frame = 0; frame < totalFrames; frame++) {
        const glow = 12 + 5 * Math.sin(frame / 3);
        const color = colorCycle(frame);

        // Background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#ff6a6a");
        gradient.addColorStop(1, "#ffb86c");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Neon border
        ctx.shadowColor = color;
        ctx.shadowBlur = glow;
        ctx.lineWidth = 5;
        ctx.strokeStyle = color;
        ctx.strokeRect(5, 5, width - 10, height - 10);

        // Profile pic
        if (profilePic) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(375, 75, 40, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(profilePic, 335, 35, 80, 80);
          ctx.restore();
        }

        // Card title
        ctx.shadowBlur = glow / 2;
        ctx.shadowColor = "#fff";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 25px Sans";
        ctx.fillText("🪙 Nezuko Chan Bank", 15, 40);

        // User info
        ctx.font = "16px Sans";
        ctx.fillText(`ID: ${senderID}`, 15, 100);
        ctx.fillText(`Card: •••• •••• •••• ${cardLast4}`, 15, 125);
        ctx.fillText(`Balance: ${balance}`, 15, 150);
        ctx.fillText(`Status: ${memberType} MEMBER`, 15, 175);

        // Countdown in GIF only
        const number = countdownStart - Math.floor(frame / framesPerNumber);
        const alpha = 1 - (frame % framesPerNumber) / framesPerNumber;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = "#ffff00";
        ctx.shadowBlur = 35;
        ctx.fillStyle = "#fffb00";
        ctx.font = "bold 50px Sans";
        ctx.textAlign = "center";
        ctx.fillText(`${number}`, width / 2, height / 2 + 5);
        ctx.restore();

        // Sparkles
        sparkles.forEach(s => {
          s.angle += s.speed;
          const x = s.center.x + Math.cos(s.angle) * s.distance;
          const y = s.center.y + Math.sin(s.angle) * s.distance;
          ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.8 + 0.2})`;
          ctx.beginPath();
          ctx.arc(x, y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        encoder.addFrame(ctx);
      }

      encoder.finish();
      await new Promise(resolve => stream.on("finish", resolve));
      await api.sendMessage({ attachment: fs.createReadStream(tempFile) }, threadID, messageID);
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

    } catch (err) {
      console.error("GIF generation failed:", err);
      await api.sendMessage("⚠️ Failed to generate your bank card.", threadID);
    }
  },
};
