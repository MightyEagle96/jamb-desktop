const { ipcRenderer } = require("electron");
const { default: Swal } = require("sweetalert2");
const {
  IsConnctedToServer,
  PerformNetworkTest,
  ShutDownApplication,
  GetCenterDetails,
} = require("../../utils/connectionStatus");
const { LookingOut } = require("../../utils/data");

document.querySelector(".loginPage").addEventListener("click", function () {
  ipcRenderer.send("channel6", "lobbyScreen");
});

ipcRenderer.send("channel4", "Lemme have the server ip address");
ipcRenderer.on("channel5", (e, serverIpAddress) => {
  IsConnctedToServer(serverIpAddress);
  PerformNetworkTest(serverIpAddress);
  GetCenterDetails(serverIpAddress);
});

LookingOut();
ShutDownApplication();
