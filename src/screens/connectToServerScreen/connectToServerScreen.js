const { ipcRenderer } = require("electron");
const Swal = require("sweetalert2");
const axios = require("axios").default;
const { port } = require("../../utils/data");

let systemConfiguration;

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
        titleText: "Success",
        text: "Connected to the server",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        connectionStatus.classList.add("text-success");
        connectionStatus.textContent = "CONNECTED";

        document.querySelector(".examinationStatus").style.display = "block";

        //send the serverIp and navigate to the lobby screen
        ipcRenderer.send("channel3", { serverIp, pageToClose: "" });
      });
    }
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "Network Error",
      text: "Cannot connect to the server",
    });
    connectionStatus.textContent = "Not Connected";
  }
}
