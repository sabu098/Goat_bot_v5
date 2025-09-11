const crypto = require('crypto'); const os = require('os'); const fs = require('fs'); const axios = require('axios'); const assets = require('@miraipr0ject/assets'); const path = require('path');

// Goat Bot V2 commands loader example const commands = {}; const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js')); for (const file of commandFiles) { const command = require(path.join(__dirname, 'commands', file)); commands[command.config.name] = command; }

module.exports = { commands,

/**

YouTube helper */ getYoutube: async function(query, type, format) { try { if (type === 'search') { const youtubeSearch = require('youtube-search-api'); if (!query) throw new Error('Missing search query'); const results = await youtubeSearch.GetListByKeyword(query, false, 6); return results.items; }

if (type === 'getLink') { const response = await axios.post('https://aiovideodl.ml/wp-json/aio-dl/video-data/', { url: https://www.youtube.com/watch?v=${query} }); const data = response.data; if (format === 'video') { return { title: data.title, duration: data.duration, download: { SD: data.medias[1]?.url, HD: data.medias[2]?.url } }; } else if (format === 'audio') { return { title: data.title, duration: data.duration, download: data.medias[3]?.url }; } } } catch (err) { console.error('YouTube Error:', err); return null; } },


/**

Throws an error message in Goat Bot V2 thread */ throwError: function(command, threadID, messageID) { try { const threadSetting = global.data.threadData.get(parseInt(threadID)) || {}; const prefix = threadSetting.PREFIX || global.config.PREFIX; return global.client.api.sendMessage(global.getText('utils', 'throwError', prefix, command), threadID, messageID); } catch (err) { console.error('throwError failed:', err); } },


/**

Cleans Anilist HTML / cleanAnilistHTML: function(text) { return text .replace(/<br\s/?/gi, '\n') .replace(/</?(i|em)>/g, '*') .replace(/</?b>/g, '**') .replace(//g, '||') .replace(/&/g, '&') .replace(/</g, '<') .replace(/>/g, '>') .replace(/"/g, '"') .replace(/'/g, "'"); },


/**

Download file from URL */ downloadFile: async function(url, path) { try { const writer = fs.createWriteStream(path); const response = await axios({ url, method: 'GET', responseType: 'stream' }); response.data.pipe(writer); return new Promise((resolve, reject) => { writer.on('finish', resolve); writer.on('error', reject); }); } catch (err) { console.error('Download Error:', err); throw err; } },


/**

Fetch URL content */ getContent: async function(url) { try { const response = await axios.get(url); return response.data; } catch (err) { console.error('getContent Error:', err); return null; } },


/**

Random string generator */ randomString: function(length) { const chars = 'ABCDKCCzwKyY9rmBJGu48FrkNMro4AWtCkc1flmnopqrstuvwxyz'; let result = ''; for (let i = 0; i < length; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); } return result; },


/**

Assets loader */ assets: { font: async function(name) { if (!assets.font.loaded) await assets.font.load(); return assets.font.get(name); }, image: async function(name) { if (!assets.image.loaded) await assets.image.load(); return assets.image.get(name); }, data: async function(name) { if (!assets.data.loaded) await assets.data.load(); return assets.data.get(name); } },


/**

AES encryption/decryption */ AES: { encrypt: function(key, iv, data) { const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv)); let encrypted = cipher.update(data); encrypted = Buffer.concat([encrypted, cipher.final()]); return encrypted.toString('hex'); }, decrypt: function(key, iv, encrypted) { const buffer = Buffer.from(encrypted, 'hex'); const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv)); let decrypted = decipher.update(buffer); decrypted = Buffer.concat([decrypted, decipher.final()]); return decrypted.toString(); }, makeIv: function() { return crypto.randomBytes(16).toString('hex').slice(0, 16); } },


/**

Get home directory */ homeDir: function() { const type = process.platform; const home = os.homedir() || process.env.HOME; return [home, type]; } };
