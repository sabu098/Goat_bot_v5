const fs = require("fs");
const path = require("path");

const targetFile = path.join(__dirname, "node_modules/priyanshu-fca/src/listenMqtt.js");

// ============================
// PATCHED CODE START
// ============================
const patchedCode = `
"use strict";

const mqtt = require("mqtt");

function listenMqtt(client, callback) {
  const mqttClient = mqtt.connect("wss://edge-chat.facebook.com/chat", {
    wsOptions: {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    },
    reconnectPeriod: 5000,
    connectTimeout: 30 * 1000,
  });

  mqttClient.on("connect", () => {
    console.log("✅ Connected to Facebook MQTT server");
  });

  mqttClient.on("message", (topic, payload) => {
    try {
      let message;
      try {
        message = JSON.parse(payload.toString());
      } catch (e) {
        console.error("❌ Failed to parse MQTT message:", payload.toString());
        return;
      }

      const seqId = getSeqID(message);
      if (seqId !== null) {
        callback(null, message);
      }
    } catch (err) {
      console.error("❌ MQTT onMessage error:", err);
    }
  });

  mqttClient.on("error", (err) => {
    console.error("❌ MQTT error:", err.message || err);
  });

  mqttClient.on("close", () => {
    console.warn("⚠️ MQTT connection closed, reconnecting...");
  });

  return mqttClient;
}

// ------------------------------
// SAFE getSeqID
// ------------------------------
function getSeqID(message) {
  try {
    if (!message || typeof message !== "object") {
      console.error("❌ getSeqID: message invalid:", message);
      return null;
    }
    if (!message.seqId) {
      console.warn("⚠️ getSeqID: seqId missing, using fallback 0");
      return 0; // fallback
    }
    return message.seqId;
  } catch (err) {
    console.error("❌ getSeqID error:", err);
    return 0;
  }
}

module.exports = listenMqtt;
`;
// ============================
// PATCHED CODE END
// ============================

fs.writeFileSync(targetFile, patchedCode, "utf8");
console.log("✅ listenMqtt.js patched successfully!");
