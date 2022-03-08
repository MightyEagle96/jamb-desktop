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
      console.log(candidate);
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
exports.ServerAdress = "";
exports.GetAddress = () => {
  ipcRenderer.send("channel4", "Server Address");
  ipcRenderer.on("channel5", (e, args) => {
    localStorage.setItem("serverIpAddress", args);
  });
};

exports.SaveAnswers = async (data, serverIpAddress) => {
  data.ipAddress = ip.address();
  const path = `http://${serverIpAddress}:${this.port}/saveCandidateProgress`;

  try {
    await axios.post(path, data);
  } catch (error) {}
};

exports.FinishExamination = (data, serverIpAddress) => {
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
};

exports.GetSavedProgress = async (serverIpAddress, id) => {
  let progress = {};
  const path = `http://${serverIpAddress}:${this.port}/getProgress/${id}`;

  try {
    const res = await axios.get(path);
    progress = res.data.progress;
  } catch (error) {
    if (error && error.response) {
      Swal.fire({ icon: "error", text: error.response.data.message });
    }
  }
  return progress;
};

exports.RandomizeQuestions = (arrayToRandomize) => {
  let randomizedArray = [];
  let array = [];
  for (let i = 0; i < arrayToRandomize.length; i++) {
    let x = Math.floor(Math.random() * arrayToRandomize.length);
    if (array.includes(x)) {
      for (let j = 0; j < arrayToRandomize.length; j++) {
        let y = Math.floor(Math.random() * arrayToRandomize.length);
        if (array.includes(y) === false && array[i] !== y) {
          array.push(y);
          break;
        }
      }
    } else array.push(x);
  }
  if (
    array.length !== arrayToRandomize.length &&
    array.length < arrayToRandomize.length
  ) {
    for (let i = 0; i < arrayToRandomize.length; i++) {
      if (!array.includes(i)) array.push(i);
    }
  }

  // return array;
  for (let i = 0; i < arrayToRandomize.length; i++) {
    randomizedArray.push(arrayToRandomize[array[i]]);
  }

  return randomizedArray;
};

exports.LookingOut = () => {
  // const timer = setInterval(() => {
  //   ipcRenderer.send("focusedState", "what state?");
  //   ipcRenderer.on("sendMessage", (e, args) => {
  //     if (!args.focused) {
  //       clearInterval(timer);
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Stay on Screen",
  //         text: "You are required to remain on this screen. Further attempts to navigate from this screen will result in a shutdown of this application and a termination of your examination.",
  //         confirmButtonText: "Back to screen.",
  //       }).then(() => {
  //         ipcRenderer.send("focusedState", "what state?");
  //         this.LookingOut();
  //       });
  //     }
  //   });
  // }, 1000);
};

const GetGroupedQuestions = (array) => {
  const groupedQuestions = [];

  let currentGroup = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i].startGroup) {
      currentGroup = i;
      groupedQuestions.push({
        started: true,
        startPosition: currentGroup,
        stopped: false,
        stopPosition: 0,
      });
    }
    if (array[i].stopGroup) {
      const index = groupedQuestions.findIndex(
        (c) => c.startPosition === currentGroup
      );
      groupedQuestions[index].stopped = true;
      groupedQuestions[index].stopPosition = i;
    }
  }
  return groupedQuestions;
};

function PopulateGroupQuestions(array, startgroup, stopGroup) {
  const questionArray = [];
  for (let i = startgroup; i < stopGroup + 1; i++) {
    array[i].grouped = true;

    questionArray.push(array[i]);
  }
  return questionArray;
}

const OrganiseArray = (array) => {
  const groupedQuestions = GetGroupedQuestions(array);

  const populatedGroupQuestions = [];
  for (let i = 0; i < groupedQuestions.length; i++) {
    const question = PopulateGroupQuestions(
      array,
      groupedQuestions[i].startPosition,
      groupedQuestions[i].stopPosition
    );
    populatedGroupQuestions.push(question);
  }

  array.forEach((element) => {
    if (!element.grouped) {
      populatedGroupQuestions.push(element);
    }
  });

  return populatedGroupQuestions;
};

exports.FinalOutput = (array) => {
  const finalArray = [];
  const processedArray = this.RandomizeQuestions(OrganiseArray(array));

  for (let i = 0; i < processedArray.length; i++) {
    if (processedArray[i].length) {
      processedArray[i].forEach((element) => {
        finalArray.push(element);
      });
    } else {
      finalArray.push(processedArray[i]);
    }
  }
  return finalArray;
};
