// Author: Az ad
// File: cookieRefresh.js

const fs = require("fs");
const path = require("path");

// ===== CONFIG =====
const accountsFile = "./accounts.txt"; // সব cookies এখানে থাকবে, এক লাইনে এক cookie
const retryDelay = 5000; // error হলে retry delay
// ==================

// accounts.txt থেকে cookies load করা
function loadAccounts() {
  if (!fs.existsSync(accountsFile)) fs.writeFileSync(accountsFile, "");
  const raw = fs.readFileSync(accountsFile, "utf-8");
  return raw
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

// accounts.txt update function
function updateAccountCookie(oldCookie, newCookie) {
  let cookies = loadAccounts();
  cookies = cookies.map(c => (c === oldCookie ? newCookie : c));
  fs.writeFileSync(accountsFile, cookies.join("\n"), "utf-8");
  console.log("accounts.txt আপডেট করা হলো ✅");
}

// Cookie refresh simulation
async function refreshCookie(cookie) {
  console.log("Refreshing cookie:", cookie);
  // ==============================
  // এখানে নিজের logic দিয়ে নতুন cookie তৈরি করো
  // উদাহরণ: browser/API থেকে refresh
  // ==============================
  const newCookie = cookie + "_refreshed"; // simulation
  await new Promise(r => setTimeout(r, 2000));
  updateAccountCookie(cookie, newCookie);
  return newCookie;
}

// Main refresh function
async function refreshAllCookies() {
  const cookies = loadAccounts();
  if (cookies.length === 0) {
    console.error("accounts.txt এ কোনো cookie নেই!");
    return;
  }

  for (const cookie of cookies) {
    try {
      console.log("Checking cookie:", cookie);

      // ==============================
      // এখানে check করো cookie valid কিনা
      // যদি expire বা error হয়, throw করবে
      // ==============================

      // simulate random expire
      if (Math.random() < 0.3) throw new Error("Session expired!");

      console.log("Cookie valid ✅");

    } catch (err) {
      console.error("Cookie expired:", cookie);
      const newCookie = await refreshCookie(cookie);
      console.log("Refreshed cookie:", newCookie);
      // delay before next refresh
      await new Promise(r => setTimeout(r, retryDelay));
    }
  }
}

// Start refresh
refreshAllCookies();
