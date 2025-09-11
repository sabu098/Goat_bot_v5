/**
 * @author NTKhang
 * ! Goat-Bot-V2 main file
 * ! Auto-detects Render environment for 24/7 operation
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");
const http = require("http");

const isWebService = !!process.env.PORT; // true if PORT exists → Web Service

// ===== Function to start the bot =====
function startProject() {
    const child = spawn("node", ["Goat.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (code) => {
        if (code === 2) {
            log.info("Goat-Bot crashed. Restarting...");
            startProject();
        } else if (code !== 0) {
            log.info(`Goat-Bot exited with code ${code}. Restarting...`);
            startProject();
        }
    });
}

// ===== Start the bot =====
startProject();

// ===== Keep process alive for Background Worker =====
if (!isWebService) {
    process.stdin.resume();
    log.info("Running as Background Worker (no web port required).");
} else {
    // ===== Tiny web server for Web Service =====
    const port = process.env.PORT || 10000;

    http.createServer((req, res) => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Goat-Bot is running 24/7!\n");
    }).listen(port, "0.0.0.0", () => {
        console.log(`Web server running on port ${port}`);
        log.info("Running as Web Service on Render.");
    });
}

// ===== Heartbeat log =====
setInterval(() => {
    log.info("Goat-Bot is alive 24/7...");
}, 3600 * 1000);
