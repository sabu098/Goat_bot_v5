module.exports = {
    config: {
        name: "balance",
        aliases: ["bal"],
        version: "1.8",
        author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎ (Modified by Azad)",
        countDown: 5,
        role: 0,
        description: {
            en: "📊 | View your money, send/request money, and manage debts."
        },
        category: "economy",
        guide: {
            en: "{pn}: view your money 💰" +
                "\n{pn} <@tag>: view someone else's money 💵" +
                "\n{pn} send [amount] @mention: send money 💸" +
                "\n{pn} request [amount] @mention: request money 💵"
        }
    },

    formatMoney(amount) {
        if (!amount) return "0";
        return amount.toLocaleString(); // Always show full number with commas
    },

    onStart: async function ({ message, usersData, event, args, api }) {
        let targetUserID = event.senderID;
        let isSelfCheck = true;

        if (event.messageReply) {
            targetUserID = event.messageReply.senderID;
            isSelfCheck = false;
        } else if (event.mentions && Object.keys(event.mentions).length > 0) {
            targetUserID = Object.keys(event.mentions)[0];
            isSelfCheck = false;
        }

        if (args.length > 0 && ["send", "request"].includes(args[0].toLowerCase())) {
            return await this.handleTransaction({ message, usersData, event, args, api });
        }

        const userData = await usersData.get(targetUserID) || { money: 0, debts: {} };
        const formattedMoney = this.formatMoney(userData.money || 0);

        if (isSelfCheck) {
            return message.reply(`💰 Your balance is ${formattedMoney} $ 🤑`);
        } else {
            return message.reply(`💳 BALANCE INFO 💳\n💰 ${userData.name || "User"} has ${formattedMoney} $ 💸\n💫 Have a good day 💫`);
        }
    },

    handleTransaction: async function ({ message, usersData, event, args, api }) {
        const command = args[0].toLowerCase();
        const amount = parseInt(args[1]);
        const { senderID, threadID, mentions, messageReply } = event;

        if (isNaN(amount) || amount <= 0) {
            return api.sendMessage(`❌ Invalid amount! Usage:\n{pn} send [amount] @mention\n{pn} request [amount] @mention`, threadID);
        }

        let targetID;
        if (messageReply) targetID = messageReply.senderID;
        else if (mentions && Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
        else return api.sendMessage("❌ Mention someone to send/request money!", threadID);

        if (targetID === senderID) return api.sendMessage("❌ You cannot send/request money to yourself!", threadID);

        const senderData = await usersData.get(senderID) || { money: 0, debts: {} };
        const receiverData = await usersData.get(targetID) || { money: 0, debts: {} };

        if (command === "send") {
            // Send money, allow negative balance
            await usersData.set(senderID, { ...senderData, money: senderData.money - amount });
            await usersData.set(targetID, { ...receiverData, money: receiverData.money + amount });

            // Track debts if sender goes negative
            if (senderData.money - amount < 0) {
                const debtAmount = Math.abs(senderData.money - amount);
                senderData.debts = senderData.debts || {};
                senderData.debts[targetID] = (senderData.debts[targetID] || 0) + debtAmount;
                await usersData.set(senderID, senderData);
            }

            const senderName = await usersData.getName(senderID);
            const receiverName = await usersData.getName(targetID);

            api.sendMessage(`✅ ${senderName} sent you ${this.formatMoney(amount)} $ 💸`, targetID);
            return api.sendMessage(`✅ You sent ${this.formatMoney(amount)} $ to ${receiverName}`, threadID);
        }

        if (command === "request") {
            const requesterName = await usersData.getName(senderID);
            api.sendMessage(`📩 ${requesterName} requested ${this.formatMoney(amount)} $ from you.`, targetID);
        }
    }
};
