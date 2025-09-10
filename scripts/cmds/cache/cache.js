module.exports = {
    name: "cache",
    description: "View or clear your cache",
    execute: (userId, args, userCache, sendMessage) => {
        const action = args[0]?.toLowerCase();

        if (action === "clear") {
            const userMap = userCache.get(userId);
            if (userMap) {
                for (const data of userMap.values()) clearTimeout(data.timeoutId);
                userCache.delete(userId);
            }
            sendMessage(userId, "🗑️ Your cache has been cleared!");
        } else {
            const userMap = userCache.get(userId);
            if (!userMap || userMap.size === 0) {
                sendMessage(userId, "Your cache is empty.");
            } else {
                const entries = Array.from(userMap.entries())
                    .map(([k, v]) => `${k}: ${JSON.stringify(v.value)}`)
                    .join("\n");
                sendMessage(userId, `📦 Your current cache:\n${entries}`);
            }
        }
    }
};
