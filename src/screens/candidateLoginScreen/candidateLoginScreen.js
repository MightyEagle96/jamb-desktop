const { default: axios } = require("axios");
const { ipcRenderer } = require("electron");
const {
  IsConnctedToServer,
  ShutDownApplication,
} = require("../../utils/connectionStatus");
const { LoginCandidate } = require("../../utils/data");

ipcRenderer.send("channel4", "Lemme have the server ip address");
ipcRenderer.on("channel5", (e, serverIpAddress) => {
  document.querySelector(".login").addEventListener("click", login);

  window.addEventListener("keydown", function (e) {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      login();
    }
  });
  function login() {
    const registrationNumber = document.querySelector(
      ".registrationNumber"
    ).value;

    LoginCandidate(serverIpAddress, registrationNumber);
  }
});
IsConnctedToServer();
ShutDownApplication();
