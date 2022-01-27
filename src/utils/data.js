const { default: axios } = require("axios");
const { ipcRenderer } = require("electron");
const { default: Swal } = require("sweetalert2");

exports.port = 5000;

exports.GetQuestions = async (serverIpAddress) => {
  const path = `http://${serverIpAddress}:${this.port}/getQuestions`;
  const res = await axios.get(path);

  return res.data.questions;
};

exports.LoginCandidate = async (serverIpAddress, registrationNumber) => {
  const path = `http://${serverIpAddress}:${this.port}/candidateLogin`;

  try {
    const res = await axios.post(path, { registrationNumber });
    if (res && res.data) {
      const { candidate } = res.data;
      ipcRenderer.send("storeCandidate", candidate);

      ipcRenderer.send("login", "proceedToLogin");
    }
  } catch (error) {
    if (error && error.response) {
      Swal.fire({
        icon: "error",
        title: "Error logging in",
        text: error.response.data.message,
      });
    }
  }
};
