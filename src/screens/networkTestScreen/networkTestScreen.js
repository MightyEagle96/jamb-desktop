const { ipcRenderer } = require("electron");
const { default: Swal } = require("sweetalert2");

const timeLeftDisplay = document.querySelector(".timeLeft");

let hours, minutes, seconds;

function UpdateTimer(duration) {
  const timeOut = setInterval(() => {
    console.log((duration -= 1000));
    duration;

    timeLeftDisplay.textContent = duration;
    if (duration === 0) {
      clearInterval(timeOut);
    }
  }, 1000);
}

ipcRenderer.send("channel6", "Can I have the Ip address");
ipcRenderer.on("channel5", (e, testData) => {
  let { duration } = testData;
  duration *= 60 * 1000;

  UpdateTimer(duration);
  setTimeout(() => {
    Swal.fire({ icon: "info", titleText: "Network Test Complete" });
  }, duration);
});
