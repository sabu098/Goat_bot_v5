const os = require("os");
const { createCanvas } = require("canvas");
const moment = require("moment");
const si = require("systeminformation");
const checkDiskSpace = require("check-disk-space").default;

module.exports = {
  config: {
    name: "system",
    aliases: ["ut", "sys", "status", "futsys"],
    version: "3.2",
    author: "°Azad°",
    role: 0,
    shortDescription: { en: "system dashboard" },
    longDescription: { en: "CPU, RAM, Disk, Network with 3D-style holographic image" },
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

      const totalMem = os.totalmem() / 1024 / 1024 / 1024;
      const freeMem = os.freemem() / 1024 / 1024 / 1024;
      const usedMem = totalMem - freeMem;
      const ramPercent = (usedMem / totalMem) * 100;

      const cores = os.cpus().length;
      const cpuModel = os.cpus()[0].model;

      // CPU LOAD
      let perCoreLoads = Array(cores).fill(0);
      let avgCpu = 0;
      try {
        const cpus1 = os.cpus();
        await new Promise(r => setTimeout(r, 500));
        const cpus2 = os.cpus();
        const loads = [];
        for (let i = 0; i < cores; i++) {
          const t1 = cpus1[i].times;
          const t2 = cpus2[i].times;
          const idle = t2.idle - t1.idle;
          const total = (t2.user - t1.user) + (t2.nice - t1.nice) + (t2.sys - t1.sys) + (t2.irq - t1.irq) + idle;
          const usage = ((total - idle) / total) * 100;
          loads.push(usage);
        }
        perCoreLoads = loads;
        avgCpu = loads.reduce((a, b) => a + b, 0) / cores;
      } catch(e) {
        console.warn("CPU load calculation failed:", e.message);
      }

      // DISK
      let totalDisk = 0, freeDisk = 0, usedDisk = 0, diskPercent = 0;
      try {
        const diskPath = platform === "win32" ? "C:/" : "/";
        const disk = await checkDiskSpace(diskPath);
        totalDisk = disk.size / 1024 / 1024 / 1024;
        freeDisk = disk.free / 1024 / 1024 / 1024;
        usedDisk = totalDisk - freeDisk;
        diskPercent = (usedDisk / totalDisk) * 100;
      } catch(e) {
        console.warn("Disk info failed:", e.message);
      }

      // NETWORK
      let netUpload = 0, netDownload = 0, netPercent = 0;
      try {
        const netData = await si.networkStats();
        netUpload = netData[0].tx_bytes / 1024 / 1024;
        netDownload = netData[0].rx_bytes / 1024 / 1024;
        netPercent = Math.min(netUpload + netDownload, 100); // normalized
      } catch(e) {
        console.warn("Network info failed:", e.message);
      }

      // CANVAS
      const width = 1100;
      const height = 600 + cores * 60;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#0f2027");
      gradient.addColorStop(0.5, "#203a43");
      gradient.addColorStop(1, "#2c5364");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // UTILITY
      function drawBox(x, y, w, h, radius = 15, glow = false) {
        if (glow) { ctx.shadowColor = "#00ffffaa"; ctx.shadowBlur = 20; } else { ctx.shadowBlur = 0; }
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
        ctx.shadowBlur = 0;
      }

      function drawBar(x, y, w, h, percent) {
        percent = parseFloat(percent) || 0;
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        drawBox(x, y, w, h, 8);
        const barGradient = ctx.createLinearGradient(x, y, x + w, y);
        barGradient.addColorStop(0, "#00ffff");
        barGradient.addColorStop(1, "#0066ff");
        ctx.fillStyle = barGradient;
        drawBox(x, y, w * (percent / 100), h, 8, true);
      }

      // DRAW METRICS
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px Arial";
      ctx.fillText("SYSTEM DASHBOARD", 40, 60);

      ctx.font = "28px Arial";
      ctx.fillText(`CPU: ${cpuModel} (${cores} cores)`, 50, 150);
      drawBar(50, 180, 1000, 30, avgCpu);

      perCoreLoads.forEach((load, i) => {
        ctx.fillText(`Core ${i+1}`, 50, 230 + i*60);
        drawBar(150, 210 + i*60, 900, 30, load);
      });

      ctx.fillText(`RAM: ${usedMem.toFixed(2)}GB / ${totalMem.toFixed(2)}GB`, 50, 240 + cores*60);
      drawBar(50, 270 + cores*60, 1000, 30, ramPercent);

      ctx.fillText(`Disk: ${usedDisk.toFixed(2)}GB / ${totalDisk.toFixed(2)}GB`, 50, 330 + cores*60);
      drawBar(50, 360 + cores*60, 1000, 30, diskPercent);

      ctx.fillText(`Network: Upload ${netUpload.toFixed(2)}MB | Download ${netDownload.toFixed(2)}MB`, 50, 420 + cores*60);
      drawBar(50, 450 + cores*60, 1000, 30, netPercent);

      ctx.fillText(`Uptime: ${uptime} | Ping: ${ping}ms`, 50, 510 + cores*60);

      // SEND IMAGE (works for most bot frameworks)
      const buffer = canvas.toBuffer("image/png");

      // Example: Discord or generic bot
      await message.reply({ files: [buffer] }); 

      // If your bot uses another method, replace the above line with your bot's send function

    } catch (err) {
      console.error("Failed to generate system dashboard:", err);
      await message.reply("⚠️ Failed to generate system dashboard.");
    }
  }
};
