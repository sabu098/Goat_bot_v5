const { GoatWrapper } = require("fca-liane-utils");

const cooldowns = new Map(); // Track user cooldowns

module.exports = {
    config: {
        name: "unsend",
        aliases: ["rmv", "u", "uns"],
        version: "1.4",
        author: "NTKhang | Azad 💥",
        countDown: 5, // Cooldown in seconds
        role: 0,
        description: {
            vi: "Gỡ tin nhắn của bot với phong cách attitude",
            en: "Unsend bot's message with attitude style"
        },
        category: "box chat",
        guide: {
            vi: "reply tin nhắn muốn gỡ của bot và gọi lệnh {pn}",
            en: "reply the message you want to unsend and call the command {pn}"
        }
    },

    langs: {
        vi: {
            syntaxError: [
                "Trả lời tin nhắn của bot đi 😏",
                "Không reply mà cố gắng hả? 🤬",
                "Cẩn thận nhé, reply trước đi 😎",
                "Đừng làm trò, reply tin nhắn đã 😤",
                "Reply đi, đừng làm kẻ ngốc 😹"
            ],
            cooldownMsg: (sec) => `Chill! Chờ ${sec} giây trước khi gỡ tiếp 😹`
        },
        en: {
            syntaxError: [
                "Reply the bot's message first 😏",
                "Trying without replying? 🤬",
                "Careful! Reply first 😎",
                "Don't act smart, reply the message 😤",
                "Reply first, don’t be silly 😹"
            ],
            cooldownMsg: (sec) => `Hold on! Wait ${sec} seconds before unsending again 😹`
        }
    },

    onStart: async function ({ message, event, api, getLang, config }) {
        const userId = event.senderID;
        const now = Date.now();

        // Check cooldown
        if (cooldowns.has(userId)) {
            const remaining = (cooldowns.get(userId) - now) / 1000;
            if (remaining > 0) {
                return await message.reply(getLang("cooldownMsg")(Math.ceil(remaining)));
            }
        }

        // Update cooldown
        cooldowns.set(userId, now + config.countDown * 1000);

        // Check if user replied to a bot message
        if (!event.messageReply || event.messageReply.senderID != api.getCurrentUserID()) {
            const lines = getLang("syntaxError");
            const randomLine = lines[Math.floor(Math.random() * lines.length)];
            return await message.reply(randomLine);
        }

        // Attempt to unsend the message
        try {
            await message.unsend(event.messageReply.messageID);
        } catch {
            return await message.reply("Unable to unsend the message 😾");
        }
    }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
