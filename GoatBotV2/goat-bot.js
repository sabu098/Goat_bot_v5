// ==========================
// Goat Bot v2 - Ultimate Single File
// ==========================

const { login, api } = require('facebook-chat-api');
const fs = require('fs');

// ==========================
// CONFIGURATION
// ==========================
const config = {
    "Language": "en",
    "MainColor": "#9900FF",
    "MainName": "[ cyber-fca ]",
    "AutoUpdate": true,
    "Login2Fa": false,
    "AutoLogin": false,
    "Prefix": ")",
    "AuthString": "",
    "AntiSendAppState": true,
    "HTML": {
        "HTML": true,
        "UserName": "Guest",
        "MusicLink": "https://drive.google.com/uc?id=1zlAALlxk1TnO7jXtEP_O6yvemtzA2ukA&export=download"
    },
    "AntiGetInfo": {
        "AntiGetThreadInfo": true,
        "AntiGetUserInfo": true
    },
    "AntiStuckAndMemoryLeak": {
        "AutoRestart": { "Use": true }
    },
    "Admins": ["YOUR_FB_ID"] // je admin commands use korte parbe
};

// ==========================
// HELPER FUNCTIONS
// ==========================

// Anti-Info Protection
function preventInfo(threadID, userID){
    if(config.AntiGetInfo.AntiGetThreadInfo || config.AntiGetInfo.AntiGetUserInfo){
        console.log(`[ANTI-INFO] Blocked info fetch: thread ${threadID}, user ${userID}`);
        return true;
    }
    return false;
}

// HTML Interface
function showHTML(){
    if(config.HTML.HTML){
        return `
            <h1 style="color:${config.MainColor}">Welcome ${config.HTML.UserName}</h1>
            <audio src="${config.HTML.MusicLink}" autoplay></audio>
        `;
    }
    return `<h1>HTML Disabled</h1>`;
}

// Check if user is admin
function isAdmin(userID){
    return config.Admins.includes(userID);
}

// Memory / Auto Restart
if(config.AntiStuckAndMemoryLeak.AutoRestart.Use){
    setInterval(() => {
        const memUsage = process.memoryUsage().heapUsed / 1024 / 1024;
        if(memUsage > 90){
            console.log('[MEMORY] Limit exceeded! Restarting bot...');
            process.exit(1);
        }
    }, 60000);
}

// ==========================
// COMMANDS
// ==========================
let commands = {
    fun: {
        description: "Just a fun command",
        role: 0,
        execute: ({api, event}) => {
            api.sendMessage("Hello! This is a fun command.", event.threadID);
        }
    },
    admin: {
        description: "Admin command example",
        role: 2,
        execute: ({api, event}) => {
            api.sendMessage("Admin command executed!", event.threadID);
        }
    },
    prefix: {
        description: "Change bot prefix",
        role: 1,
        execute: ({api, event, args}) => {
            if(!isAdmin(event.senderID)) return;
            if(args[0]){
                config.Prefix = args[0];
                api.sendMessage(`Prefix changed to: ${config.Prefix}`, event.threadID);
            } else {
                api.sendMessage(`Current prefix: ${config.Prefix}`, event.threadID);
            }
        }
    },
    unsend: {
        description: "Delete a message (admin only)",
        role: 2,
        execute: ({api, event, args}) => {
            if(!isAdmin(event.senderID)) return;
            if(event.messageID){
                api.unsendMessage(event.messageID, err => {
                    if(err) console.log(err);
                    else api.sendMessage("Message deleted successfully!", event.threadID);
                });
            }
        }
    },
    music: {
        description: "Play a music link",
        role: 0,
        execute: ({api, event, args}) => {
            if(!args[0]) return api.sendMessage("Please provide a music link!", event.threadID);
            api.sendMessage(`🎵 Now playing: ${args[0]}`, event.threadID);
            // Real music streaming integration can be added here
        }
    }
};

// ==========================
// BOT LOGIN & START
// ==========================
const credentials = {
    email: "YOUR_EMAIL",
    password: "YOUR_PASSWORD"
};

login(credentials, (err, apiInstance) => {
    if(err) return console.error(err);

    console.log(`${config.MainName} logged in successfully!`);

    // Listen for messages
    apiInstance.listenMqtt((err, event) => {
        if(err) return console.error(err);

        if(event.type === "message" && event.body){
            const msg = event.body.trim();
            const threadID = event.threadID;
            const senderID = event.senderID;

            // Anti-Info
            preventInfo(threadID, senderID);

            // Command handling
            if(msg.startsWith(config.Prefix)){
                const args = msg.slice(config.Prefix.length).trim().split(/ +/);
                const cmdName = args.shift().toLowerCase();

                if(commands[cmdName]){
                    commands[cmdName].execute({api: apiInstance, event, args});
                }
            }

            // React to emoji to change prefix
            if(event.reactions && Object.keys(event.reactions).length > 0){
                for(const emoji in event.reactions){
                    if(isAdmin(senderID)){
                        config.Prefix = emoji;
                        apiInstance.sendMessage(`Prefix changed to: ${emoji}`, threadID);
                    }
                }
            }
        }
    });
});

// ==========================
// SHOW HTML PAGE
// ==========================
console.log('[HTML PAGE]');
console.log(showHTML());
