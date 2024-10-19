function getRemainingTime() {
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    const remainingMilliseconds = endOfYear - now;
  
    const days = Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMilliseconds % (1000 * 60)) / 1000);
  
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }
  
  document.getElementById("countdown").textContent = getRemainingTime();
  
  setInterval(() => {
    document.getElementById("countdown").textContent = getRemainingTime();
  }, 1000);
  