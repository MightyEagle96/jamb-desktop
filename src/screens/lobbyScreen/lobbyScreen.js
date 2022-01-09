const { ipcRenderer } = require("electron");
const {
  IsConnctedToServer,
  PerformNetworkTest,
  ShutDownApplication,
} = require("../../utils/connectionStatus");
const { port } = require("../../utils/data");

document.querySelector(".loginPage").addEventListener("click", function () {
  ipcRenderer.send("channel6", "lobbyScreen");
});

ipcRenderer.send("channel4", "Lemme have the server ip address");
ipcRenderer.on("channel5", (e, serverIpAddress) => {
  IsConnctedToServer(serverIpAddress);
  PerformNetworkTest(serverIpAddress);
});

ShutDownApplication();
