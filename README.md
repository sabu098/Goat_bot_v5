<!-- ──────────────────────────────────────────────── -->
<!--          🌟 GOAT BOT V2 EDIT BY AZAD  🌟        -->
<!-- ──────────────────────────────────────────────── -->

<h1 align="center">🐐 Goat Bot V2 by Azad 👋</h1>
<h3 align="center">✨ Powered by Syndicate Goat Bot | With Nezuko Chan 🥰</h3>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=syndicate-goat-bot-azad&color=blueviolet&style=flat-square&label=Profile+Views" alt="Profile Views"/>
</p>

---

## 👤 About Me
Hi there! I'm **Azad**, a passionate student developer who loves **JavaScript**, **Node.js**, and **bots** 🤖  
Every day, I’m working to become a better version of myself — always improving, always learning 💡  

> 💬 *“Code. Break. Fix. Repeat. That’s how legends are made.”*

---
## 🧠 Top Skills

| Skill | Level |
|--------|--------|
| **JavaScript** | <img src="https://img.shields.io/badge/80%25-🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜-brightgreen?style=for-the-badge"/> |
| **Node.js** | <img src="https://img.shields.io/badge/70%25-🟩🟩🟩🟩🟩🟩🟩⬜⬜⬜-yellowgreen?style=for-the-badge"/> |
| **HTML & CSS** | <img src="https://img.shields.io/badge/90%25-🟩🟩🟩🟩🟩🟩🟩🟩🟩⬜-green?style=for-the-badge"/> |
| **React.js** | <img src="https://img.shields.io/badge/60%25-🟨🟨🟨🟨🟨🟨⬜⬜⬜⬜-gold?style=for-the-badge"/> |
| **Git & GitHub** | <img src="https://img.shields.io/badge/100%25-🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩-brightgreen?style=for-the-badge"/> |

---

## 🚀 Goat Bot V2 Overview

Goat Bot V2 is an advanced Facebook Messenger bot built using **Node.js** —  
fast, powerful, and easy to customize.  

### ✨ Features
- Auto reply & AI chat integration  
- Group management tools  
- Media commands (image, video, music, etc.)  
- Owner/admin utilities  
- Multilingual & customizable  

---

## 📊 GitHub Overview

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=syndicate-goat-bot-azad&show_icons=true&theme=react&cache_seconds=7200&hide_border=true" alt="GitHub Stats" />
</p>

<p align="center">
  <img src="https://streak-stats.demolab.com?user=syndicate-goat-bot-azad&theme=react&hide_border=true" alt="GitHub Streak"/>
</p>

<p align="center">
  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=syndicate-goat-bot-azad&layout=compact&theme=react&hide_border=true" alt="Top Languages"/>
</p>

---

## 🐍 Contribution Graph
> Automatically updates every 24 hours with your latest commits!

![Snake animation](https://raw.githubusercontent.com/syndicate-goat-bot-azad/Goat_bot_v2/output/github-contribution-grid-snake.svg)

---

### ⚙️ How to Enable the Snake Graph

Create a new file in your repo:  
📁 `.github/workflows/snake.yml`

Paste this code inside 👇

```yml
name: Generate Snake

on:
  schedule:
    - cron: "0 0 * * *" # every 24 hours
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: Platane/snk@v3
        with:
          github_user_name: syndicate-goat-bot-azad
          outputs: dist/github-contribution-grid-snake.svg
      - name: Push snake
        uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
