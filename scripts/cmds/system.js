const fs = require("fs");
const os = require("os");
const moment = require("moment");
const { createCanvas } = require("canvas");
const si = require("systeminformation");
const checkDiskSpace = require("check-disk-space").default;
const readline = require("readline");

// Safe fallback for environments without clearLine / cursorTo
if (!process.stderr.clearLine) {
  process.stderr.clearLine = (dir = 0) => {
    if (readline.clearLine) readline.clearLine(process.stderr, dir);
  };
}

if (!process.stderr.cursorTo) {
  process.stderr.cursorTo = (x = 0, y = 0) => {
    if (readline.cursorTo) readline.cursorTo(process.stderr, x, y);
  };
}

module.exports = {
  config: {
    name: "system",
    aliases: ["ut", "sys", "status"],
    version: "2.2",
    author: "°Azad°",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Enhanced visual system dashboard image" },
    longDescription: { en: "CPU, RAM, Disk, Network with dynamic color bars in a stylish image" },
    category: "system",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message }) {
    try {
      const start = Date.now();

      // ---------------- SYSTEM METRICS ----------------
      const uptimeDur = moment.duration(process.uptime(), "seconds");
      const uptime = `${uptimeDur.days()}d ${uptimeDur.hours()}h ${uptimeDur.minutes()}m ${uptimeDur.seconds()}s`;
      const platform = os.platform();
      const arch = os.arch();
      const ping = Date.now() - start;

      // RAM
      const totalMem = os.totalmem() / 1024 / 1024 / 1024;
      const freeMem = os.freemem() / 1024 / 1024 / 1024;
      const usedMem = totalMem - freeMem;
      const ramPercent = ((usedMem / totalMem) * 100).toFixed(2);

      // CPU
      const cpuInfo = await si.cpu();
      const cpuLoad = await si.currentLoad();
      const cores = cpuInfo.cores;
      const cpuModel = cpuInfo.manufacturer + " " + cpuInfo.brand;
      const perCoreLoads = cpuLoad.cpus.map(c => c.load.toFixed(2));
      const avgCpu = cpuLoad.avgload.toFixed(2);

      // Disk
      const diskPath = platform === "win32" ? "C:" : "/";
      const disk = await checkDiskSpace(diskPath);
      const totalDisk = disk.size / 1024 / 1024 / 1024;
      const freeDisk = disk.free / 1024 / 1024 / 1024;
      const usedDisk = totalDisk - freeDisk;
      const diskPercent = ((usedDisk / totalDisk) * 100).toFixed(2);

      // Network
      const netData1 = await si.networkStats();
      await new Promise(r => setTimeout(r, 1000)); // 1s interval for delta
      const netData2 = await si.networkStats();

      const netUpload = ((netData2[0].tx_bytes - netData1[0].tx_bytes) / 1024 / 1024).toFixed(2);
      const netDownload = ((netData2[0].rx_bytes - netData1[0].rx_bytes) / 1024 / 1024).toFixed(2);
      const netPercent = Math.min(((parseFloat(netUpload) + parseFloat(netDownload)) / 10) * 10, 100); // arbitrary cap 100%

      // ---------------- IMAGE ----------------
      const width = 1000;
      const height = 950 + cores * 30;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Gradient Background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#0f2027");
      gradient.addColorStop(0.5, "#203a43");
      gradient.addColorStop(1, "#2c5364");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Utility functions
      function drawBox(x, y, w, h, radius = 15) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
      }

      function drawBar(x, y, w, h, percent) {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        drawBox(x, y, w, h, 8);

        const barGradient = ctx.createLinearGradient(x, y, x + w, y);
        if (percent < 50) barGradient.addColorStop(0, "#4dff88");
        else if (percent < 80) barGradient.addColorStop(0, "#ffa500");
        else barGradient.addColorStop(0, "#ff4d4d");
        barGradient.addColorStop(1, "#ffffff33");

        ctx.fillStyle = barGradient;
        drawBox(x, y, (w * percent) / 100, h, 8);
      }

      // Text Settings
      ctx.fillStyle = "#ffffff";
      ctx.font = "30px monospace";
      ctx.fillText("🖥️ GOAT BOT SYSTEM STATUS 🐐", 50, 60);
      ctx.font = "20px monospace";

      let yPos = 110;

      // ---------------- Uptime + Ping ----------------
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      drawBox(40, yPos - 25, width - 80, 80, 15);
      ctx.fillStyle = "#fff";
      ctx.fillText(`⏱️ Uptime : ${uptime}`, 60, yPos);
      ctx.fillText(`📶 Ping   : ${ping}ms`, 60, yPos + 30);
      yPos += 120;

      // ---------------- CPU ----------------
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      drawBox(40, yPos - 25, width - 80, 60 + cores * 30, 15);
      ctx.fillStyle = "#fff";
      ctx.fillText(`⚙️ CPU Model : ${cpuModel}`, 60, yPos);
      ctx.fillText(`💻 Cores     : ${cores}`, 60, yPos + 30);
      ctx.fillText(`📊 Avg CPU Usage : ${avgCpu}%`, 60, yPos + 60);

      let barY = yPos + 90;
      for (let i = 0; i < cores; i++) {
        ctx.fillText(`Core ${i + 1}: ${perCoreLoads[i]}%`, 80, barY);
        drawBar(250, barY - 15, 650, 20, perCoreLoads[i]);
        barY += 30;
      }
      yPos = barY + 40;

      // ---------------- RAM ----------------
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      drawBox(40, yPos - 25, width - 80, 100, 15);
      ctx.fillStyle = "#fff";
      ctx.fillText(`🧠 RAM Used  : ${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB`, 60, yPos);
      ctx.fillText(`📂 RAM Free  : ${freeMem.toFixed(2)} GB`, 60, yPos + 30);
      ctx.fillText(`Usage: ${ramPercent}%`, 60, yPos + 60);
      drawBar(250, yPos + 45, 650, 20, ramPercent);
      yPos += 140;

      // ---------------- Disk ----------------
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      drawBox(40, yPos - 25, width - 80, 100, 15);
      ctx.fillStyle = "#fff";
      ctx.fillText(`💽 Disk Used : ${usedDisk.toFixed(2)} GB / ${totalDisk.toFixed(2)} GB`, 60, yPos);
      ctx.fillText(`Free       : ${freeDisk.toFixed(2)} GB`, 60, yPos + 30);
      ctx.fillText(`Usage: ${diskPercent}%`, 60, yPos + 60);
      drawBar(250, yPos + 45, 650, 20, diskPercent);
      yPos += 140;

      // ---------------- Network ----------------
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      drawBox(40, yPos - 25, width - 80, 100, 15);
      ctx.fillStyle = "#fff";
      ctx.fillText(`🌐 Upload   : ${netUpload} MB/s`, 60, yPos);
      ctx.fillText(`🌐 Download : ${netDownload} MB/s`, 60, yPos + 30);
      drawBar(250, yPos + 45, 650, 20, netPercent);
      yPos += 140;

      // ---------------- Footer ----------------
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      drawBox(40, yPos - 25, width - 80, 80, 15);
      ctx.fillStyle = "#fff";
      ctx.fillText(`📦 Platform     : ${platform}`, 60, yPos);
      ctx.fillText(`🧬 Architecture : ${arch}`, 60, yPos + 30);
      ctx.fillText(`✅ Bot Status   : ONLINE`, 60, yPos + 60);

      // Save Image with unique name
      const filePath = `./system_dashboard_${Date.now()}.png`;
      fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

      return message.reply({ attachment: fs.createReadStream(filePath) });

    } catch (err) {
      console.error("Dashboard error:", err);
      return message.reply("❌ Failed to generate system dashboard.");
    }
  }
};
