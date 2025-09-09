/**
 * @author NTKhang / Azad
 * GoatBot v3 - Advanced Message Handler
 * Features: Queue + Rate-limit + Custom Replies + Block Protection
 * Language: Code in English, Replies in Bangla
 * Path: scripts/cmd/bothandler.js
 */

const bot = global.bot;
let isBlocked = false;
let unblockTime = null;

// -----------------------------
// Message Queue
// -----------------------------
const messageQueue = [];
let processingQueue = false;

// -----------------------------
// Safe send function
// -----------------------------
async function sendMessageSafe(threadID, message) {
    if (isBlocked) {
        console.log(`[BLOCKED] Cannot send message. Will retry later.`);
        return false;
    }

    try {
        await bot.sendMessage(threadID, message);
        console.log(`[SENT] Message to ${threadID}`);
        return true;
    } catch (err) {
        if (err.errorSummary && err.errorSummary.includes("Temporarily Blocked")) {
            console.log("[BLOCKED] Bot is temporarily blocked by Facebook.");
            isBlocked = true;
            unblockTime = Date.now() + 60 * 60 * 1000; // 1 hour block

            setTimeout(() => {
                isBlocked = false;
                unblockTime = null;
                console.log("[UNBLOCKED] Bot can send messages again.");
                processQueue(); // Retry pending messages
            }, 60 * 60 * 1000);
        } else {
            console.error("[ERROR] Failed to send message:", err);
        }
        return false;
    }
}

// -----------------------------
// Queue processor
// -----------------------------
async function processQueue() {
    if (processingQueue || messageQueue.length === 0) return;
    processingQueue = true;

    while (messageQueue.length > 0) {
        const { threadID, message } = messageQueue.shift();
        const sent = await sendMessageSafe(threadID, message);

        if (!sent) {
            // If blocked, push back to queue
            messageQueue.unshift({ threadID, message });
            break;
        }

        // Rate-limit delay: 2–4 seconds
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 2000) + 2000));
    }

    processingQueue = false;
}

// -----------------------------
// Custom Replies (Bangla)
// -----------------------------
const customReplies = {
    "হাই": "হাই! কেমন আছো?",
    "কেমন আছো": "আমি ভালো আছি, তুমি কেমন?",
    "বাই": "বিদায়! আবার দেখা হবে।",
    "ধন্যবাদ": "স্বাগতম! 😊",
    "নিশ্চয়": "ঠিক আছে!",
};

// -----------------------------
// Message listener
// -----------------------------
bot.on("message", async (message) => {
    try {
        if (message.senderID === bot.userID) return; // Skip self messages
        const text = message.body.toLowerCase().trim();

        let reply = customReplies[text] || "দুঃখিত, আমি সেটা বুঝতে পারিনি।";

        // Push message to queue
        messageQueue.push({ threadID: message.threadID, message: reply });
        processQueue();

    } catch (e) {
        console.error("[HANDLER ERROR]", e);
    }
});

console.log("✅ GoatBot v3 Advanced Handler loaded (English code, Bangla replies)!");
