const { ipcRenderer } = require("electron");
const { default: Swal } = require("sweetalert2");

const timeLeftDisplay = document.querySelector(".timeLeft");

let hours, minutes, seconds;

function UpdateTimer(duration) {
  const timeOut = setInterval(() => {
    duration -= 1000;
    let hrlLabel = Math.floor(duration / (60 * 60 * 1000));

    let minLabel = Math.floor((duration / (60 * 1000)) % 60);

    let secLabel = (duration % (60 * 1000)) / 1000;

    const hours = hrlLabel > 9 ? hrlLabel : `0${hrlLabel}`;
    const minutes = minLabel > 9 ? minLabel : `0${minLabel}`;
    const seconds = secLabel > 9 ? secLabel : `0${secLabel}`;

    timeLeftDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    if (duration === 0) {
      clearInterval(timeOut);
    }
  }, 1000);
}

ipcRenderer.send("channel8", "Can I have the Ip address");
ipcRenderer.on("channel9", (e, args) => {
  let { duration } = args;
  duration *= 60 * 1000;
  //console.log(args);
  UpdateTimer(duration);
  setTimeout(() => {
    Swal.fire({ icon: "info", titleText: "Network Test Complete" });
  }, duration);
});
