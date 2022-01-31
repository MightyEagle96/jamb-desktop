const { default: axios } = require("axios");
const { ipcRenderer } = require("electron");
const { default: Swal } = require("sweetalert2");
const ip = require("ip");

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

exports.SaveAnswers = (data) => {
  ipcRenderer.send("channel4", "lemme have the ip address");
  ipcRenderer.on("channel5", async (e, serverIpAddress) => {
    if (serverIpAddress) {
      data.ipAddress = ip.address();
      const path = `http://${serverIpAddress}:${this.port}/saveCandidateProgress`;

      try {
        const res = await axios.post(path, data);
      } catch (error) {}
    }
  });
};

exports.FinishExamination = (data) => {
  ipcRenderer.send("channel4", "lemme have the ip address");
  ipcRenderer.on("channel5", async (e, serverIpAddress) => {
    if (serverIpAddress) {
      const path = `http://${serverIpAddress}:${this.port}/submitExamination`;

      try {
        const res = await axios.post(path, data);

        if (res) {
          Swal.fire({
            icon: "success",
            title: "Examination Completed",
            text: res.data.message,
          }).then(() => {
            ipcRenderer.send("storeCandidate", {});
            ipcRenderer.send("channel6", "close this page");
            ipcRenderer.send("resetQuestions", []);
          });
        }
      } catch (error) {
        if (error && error.response) {
          Swal.fire({ icon: "error", text: error.response.data.message });
        }
      }
    }
  });
};

exports.RandomizeQuestions = (arrayToRandomize, limit) => {
  let randomizedArray = [];
  let array = [];
  for (let i = 0; i < limit; i++) {
    let x = Math.floor(Math.random() * limit);
    if (array.includes(x)) {
      for (let j = 0; j < limit; j++) {
        let y = Math.floor(Math.random() * limit);
        if (array.includes(y) === false && array[i] !== y) {
          array.push(y);
          break;
        }
      }
    } else array.push(x);
  }
  if (array.length !== limit && array.length < limit) {
    for (let i = 0; i < limit; i++) {
      if (!array.includes(i)) array.push(i);
    }
  }

  // return array;
  for (let i = 0; i < arrayToRandomize.length; i++) {
    randomizedArray.push(arrayToRandomize[array[i]]);
  }

  return randomizedArray;
};
