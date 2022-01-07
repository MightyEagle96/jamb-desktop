const { default: axios } = require("axios");
const { ipcRenderer } = require("electron");
const { default: Swal } = require("sweetalert2");
const ip = require("ip");
const { port } = require("../../utils/data");

const timeLeftDisplay = document.querySelector(".timeLeft");
const networkResults = document.querySelector(".networkResults");
const networkDisplay = document.querySelector(".networkDisplay");

const testDurationDisp = document.querySelector(".testDuration");
const sentPacketsDisp = document.querySelector(".sentPackets");
const ackPacketsDisp = document.querySelector(".ackPackets");

let packetsSent = 0;
let timeLeft = 0;
let testDuration = 0;
let serverIpAddress = "";

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
      GetResult();
    }
  }, 1000);

  //SendPacket(duration);
}

ipcRenderer.send("channel8", "Can I have the Ip address");
ipcRenderer.on("channel9", (e, args) => {
  testDuration = args.duration;
  let { duration } = args;

  duration *= 60 * 1000;
  //console.log(args);
  UpdateTimer(duration);
  setTimeout(() => {
    Swal.fire({
      icon: "info",
      titleText: "Network Test Complete",
      showConfirmButton: false,
      timer: 2000,
    });
  }, duration);
});

function SendPacket() {
  const networkProgess = document.querySelector(".networkProgress");

  let path, totalDuration;
  ipcRenderer.send("channel4", "Server ip address");
  ipcRenderer.on("channel5", (e, args) => {
    serverIpAddress = args;
    path = `http:${serverIpAddress}:${port}/packetsCount`;
  });

  ipcRenderer.send("channel8", "Network test duration");
  ipcRenderer.on("channel9", (e, args) => {
    networkDisplay.style.display = "block";
    totalDuration = args.duration;
  });

  async function SendThePacket() {
    packetsSent += 1;
    const res = await axios.post(path, { ipAddress: ip.address() });
    if (res) {
      const percentage = Math.ceil((packetsSent / totalDuration) * 100);
      networkProgess.style.width = `${percentage}%`;
      networkProgess.textContent = `${percentage}%`;
    }
  }
  const timer = setInterval(() => {
    SendThePacket();

    if (timeLeft === 0) {
      clearInterval(timer);
    }
  }, 60000);
}

async function GetResult() {
  const testDurationDisp = document.querySelector(".testDuration");
  const sentPacketsDisp = document.querySelector(".sentPackets");
  const ackPacketsDisp = document.querySelector(".ackPackets");
  const testResultDisp = document.querySelector(".testResult");

  networkResults.style.display = "block";
  const path = `http:${serverIpAddress}:${port}/getMyTestResult`;
  const res = await axios.post(path, { ipAddress: ip.address() });
  if (res) {
    testDurationDisp.textContent = `${testDuration} ${
      testDuration > 1 ? "Minutes" : "Minute"
    }`;
    sentPacketsDisp.textContent = packetsSent;
    ackPacketsDisp.textContent = res.data.computer.ackPackets;
    testResultDisp.textContent = `${Math.ceil(
      (Number(res.data.computer.ackPackets) / Number(packetsSent)) * 100
    )}%`;
  }
}

SendPacket(timeLeft);
