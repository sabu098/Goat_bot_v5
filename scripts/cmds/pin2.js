// Author: Azad
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
	config: {
		name: 'Pin2',
		aliases: ["pin2", "pinter"],
		version: '1.3',
		author: 'Azad',
		countDown: 5,
		role: 0,
		category: 'Image Search',
		shortDescription: {
			en: "Search images on Pinterest by keyword",
		},
		longDescription: {
			en: "Fetches images from Pinterest based on a provided keyword.",
		},
		guide: {
			en: "{pn} keyword -number\nExample: {pn} cute -10\n(Default = 5, Max = 20)",
		},
	},

	onStart: async function ({ api, args, event }) {
		const { getPrefix } = global.utils;
		const p = getPrefix(event.threadID);

		let keyword = args.join(' ');
		let numberSearch = 5;

		const match = keyword.match(/(.+?)\s*-?(\d+)?$/);
		if (match) {
			keyword = match[1].trim();
			if (match[2]) numberSearch = parseInt(match[2]);
		}

		if (!keyword) {
			return api.sendMessage(
				`⚠️ Please provide a keyword.\nExample: ${p}pin2 cute anime -10`,
				event.threadID,
				event.messageID
			);
		}

		if (numberSearch > 20) {
			return api.sendMessage(
				"⚠️ Maximum number of search results is 20.",
				event.threadID,
				event.messageID
			);
		}

		try {
			const res = await axios.get(
				`https://api-dien.kira1011.repl.co/pinterest?search=${encodeURIComponent(keyword)}`
			);
			const data = res.data.data;
			if (!data || data.length === 0) {
				return api.sendMessage("❌ No images found.", event.threadID, event.messageID);
			}

			// Ensure tmp folder exists
			const tmpFolder = path.join(__dirname, "tmp");
			await fs.ensureDir(tmpFolder);

			let img = [];
			for (let i = 0; i < numberSearch && i < data.length; i++) {
				const filePath = path.join(tmpFolder, `${i + 1}.jpg`);
				const imgData = (await axios.get(data[i], { responseType: 'arraybuffer' })).data;
				fs.writeFileSync(filePath, imgData);
				img.push(fs.createReadStream(filePath));
			}

			api.sendMessage({
				body: `✅ Found ${img.length} results for: "${keyword}"`,
				attachment: img
			}, event.threadID, async () => {
				// Cleanup all files
				for (let i = 0; i < img.length; i++) {
					const filePath = path.join(tmpFolder, `${i + 1}.jpg`);
					if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
				}
			}, event.messageID);

		} catch (err) {
			console.error(err);
			api.sendMessage("❌ Failed to fetch images. Try again later.", event.threadID, event.messageID);
		}
	}
};
