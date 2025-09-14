module.exports = {
  config: {
    name: "gf",
    version: "1.0",
    author: "Azad",
    countDown: 5,
    role: 0,
    shortDescription: "no prefix",
    longDescription: "no prefix",
    category: "no prefix",
  },

  currentIndex: 0,
  isProcessing: false, // global spam lock
  cooldowns: new Map(), // per-user cooldown

  videos: [
    { body: "「 BESSAR BUKE", url: "https://i.imgur.com/koAQrgI.mp4" },
    { body: "「 NEW VIDEO", url: "https://i.imgur.com/3vnAQeF.mp4" },
    { body: "「 ANOTHER VIDEO", url: "https://i.imgur.com/oQy5s13.mp4" },
    { body: "「 LATEST VIDEO", url: "https://i.imgur.com/x03LaiO.mp4" },
    { body: "「 FINAL VIDEO", url: "https://i.imgur.com/RGONscL.mp4" },
    { body: "「 FINAL FINAL VIDEO", url: "https://i.imgur.com/fCdYbV7.mp4" }
  ],

  onStart: async function() {
    console.log("gf command is ready!");
  },

  onChat: async function({ event, message }) {
    const text = event.body?.trim().toLowerCase();
    const userId = event.senderID;

    if (text === "gf") {
      // Global spam lock
      if (this.isProcessing) return;

      // Per-user cooldown
      const lastUsed = this.cooldowns.get(userId) || 0;
      const now = Date.now();
      if (now - lastUsed < 3000) return; // 3 seconds cooldown

      this.isProcessing = true;
      this.cooldowns.set(userId, now);

      try {
        const video = this.videos[this.currentIndex];

        await message.reply({
          body: video.body,
          attachment: await global.utils.getStreamFromURL(video.url)
        });

        // Move to next video
        this.currentIndex = (this.currentIndex + 1) % this.videos.length;
      } catch (err) {
        console.error("Error sending gf video:", err);
      }

      this.isProcessing = false;
    }
  }
          }
