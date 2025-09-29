const os = require("os");
const si = require("systeminformation");
const moment = require("moment-timezone");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");
const GIFEncoder = require("gifencoder");

module.exports = {
config: {
name: "cpanel",
aliases: ["cstatus", "csyspanel"],
author: "Azad",
version: "1.2",
role: 0,
shortDescription: "Animated neon system panel",
longDescription: "Show system info in animated neon hex style like GIF",
category: "system",
guide: { en: "{pn}" }
},

onStart: async function ({ message }) {
try {
  const date = moment().tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss");

  const formatTime = (s) => {  
      const d = Math.floor(s / (3600*24));  
      s -= d*3600*24;  
      const h = Math.floor(s / 3600);  
      s -= h*3600;  
      const m = Math.floor(s / 60);  
      s -= m*60;  
      return `${d}d ${h}h ${m}m ${Math.floor(s)}s`;  
  };  

  const sysUptime = formatTime(os.uptime());  
  const botUptime = formatTime(process.uptime());  

  const totalMem = os.totalmem() / (1024*1024*1024);  
  const freeMem = os.freemem() / (1024*1024*1024);  
  const usedMem = ((totalMem - freeMem) / totalMem * 100).toFixed(1);  
  const ramUsage = `${usedMem}%`;  

  const cpuLoad = await si.currentLoad();  
  const cpuUsage = cpuLoad.currentLoad.toFixed(1) + "%";  

  const disk = await si.fsSize();  
  const diskUsage = disk.length > 0  
    ? `${((disk[0].used/disk[0].size)*100).toFixed(1)}%`  
    : "N/A";  
  const diskTotal = disk.length > 0  
    ? (disk[0].size/1024/1024/1024).toFixed(1)+" GB"  
    : "N/A";  

  const hostname = os.hostname();  
  const nodeVersion = process.version;  
  const cores = os.cpus().length;  

  // Canvas & GIF setup
  const width = 1000, height = 600;  
  const encoder = new GIFEncoder(width, height);
  const gifPath = path.join(__dirname, `cpanel-${Date.now()}.gif`);
  const gifStream = fs.createWriteStream(gifPath);
  encoder.createReadStream().pipe(gifStream);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(150);
  encoder.setQuality(10);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Draw hex helper (only GIF flicker, no old static glow)
  function drawHex(x, y, r, color, title, value, isPercent=false) {  
      const alpha = 0.6 + Math.random() * 0.4;  
      ctx.beginPath();  
      for (let i = 0; i < 6; i++) {  
        const angle = Math.PI/3 * i - Math.PI/6;  
        const px = x + r * Math.cos(angle);  
        const py = y + r * Math.sin(angle);  
        if (i === 0) ctx.moveTo(px, py);  
        else ctx.lineTo(px, py);  
      }  
      ctx.closePath();  
      ctx.strokeStyle = color;  
      ctx.globalAlpha = alpha;  
      ctx.lineWidth = 4;  
      ctx.shadowColor = color;  
      ctx.shadowBlur = 15 + Math.random()*5; // GIF-style flicker
      ctx.stroke();  
      ctx.globalAlpha = 1;  
      ctx.shadowBlur = 0;  

      // Text inside hex  
      ctx.fillStyle = "#fff";  
      ctx.font = "14px Sans";  
      ctx.textAlign = "center";  
      ctx.fillText(title, x, y - 10);  
      ctx.font = "bold 16px Monospace";  
      ctx.fillText(value, x, y + 20);  

      if (isPercent) {  
        const barWidth = 60;  
        const barHeight = 10;  
        ctx.fillStyle = "#fff";  
        ctx.fillRect(x - barWidth/2, y + 35, barWidth, barHeight);  
        ctx.fillStyle = color;  
        const percent = parseFloat(value.replace('%','')) || 0;
        ctx.fillRect(x - barWidth/2, y + 35, barWidth * (percent/100), barHeight);  
      }  
  }  

  // Generate frames for GIF
  const frames = 8;
  for (let f = 0; f < frames; f++) {
      // Background
      ctx.fillStyle = "#0b0b2a";  
      ctx.fillRect(0, 0, width, height);  

      // Stars
      for (let i = 0; i < 120; i++) {  
        ctx.beginPath();  
        ctx.globalAlpha = Math.random() * 0.8;  
        ctx.fillStyle = "white";  
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI*2);  
        ctx.fill();  
      }  
      ctx.globalAlpha = 1;  

      // Header
      ctx.shadowColor = "#ff3f5e";  
      ctx.shadowBlur = 20;  
      ctx.fillStyle = "#fff";  
      ctx.font = "28px Sans";  
      ctx.textAlign = "center";  
      ctx.fillText("🐤 Nezuko System Panel 🦆", width / 2, 50);  
      ctx.shadowBlur = 0;  

      ctx.font = "16px Monospace";  
      ctx.fillText(`OS: ${os.platform()} (${os.arch()})`, 120, height - 40);  
      ctx.fillText(date, width - 150, height - 40);  

      // Draw hexes
      drawHex(200, 200, 80, "#f43f5e", "TOTAL RAM", `${totalMem.toFixed(1)} GB`);  
      drawHex(350, 200, 80, "#22d3ee", "SYS UPTIME", sysUptime);  
      drawHex(500, 200, 80, "#3b82f6", "BOT UPTIME", botUptime);  
      drawHex(650, 200, 80, "#d946ef", "CPU CORES", `${cores}`);  
      drawHex(800, 200, 80, "#f59e0b", "CPU LOAD", cpuUsage, true);  

      drawHex(275, 350, 80, "#facc15", "RAM USAGE", ramUsage, true);  
      drawHex(425, 350, 80, "#0ea5e9", "TOTAL DISK", diskTotal);  
      drawHex(575, 350, 80, "#4ade80", "DISK USAGE", diskUsage, true);  
      drawHex(725, 350, 80, "#a78bfa", "NODE.JS", nodeVersion);  

      encoder.addFrame(ctx);
  }

  encoder.finish();

  gifStream.on("finish", () => {
      message.reply({ attachment: fs.createReadStream(gifPath) });
  });

} catch (err) {
  console.error(err);
  message.reply("❌ | Failed to generate animated system panel!");
}

}
};
