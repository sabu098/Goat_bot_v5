const axios = require("axios");

module.exports = {
  config: {
    name: "niji",
    version: "1.2",
    author: "Eijah Noah & Azad",
    countDown: 5,
    role: 0,
    longDescription: {
      vi: "",
      en: "Get images from text.",
    },
    category: "araf",
    guide: {
      vi: "",
      en: "Usage Example:\n /niji cute girl -- ar 4:3",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      // Combine user prompt
      const text = args.join(" ");
      if (!text) return message.reply("Please provide a prompt.");

      // Split prompt and ratio
      let [prompt, ratio] = text.includes("--")
        ? text.split("--", 2).map(s => s.trim())
        : [text, "1:1"];

      // Validate ratio
      const allowedRatios = ["1:1", "4:3", "3:4", "16:9", "9:16"];
      if (!allowedRatios.includes(ratio)) {
        return message.reply(
          `Invalid ratio provided. Allowed ratios are: ${allowedRatios.join(", ")}. Using default ratio 1:1.`
        );
      }

      // Set waiting reaction
      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      const waitingMessage = await message.reply("✅ | Creating your imagination...");

      // Build API URL
      const apiUrl = `https://api.vyturex.com/niji?text=${encodeURIComponent(prompt)}&ar=${encodeURIComponent(ratio)}`;

      // Fetch data from API
      const response = await axios.get(apiUrl);

      // Check if API returned image URL
      if (!response.data?.imageUrl) {
        await api.unsendMessage(waitingMessage.messageID).catch(() => {});
        return message.reply("No image returned from API.");
      }

      const img = response.data.imageUrl;

      // Load image stream
      let imageStream;
      try {
        imageStream = await global.utils.getStreamFromURL(img);
      } catch {
        await api.unsendMessage(waitingMessage.messageID).catch(() => {});
        return message.reply("Failed to load the image.");
      }

      // Send image in message
      await message.reply({ attachment: imageStream });

      // Set success reaction
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      // Delete waiting message
      await api.unsendMessage(waitingMessage.messageID).catch(() => {});
    } catch (error) {
      console.log(error.response?.data || error.message);
      message.reply("Failed to create image.");
    }
  },
};
