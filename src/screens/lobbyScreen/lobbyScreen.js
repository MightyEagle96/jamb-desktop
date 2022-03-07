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

PerformNetworkTest();
IsConnctedToServer();
GetCenterDetails();

LookingOut();
ShutDownApplication();
