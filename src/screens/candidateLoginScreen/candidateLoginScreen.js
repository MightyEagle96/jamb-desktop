const { ipcRenderer } = require("electron");
const {
  IsConnctedToServer,
  ShutDownApplication,
} = require("../../utils/connectionStatus");

ipcRenderer.send("channel4", "Lemme have the server ip address");
ipcRenderer.on("channel5", (e, serverIpAddress) => {
  IsConnctedToServer(serverIpAddress);
});

ShutDownApplication();
