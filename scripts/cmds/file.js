const fs = require('fs');

module.exports = {
	config: {
		name: "file",
		aliases: ["files"],
		version: "1.0",
		author: "Mahir Tahsan",
		countDown: 5,
		role: 0,
		shortDescription: "Send bot script",
		longDescription: "Send bot specified file ",
		category: "𝗢𝗪𝗡𝗘𝗥",
		guide: "{pn} file name. Ex: .{pn} filename"
	},

	onStart: async function ({ message, args, api, event }) {
		// অনুমোদিত UID লিস্ট
		const permission = [
			"61578365162382",
       			"",
			"",
		];

		// চেক করা হচ্ছে ব্যবহারকারী অনুমোদিত কি না
		if (!permission.includes(event.senderID)) {
			return api.sendMessage("উইরা যা মাংগের পুলাহ 😾", event.threadID, event.messageID);
		}

		// ফাইলের নাম যাচাই করা হচ্ছে
		const fileName = args[0];
		if (!fileName) {
			return api.sendMessage("Please provide a file name.", event.threadID, event.messageID);
		}

		// ফাইল পাথ তৈরি করা
		const filePath = __dirname + `/${fileName}.js`;
		if (!fs.existsSync(filePath)) {
			return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
		}

		// ফাইল পাঠানোর কাজ
		const fileContent = fs.readFileSync(filePath, 'utf8');
		api.sendMessage({ body: fileContent }, event.threadID);
	}
};
