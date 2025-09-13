// utils/rateLimiter.js
module.exports = function rateLimiter(fn, delay = 2000) {
  let queue = [];
  let isRunning = false;

  async function run() {
    if (isRunning || queue.length === 0) return;
    isRunning = true;

    const { task, resolve, reject } = queue.shift();
    try {
      const result = await fn(task);
      resolve(result);
    } catch (err) {
      reject(err);
    }

    setTimeout(() => {
      isRunning = false;
      run();
    }, delay);
  }

  return function (task) {
    return new Promise((resolve, reject) => {
      queue.push({ task, resolve, reject });
      run();
    });
  };
};
