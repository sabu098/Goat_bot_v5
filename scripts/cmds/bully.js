const userResponses = {};

//  bully messages
const bullyMessages = [
"বোকাচোদা, তোর মাথার দিমাগে মশারও বাসা হয় না!",
"নালায়েক, তুই এমন পাগল যে mirror নিজেই hide করে!",
"গাধাপাগল, তুই typing করলে keyboard নিজেই কান্না করে!",
"মাথাভাঙা, তুই smile করলে antivirus panic করে!",
"চোদাপাগল, তোর IQ এত low যে Google searchও escape করে!",
"বোকাভাই, তুই status দিলে Instagram বলে: ‘Cringe detected!’",
"লোমচাড়া, তুই selfie দিলে camera নিজেই freeze হয়ে যায়!",
"হায়রে বোকা, তুই joke বললে Netflix subscription unsubscribe করে!",
"নালায়েক, তুই approach করলে WiFi signals flee করে!",
"গাধাপাগল, তুই walk করলে GPS panic modeে চলে যায়!",
"বোকাচোদা, তুই look করলে street lights hide হয়ে যায়!",
"চোদারছোকা, তুই laugh করলে neighbours কান ঢাকতে চায়!",
"বোকা ভাই, তুই video call দিলে ফোন instant crash করতে চায়!",
"মাথাভাঙা, তুই typing করলে autocorrect resign করে!",
"নালায়েক, তুই online থাকলেও WiFi ghost modeে চলে যায়!",
"গাধাপাগল, তুই pose দিলে Photoshop refuse করে!",
"বোকাচোদা, তুই কথা বললে Bluetooth panic করে disconnect হয়!",
"চোদাপাগল, তুই voice দিলে Alexa নিজে mute করে!",
"লোমচাড়া, তুই look করলে calculatorও হাসে!",
"বোকাভাই, তুই game খেললে game নিজেই quit করতে চায়!"
];

//  permission message
const noPermissionMessage = "Oi bkcd! Tui admin na, kisu korte parbi na 😡";

module.exports = {
config: {
name: "bully",
category: "roast",
author: "Azad 💥", //author change korle tor marechudi 
version: "0.0.7"
},

onStart: async function ({ api, event, args }) {  
    const botAdmins = ['61578365162382']; //  your UID here  

    const mention = Object.keys(event.mentions)[0];  

    if (!botAdmins.includes(event.senderID)) {  
        return api.sendMessage(noPermissionMessage, event.threadID);  
    }  

    if (!mention) return api.sendMessage("Kake bully korbi? Age mention kor!", event.threadID);  

    // Stop bully session  
    if (args[0]?.toLowerCase() === "off" || event.body?.toLowerCase().includes("bully off")) {  
        if (userResponses[mention]?.active) {  
            userResponses[mention].active = false;  
            return api.sendMessage(`Okay, bully session ${event.mentions[mention]} er jonno OFF kora holo 😎`, event.threadID);  
        } else {  
            return api.sendMessage(`Ei user er kono active bully session nai 🤷‍♂️`, event.threadID);  
        }  
    }  

    // Start bully session  
    await api.sendMessage(`Hey ${event.mentions[mention]}! 😈 Bully mode ON!`, event.threadID);  

    // Initialize user tracking  
    if (!userResponses[mention]) userResponses[mention] = { active: true };  
    else userResponses[mention].active = true;  

    // Listener function  
    const listener = (listenEvent) => {  
        if (!userResponses[mention]?.active) return;  
        if (listenEvent.senderID === mention && listenEvent.body) {  
            const randomIndex = Math.floor(Math.random() * bullyMessages.length);  
            api.sendMessage(bullyMessages[randomIndex], listenEvent.threadID, listenEvent.messageID);  
        }  
    };  

    // Attach listener only once  
    if (!userResponses[mention].listenerAttached) {  
        api.listenMqtt(listener);  
        userResponses[mention].listenerAttached = true;  
    }  

    // Auto stop after 5 minutes  
    setTimeout(() => {  
        if (userResponses[mention]?.active) {  
            userResponses[mention].active = false;  
            api.sendMessage(`5 minutes sesh — ${event.mentions[mention]} ekhon safe! 😎`, event.threadID);  
        }  
    }, 5 * 60 * 1000);  
}

};
