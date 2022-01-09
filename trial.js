const seconds = 10;
let count = 0;

const timer = setInterval(() => {
  count++;
  console.log("Hello Jesus");
  if (count === seconds) {
    clearInterval(timer);
  }
}, 1000);
