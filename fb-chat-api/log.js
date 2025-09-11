// utils/logger.js
const chalk = require('chalk');

// Generate a random hex color
function randomColor() {
    let color = '';
    for (let i = 0; i < 6; i++) {
        let hex = Math.floor(Math.random() * 16).toString(16);
        color += hex.length === 1 ? '0' + hex : hex;
    }
    return '#' + color;
}

// ------------------------
// General purpose logger
// ------------------------
function log(message, type = 'info') {
    const labelColor = randomColor();
    const msgColor = randomColor();
    switch(type) {
        case 'warn':
            console.log(chalk.bgYellow.black(' ⚠️ WARN ') + ' ' + chalk.hex(msgColor)(message));
            break;
        case 'error':
            console.log(chalk.bgRed.white(' ❌ ERROR ') + ' ' + chalk.hex(msgColor)(message));
            break;
        case 'command':
            console.log(chalk.hex(labelColor)(' » COMMAND « ') + chalk.hex(msgColor)(message));
            break;
        default:
            console.log(chalk.hex(labelColor)(' » INFO « ') + chalk.hex(msgColor)(message));
            break;
    }
}

// Fancy log for startup or system messages
log.fancy = (message) => {
    const color1 = randomColor();
    const color2 = randomColor();
    console.log(
        chalk.hex(color1)(' » LOG « ') +
        chalk.hex(color2)(message)
    );
};

// Command logger (with user & thread info)
log.command = (event, commandName) => {
    const userName = event.senderName || 'Unknown';
    const threadName = event.threadName || 'Unknown Thread';
    const userId = event.senderID || 'Unknown ID';
    const threadID = event.threadID || 'Unknown Thread ID';
    
    const color1 = randomColor();
    const color2 = randomColor();
    const color3 = randomColor();

    console.log(
        chalk.hex(color1)(' » COMMAND « ') +
        chalk.hex(color2)(`${commandName}`) + ' ' +
        chalk.hex(color3)(`by ${userName} (${userId}) in ${threadName} (${threadID})`)
    );
};

module.exports = log;
