const fs = require("fs");
const path = require("path");

const targetFile = path.join(__dirname, "node_modules/priyanshu-fca/src/listenMqtt.js");

const patchedCode = `
// ================= Patched listenMqtt.js =================
"use strict";

const mqtt = require("mqtt");
const HttpsProxyAgent = require("https-proxy-agent");

const proxyUrl = process.env.PROXY_URL || null;

function listenMqtt(client, callback) {
  const options = {
    reconnectPeriod: 5000,
    connectTimeout: 30 * 1000,
    wsOptions: {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    },
  };

  if (proxyUrl) {
    console.log("🌐 Using proxy for MQTT:", proxyUrl);
    options.wsOptions.agent = new HttpsProxyAgent(proxyUrl);
  }

  const mqttClient = mqtt.connect("wss://edge-chat.facebook.com/chat", options);

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
    console.log("⏳ Reconnecting in 10s...");
    setTimeout(() => {
      listenMqtt(client, callback);
    }, 10000);
  });

  mqttClient.on("close", () => {
    console.warn("⚠️ MQTT connection closed. Retrying...");
  });

  return mqttClient;
}

function getSeqID(message) {
  try {
    if (!message || typeof message !== "object") {
      console.error("❌ getSeqID: message invalid:", message);
      return null;
    }
    if (!message.seqId) {
      console.warn("⚠️ getSeqID: seqId missing, using fallback 0");
      return 0;
    }
    return message.seqId;
  } catch (err) {
    console.error("❌ getSeqID error:", err);
    return 0;
  }
}

module.exports = listenMqtt;
// ================= End Patch =================
`;

try {
  fs.writeFileSync(targetFile, patchedCode, "utf8");
  console.log("✅ Patched listenMqtt.js applied successfully!");
} catch (err) {
  console.error("❌ Failed to patch listenMqtt.js:", err);
}
