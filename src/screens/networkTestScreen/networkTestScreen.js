const { default: axios } = require("axios");
const { ipcRenderer } = require("electron");
const { default: Swal } = require("sweetalert2");
const ip = require("ip");
const { port } = require("../../utils/data");

const timeLeftDisplay = document.querySelector(".timeLeft");

let packetsSent = 0;
let timeLeft = 0;

function UpdateTimer(duration) {
  const timeOut = setInterval(() => {
    duration -= 1000;
    timeLeft = duration;

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

  //SendPacket(duration);
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

function SendPacket(timeLeft) {
  const networkProgess = document.querySelector(".networkProgress");

  let path, totalDuration;
  ipcRenderer.send("channel4", "Server ip address");
  ipcRenderer.on("channel5", (e, serverIpAddress) => {
    path = `http:${serverIpAddress}:${port}/packetsCount`;
  });

  ipcRenderer.send("channel8", "Network test duration");
  ipcRenderer.on("channel9", (e, args) => {
    totalDuration = args.duration;
  });
  const timer = setInterval(() => {
    axios.post(path, { ipAddress: ip.address() }).then(() => {
      packetsSent += 1;

      const percentage = Math.ceil((packetsSent / totalDuration) * 100);
      networkProgess.style.width = `${percentage}%`;
      networkProgess.textContent = `${percentage}%`;
    });

    if (timeLeft === 0) {
      clearInterval(timer);
    }
  }, 60 * 1000);
}

SendPacket(timeLeft);
