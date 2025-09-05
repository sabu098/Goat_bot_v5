// Author: Az ad
"use strict";

const utils = require("../utils");
const log = require("npmlog");

const allowedProperties = {
	attachment: true,
	url: true,
	sticker: true,
	emoji: true,
	emojiSize: true,
	body: true,
	mentions: true,
	location: true
};

function removeSpecialChar(inputString) { 
	if (typeof inputString !== "string") return inputString;

	const buffer = Buffer.from(inputString, 'utf8');
	let filteredBuffer = Buffer.alloc(0);
	for (let i = 0; i < buffer.length; i++) {
		if (buffer[i] === 0xEF && buffer[i + 1] === 0xB8 && buffer[i + 2] === 0x8F) {
			i += 2;
		} else {
			filteredBuffer = Buffer.concat([filteredBuffer, buffer.slice(i, i + 1)]);
		}
	}
	return filteredBuffer.toString('utf8');
}

module.exports = function (defaultFuncs, api, ctx) {

	// Upload attachments safely
	function uploadAttachment(attachments, callback) {
		const uploads = [];

		for (let i = 0; i < attachments.length; i++) {
			if (!utils.isReadableStream(attachments[i])) {
				throw {
					error:
						"Attachment should be a readable stream and not " +
						utils.getType(attachments[i]) +
						"."
				};
			}

			const form = {
				upload_1024: attachments[i],
				voice_clip: "true"
			};

			uploads.push(
				defaultFuncs
					.postFormData(
						"https://upload.facebook.com/ajax/mercury/upload.php",
						ctx.jar,
						form,
						{}
					)
					.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
					.then(function (resData) {
						if (resData.error) throw resData;
						return resData.payload.metadata[0];
					})
			);
		}

		Promise.all(uploads)
			.then(resData => callback(null, resData))
			.catch(err => {
				log.error("uploadAttachment", err);
				return callback(err);
			});
	}

	function getUrl(url, callback) {
		const form = {
			image_height: 960,
			image_width: 960,
			uri: url
		};

		defaultFuncs
			.post(
				"https://www.facebook.com/message_share_attachment/fromURI/",
				ctx.jar,
				form
			)
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(resData => {
				if (resData.error) return callback(resData);
				if (!resData.payload) return callback({ error: "Invalid url" });
				callback(null, resData.payload.share_data.share_params);
			})
			.catch(err => {
				log.error("getUrl", err);
				return callback(err);
			});
	}

	function sendContent(form, threadID, isSingleUser, messageAndOTID, callback) {
		if (utils.getType(threadID) === "Array") {
			for (let i = 0; i < threadID.length; i++) {
				form["specific_to_list[" + i + "]"] = "fbid:" + threadID[i];
			}
			form["specific_to_list[" + threadID.length + "]"] = "fbid:" + (ctx.i_userID || ctx.userID);
			form["client_thread_id"] = "root:" + messageAndOTID;
			log.info("sendMessage", "Sending message to multiple users: " + threadID);
		} else {
			if (isSingleUser) {
				form["specific_to_list[0]"] = "fbid:" + threadID;
				form["specific_to_list[1]"] = "fbid:" + (ctx.i_userID || ctx.userID);
				form["other_user_fbid"] = threadID;
			} else {
				form["thread_fbid"] = threadID;
			}
		}

		if (ctx.globalOptions.pageID) {
			form["author"] = "fbid:" + ctx.globalOptions.pageID;
			form["specific_to_list[1]"] = "fbid:" + ctx.globalOptions.pageID;
			form["creator_info[creatorID]"] = ctx.i_userID || ctx.userID;
			form["creator_info[creatorType]"] = "direct_admin";
			form["creator_info[labelType]"] = "sent_message";
			form["creator_info[pageID]"] = ctx.globalOptions.pageID;
			form["request_user_id"] = ctx.globalOptions.pageID;
			form["creator_info[profileURI]"] =
				"https://www.facebook.com/profile.php?id=" + (ctx.i_userID || ctx.userID);
		}

		defaultFuncs
			.post("https://www.facebook.com/messaging/send/", ctx.jar, form)
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(resData => {
				if (!resData) return callback({ error: "Send message failed." });
				if (resData.error) {
					log.error("sendMessage", resData);
					return callback(resData);
				}
				const messageInfo = resData.payload.actions.reduce((p, v) => ({
					threadID: v.thread_fbid,
					messageID: v.message_id,
					timestamp: v.timestamp
				}) || p, null);
				return callback(null, messageInfo);
			})
			.catch(err => {
				log.error("sendMessage", err);
				if (utils.getType(err) === "Object" && err.error === "Not logged in.") {
					ctx.loggedIn = false;
				}
				return callback(err);
			});
	}

	function send(form, threadID, messageAndOTID, callback, isGroup) {
		if (utils.getType(threadID) === "Array") {
			sendContent(form, threadID, false, messageAndOTID, callback);
		} else {
			if (utils.getType(isGroup) != "Boolean") {
				sendContent(form, threadID, threadID.toString().length < 16, messageAndOTID, callback);
			} else {
				sendContent(form, threadID, !isGroup, messageAndOTID, callback);
			}
		}
	}

	// Handle helpers
	function handleUrl(msg, form, callback, cb) {
		if (msg.url) {
			form["shareable_attachment[share_type]"] = "100";
			getUrl(msg.url, (err, params) => {
				if (err) return callback(err);
				form["shareable_attachment[share_params]"] = params;
				cb();
			});
		} else cb();
	}

	function handleLocation(msg, form, callback, cb) {
		if (msg.location) {
			if (msg.location.latitude == null || msg.location.longitude == null) {
				return callback({ error: "location property needs both latitude and longitude" });
			}
			form["location_attachment[coordinates][latitude]"] = msg.location.latitude;
			form["location_attachment[coordinates][longitude]"] = msg.location.longitude;
			form["location_attachment[is_current_location]"] = !!msg.location.current;
		}
		cb();
	}

	function handleSticker(msg, form, callback, cb) {
		if (msg.sticker) form["sticker_id"] = msg.sticker;
		cb();
	}

	function handleEmoji(msg, form, callback, cb) {
		if (msg.emojiSize != null && msg.emoji == null) return callback({ error: "emoji property is empty" });
		if (msg.emoji) {
			if (!msg.emojiSize) msg.emojiSize = "medium";
			if (!["small","medium","large"].includes(msg.emojiSize)) return callback({ error: "emojiSize property is invalid" });
			if (form["body"] != null && form["body"] != "") return callback({ error: "body is not empty" });
			form["body"] = msg.emoji;
			form["tags[0]"] = "hot_emoji_size:" + msg.emojiSize;
		}
		cb();
	}

	function handleAttachment(msg, form, callback, cb) {
		if (msg.attachment) {
			form["image_ids"] = [];
			form["gif_ids"] = [];
			form["file_ids"] = [];
			form["video_ids"] = [];
			form["audio_ids"] = [];

			if (utils.getType(msg.attachment) !== "Array") msg.attachment = [msg.attachment];

			uploadAttachment(msg.attachment, (err, files) => {
				if (err) return callback(err);
				files.forEach(file => {
					const key = Object.keys(file);
					const type = key[0];
					form[type + "s"].push(file[type]);
				});
				cb();
			});
		} else cb();
	}

	function handleMention(msg, form, callback, cb) {
		if (msg.mentions) {
			for (let i = 0; i < msg.mentions.length; i++) {
				const mention = msg.mentions[i];
				const tag = mention.tag;
				if (typeof tag !== "string") return callback({ error: "Mention tags must be strings." });

				const offset = msg.body.indexOf(tag, mention.fromIndex || 0);
				if (offset < 0) log.warn("handleMention", `Mention for "${tag}" not found in message string.`);
				const id = mention.id || 0;
				form[`profile_xmd[${i}][offset]`] = offset;
				form[`profile_xmd[${i}][length]`] = tag.length;
				form[`profile_xmd[${i}][id]`] = id;
				form[`profile_xmd[${i}][type]`] = "p";
			}
		}
		cb();
	}

	return function sendMessage(msg, threadID, callback, replyToMessage, isGroup) {
		isGroup = isGroup || null;

		let resolveFunc = () => {};
		let rejectFunc = () => {};
		const returnPromise = new Promise((resolve, reject) => {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (!callback) callback = (err, result) => { if(err) rejectFunc(err); else resolveFunc(result); };

		// --- SAFELY HANDLE INPUT ---
		const msgType = utils.getType(msg);
		if (msgType === "Array") msg = { body: msg.join(", ") };
		else if (msgType === "Number") msg = { body: msg.toString() };
		else if (msgType === "String") msg = { body: msg };
		else if (msgType !== "Object") return callback({ error: `Message should be string, number, array, or object, not ${msgType}` });

		if (!msg.body || msg.body.toString().trim() === "") {
			console.warn("Warning: Message body is empty. Sending placeholder to prevent error.");
			msg.body = "[Empty message prevented]";
		}

		if (utils.getType(msg.body) === "String") msg.body = removeSpecialChar(msg.body);

		// --- VALIDATE DISALLOWED PROPERTIES ---
		const disallowedProperties = Object.keys(msg).filter(prop => !allowedProperties[prop]);
		if (disallowedProperties.length > 0) return callback({ error: "Disallowed props: `" + disallowedProperties.join(", ") + "`" });

		const messageAndOTID = utils.generateOfflineThreadingID();
		const form = {
			client: "mercury",
			action_type: "ma-type:user-generated-message",
			author: "fbid:" + (ctx.i_userID || ctx.userID),
			timestamp: Date.now(),
			body: msg.body.toString(),
			offline_threading_id: messageAndOTID,
			message_id: messageAndOTID,
			has_attachment: !!(msg.attachment || msg.url || msg.sticker),
			replied_to_message_id: replyToMessage
		};

		handleLocation(msg, form, callback, () =>
			handleSticker(msg, form, callback, () =>
				handleAttachment(msg, form, callback, () =>
					handleUrl(msg, form, callback, () =>
						handleEmoji(msg, form, callback, () =>
							handleMention(msg, form, callback, () =>
								send(form, threadID, messageAndOTID, callback, isGroup)
							)
						)
					)
				)
			)
		);

		return returnPromise;
	};
};
