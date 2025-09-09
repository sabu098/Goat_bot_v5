/**

@author Azad

Command: out

Description: Makes the bot leave the group if the owner requests it (with a farewell message).
*/

module.exports = {
config: {
name: "out",
version: "1.1",
author: "Azad",
countDown: 5,
role: 2,
shortDescription: {
en: "Kick 🦶 bot from group (owner only)"
},
longDescription: {
en: "Remove the bot from the group (only owner can use). Sends a message before leaving."
},
category: "owner",
guide: {
en: "just type: out"
}
},

onStart: async function ({ api, message, event }) {
const ownerIDs = ["61578365162382"]; // put your Facebook UID(s) here

if (!ownerIDs.includes(event.senderID)) {
return api.sendMessage(
"Khanakiar chele, amake bahir korar tui ke ? 🤬😤",
event.threadID,
event.messageID
);
}

// Send a farewell message first
api.sendMessage("azad vai bollo left nite tai ami ar thakte parbo na bye Allah Hafez,👋🙂", event.threadID, () => {
// Leave after 2 seconds
setTimeout(() => {
api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
}, 2000);
});

}
};
