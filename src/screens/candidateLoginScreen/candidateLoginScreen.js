const { default: axios } = require("axios");
const { ipcRenderer } = require("electron");
const {
  IsConnctedToServer,
  ShutDownApplication,
} = require("../../utils/connectionStatus");
const { LoginCandidate } = require("../../utils/data");

ipcRenderer.send("channel4", "Lemme have the server ip address");
ipcRenderer.on("channel5", (e, serverIpAddress) => {
  IsConnctedToServer(serverIpAddress);

  document.querySelector(".login").addEventListener("click", login);

  function login() {
    const registrationNumber = document.querySelector(
      ".registrationNumber"
    ).value;

    LoginCandidate(serverIpAddress, registrationNumber);
  }
});

ShutDownApplication();
