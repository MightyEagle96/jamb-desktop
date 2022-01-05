const { ipcRenderer } = require("electron");
const Swal = require("sweetalert2");
const axios = require("axios").default;
const { port } = require("../../utils/data");

let systemConfiguration;
let serverIpAddress;

//send message to the server
ipcRenderer.send("channel1", "Give me something");

ipcRenderer.on("channel2", (e, args) => {
  systemConfiguration = args;
  document.querySelector(".macAddress").textContent = args.macAddress;
  document.querySelector(".platform").textContent = args.platform;
  document.querySelector(".operatingSystem").textContent = args.operatingSystem;
  document.querySelector(".diskStorage").textContent = args.diskStorage;
  document.querySelector(".processor").textContent = args.processor;
  document.querySelector(".systemModel").textContent = args.systemModel;
  document.querySelector(".ipAddress").textContent = args.ipAddress;
  document.querySelector(".ram").textContent = args.ram;
  document.querySelector(".dhcp").textContent = args.dhcp;
});

const connectBtn = document.querySelector(".connect");

const connectionStatus = document.querySelector(".connectionStatus");

// const networkTestDiv = document.querySelector(".networkTest");

connectBtn.addEventListener("click", TestServer);
async function TestServer() {
  const serverIp = document.getElementById("serverIp").value;

  try {
    const path = `http://${serverIp}:${port}/test`;
    const res = await axios.post(path, systemConfiguration);
    if (res) {
      serverIpAddress = serverIp;

      Swal.fire({
        icon: "success",
        titleText: "COMPUTER CONNECTED",
        showConfirmButton: false,
        timer: 2000,
      });
      connectionStatus.classList.add("text-success");
      connectionStatus.textContent = "CONNECTED";

      document.querySelector(".examinationStatus").style.display = "block";

      ipcRenderer.send("channel3", serverIp);
      IsConnctedToServer();
      GetExaminationStatus();
    }
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      text: "Cannot connect to the server",
    });
    connectionStatus.textContent = "Not Connected";
  }
}

function GetExaminationStatus() {
  const timer = setInterval(async () => {
    try {
      const path = `http://${serverIpAddress}:${port}/examinationStatus`;
      const res = await axios.get(path);
      console.log(res);
      if (
        res.data.beginExam.networkTest ||
        res.data.beginExam.mainExamination
      ) {
        console.log(res.data.beginExam);
        ipcRenderer.send("channel4", res.data.beginExam);
        clearInterval(timer);
      }
    } catch (error) {
      ChangeConnctionStatusText();
    }
  }, 1500);
}

function IsConnctedToServer() {
  setInterval(async () => {
    try {
      const path = `http://${serverIpAddress}:${port}/serverConnected`;
      const res = await axios(path);
      if (res) {
        connectionStatus.classList.add("text-success");
        connectionStatus.textContent = "CONNECTED";
        connectionStatus.classList.remove("text-danger");
      }
    } catch (error) {
      ChangeConnctionStatusText();
    }
  }, 2500);
}

function ChangeConnctionStatusText() {
  connectionStatus.classList.remove("text-success");
  connectionStatus.textContent = "DISCONNECTED";
  connectionStatus.classList.add("text-danger");
}
