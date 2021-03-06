const { default: axios } = require("axios");
const { ipcRenderer } = require("electron");
const { default: Swal } = require("sweetalert2");
const ip = require("ip");
const { port, LookingOut } = require("../../utils/data");
const {
  IsConnctedToServer,

  ShutDownApplication,
} = require("../../utils/connectionStatus");

const timeLeftDisplay = document.querySelector(".timeLeft");
const networkResults = document.querySelector(".networkResults");
const networkDisplay = document.querySelector(".networkDisplay");
const networkProgess = document.querySelector(".networkProgress");

document.querySelector(".ipAddress").textContent = ip.address();

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
      document.querySelector(".examinationStatus").textContent =
        "Examination Completed";
      document
        .querySelector(".networkProgress")
        .classList.remove("progress-bar-animated");
      document
        .querySelector(".networkProgress")
        .classList.remove("progress-bar-striped");
      GetResult();
    }
  }, 1000);
}

ipcRenderer.send("channel8", "Can I have the Ip address");
ipcRenderer.on("channel9", (e, args) => {
  testDuration = args.duration;
  let { duration } = args;

  duration *= 60 * 1000;

  UpdateTimer(duration);
  setTimeout(() => {
    Swal.fire({
      icon: "info",
      titleText: "Examination Complete",
      showConfirmButton: false,
      timer: 2000,
    });
    document.querySelector(".lds-ellipsis").style.display = "none";
    document.querySelector(".complete").style.display = "block";
  }, duration);
});
ipcRenderer.send("channel4", "Lemme have the server ip address");
ipcRenderer.on("channel5", (e, serverIpAddress) => {
  IsConnctedToServer(serverIpAddress);
});

function SendPacket() {
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
    UpdateProgress(totalDuration);
  });

  async function SendThePacket() {
    if (packetsSent <= testDuration) packetsSent++;
    await axios.post(path, { ipAddress: ip.address() });
  }

  const timer = setInterval(() => {
    if (timeLeft === 0) {
      clearInterval(timer);
    } else {
      SendThePacket();
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
    sentPacketsDisp.textContent = `${Math.floor(
      (packetsSent / testDuration) * 180
    )}`;
    ackPacketsDisp.textContent = `${Math.floor(
      (res.data.computer.ackPackets / testDuration) * 180
    )}`;
    testResultDisp.textContent = `${Math.ceil(
      (Number(res.data.computer.ackPackets) / Number(packetsSent)) * 100
    )}%`;
  }
  NavigateToLoginPage();
}
function UpdateProgress(totalDuration) {
  let second = 0;

  const timer = setInterval(() => {
    second++;
    const percentage = Math.ceil((second / (totalDuration * 60)) * 100);

    networkProgess.style.width = `${percentage}%`;
    networkProgess.textContent = `${percentage}%`;

    if (timeLeft === 0) {
      clearInterval(timer);
    }
  }, 1000);
}

SendPacket(timeLeft);

document.querySelector(".lobbyButton").addEventListener("click", () => {
  ipcRenderer.send("channel3", { pageToClose: "networkTest" });
});

document.querySelector(".loginButton").addEventListener("click", () => {
  ipcRenderer.send("channel6", "networkTest");
});

function NavigateToLoginPage() {
  setTimeout(() => {
    ipcRenderer.send("channel6", "networkTest");
  }, 3 * 60 * 1000);
}

ShutDownApplication();
LookingOut();
