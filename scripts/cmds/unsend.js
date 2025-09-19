module.exports = {
config: {
name: "unsend",
aliases: ["un", "u", "uns", "unsent"],
version: "2.2",
author: "NTKhang | Azad 💥 ",
countDown: 5,
role: 0,
description: {
en: "Delete bot messages (works with prefix + no prefix in group)"
},
category: "box chat",
guide: {
en: "Reply a bot's message and type unsend"
},
usePrefix: false
},

// গালি লিস্ট  
errors: [  
	"তুই কি মায়ের পেট থেকে বুদ্ধি আনতে ভুলে গেছিস?",  
	"এত বেকুব কোথা থেকে আসিস রে?",  
	"গাধা! রিপ্লাই দে আগে, নইলে মাথায় লাথি খাবি!",  
	"তোরে দিয়ে বট চালানো মানে ছাগলকে গিটার ধরানো!",  
	"মাথায় গোবর ভরা নাকি তোর?",  
	"চোখ থাকলে দেখিস না কেন? রিপ্লাই দে!",  
	"তুই এতটা গেঁয়ো কেন হইলি রে?",  
	"বোকাচোদা, আগে রিপ্লাই দে তারপর কমান্ড চালা!",  
	"তোরে দিয়ে কিছু হবে না, হাবলু কাতলা!",  
	"তোরে মারলে ডিম ফোটার আগেই অমলেট হয়ে যাস।"  
],  

// Helper function: বক্সে টেক্সট পাঠানো  
boxText(text) {  
	return `✦━━━━━━━━━━━━━━━━━✦\n${text}\n✦━━━━━━━━━━━━━━━━━✦`;  
},  

// Prefix দিয়ে চালালে  
onStart: async function ({ message, event, api }) {  
	if (!event.messageReply || !event.messageReply.messageID || event.messageReply.senderID != api.getCurrentUserID()) {  
		const arr = module.exports.errors;  
		const randomError = arr[Math.floor(Math.random() * arr.length)];  
		return message.reply(module.exports.boxText(randomError));  
	}  
	await message.unsend(event.messageReply.messageID);  
	return message.reply(module.exports.boxText("✅ Message unsent successfully!"));  
},  

// Prefix ছাড়া শুধু গ্রুপে  
onChat: async function ({ event, message, api }) {  
	if (!event.isGroup) return;  

	const body = event.body?.toLowerCase();  
	if (!body) return;  

	if (["unsend", "un", "u", "uns", "unsent"].includes(body.trim())) {  
		if (!event.messageReply || !event.messageReply.messageID || event.messageReply.senderID != api.getCurrentUserID()) {  
			const arr = module.exports.errors;  
			const randomError = arr[Math.floor(Math.random() * arr.length)];  
			return message.reply(module.exports.boxText(randomError));  
		}  
		await message.unsend(event.messageReply.messageID);  
		return message.reply(module.exports.boxText("✅ Message unsent successfully!"));  
	}  
}

};
