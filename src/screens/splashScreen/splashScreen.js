const messages = [
  "Checking Ip Address...",
  "Checking Mac Address...",
  "Checking Operating System...",
  "Checking disk storage...",
  "Checking processor...",
  "Checking system model...",
  "Checking RAM...",
  "Checking IP Address...",
  "Checking DHCP...",
];

const statusMessage = document.querySelector(".statusMessage");
let i = 0;

const timer = setInterval(() => {
  statusMessage.textContent = messages[i];
  i++;
  if (i === messages.length) {
    statusMessage.textContent = "Almost there...";
    clearInterval(timer);
  }
}, 2000);
