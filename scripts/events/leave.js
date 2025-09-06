const { getTime, drive } = global.utils;

module.exports = {
	config: {
		name: "leave",
		version: "1.6",
		author: "NTKhang",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			leaveType1: "tự rời",
			leaveType2: "bị kick",
			defaultLeaveMessage: "{userName} đã {type} khỏi nhóm",
			botKickedAlert: "⚠️ Bot was removed from group: {threadName}! Please check permissions."
		},
		en: {
			session1: "morning",
			session2: "noon",
			session3: "afternoon",
			session4: "evening",
			leaveType1: "left",
			leaveType2: "was kicked from",
			defaultLeaveMessage: "{userName} {type} the group",
			botKickedAlert: "⚠️ Bot was removed from group: {threadName}! Please check permissions."
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		if (event.logMessageType !== "log:unsubscribe") return;

		const botID = api.getCurrentUserID();
		const { leftParticipantFbId } = event.logMessageData;
		const { threadID } = event;
		const threadData = await threadsData.get(threadID);

		// Bot leave ignore & alert
		if (leftParticipantFbId === botID) {
			const alertMessage = getLang("botKickedAlert").replace("{threadName}", threadData.threadName);
			console.warn(alertMessage);
			// Optionally send message to admin or log channel
			return;
		}

		if (!threadData.settings.sendLeaveMessage) return;

		const hours = getTime("HH");
		const threadName = threadData.threadName;
		const userName = await usersData.getName(leftParticipantFbId);

		let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;

		// Prepare message
		const form = {
			mentions: leaveMessage.includes("{userNameTag}") ? [{
				id: leftParticipantFbId,
				tag: userName
			}] : null
		};

		leaveMessage = leaveMessage
			.replace(/\{userName\}|\{userNameTag\}/g, userName)
			.replace(/\{type\}/g, leftParticipantFbId == event.author ? getLang("leaveType1") : getLang("leaveType2"))
			.replace(/\{threadName\}|\{boxName\}/g, threadName)
			.replace(/\{time\}/g, hours)
			.replace(/\{session\}/g, hours <= 10 ? getLang("session1") :
				hours <= 12 ? getLang("session2") :
					hours <= 18 ? getLang("session3") : getLang("session4"));

		form.body = leaveMessage;

		// Attachments
		if (threadData.data.leaveAttachment?.length) {
			const attachments = threadData.data.leaveAttachment.map(file => drive.getFile(file, "stream"));
			form.attachment = (await Promise.allSettled(attachments))
				.filter(r => r.status === "fulfilled")
				.map(r => r.value);
		}

		message.send(form);
	}
};
