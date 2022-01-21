let timer = 120 * 60 * 1000;

let currentSubject = "";

const timeLeftDisplay = document.querySelector(".timeLeft");

const subjectButtons = [
  { title: "USE OF ENGLISH", slug: "use-of-english" },
  { title: "MATHEMATICS", slug: "mathematics" },
  { title: "PHYSICS", slug: "physics" },
  { title: "CHEMISTRY", slug: "chemistry" },
];

function CreateSubjectButtons() {
  const subjectButtonsDiv = document.querySelector(".subjectButtonsDiv");

  //to initialize the first subject
  document.getElementById("subjectTitle").textContent = subjectButtons[0].title;

  for (let i = 0; i < subjectButtons.length; i++) {
    const newSubjectBtn = document.createElement("button");
    newSubjectBtn.classList = "btn btn-success me-2 ";
    newSubjectBtn.textContent = subjectButtons[i].title;
    newSubjectBtn.addEventListener("click", function (e) {
      document.getElementById("subjectTitle").textContent = e.target.innerText;
      ToggleDivs(subjectButtons[i]);
    });
    subjectButtonsDiv.append(newSubjectBtn);
    CreateSubjectDiv(subjectButtons[i]);
  }
}

CreateSubjectButtons();

function UpdateTimer(duration) {
  const timeOut = setInterval(() => {
    duration -= 1000;
    timeLeft = duration;
    let hrlLabel = Math.floor(duration / (60 * 60 * 1000));
    let minLabel = Math.floor((duration / (60 * 1000)) % 60);
    let secLabel = (duration % (60 * 1000)) / 1000;
    const hours = hrlLabel > 9 ? hrlLabel : `0${hrlLabel}`;
    const minutes = minLabel > 9 ? minLabel : `0${minLabel}`;
    const seconds = secLabel > 9 ? secLabel : `0${secLabel}`;

    timeLeftDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    if (duration === 0) {
      clearInterval(timeOut);
    }
  }, 1000);
}

UpdateTimer(timer);
//1. set the subject title
const btns = document.getElementsByClassName("subjectBtn");

const useOfEnglishQuestions = [];

for (let i = 0; i < 60; i++) {
  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  useOfEnglishQuestions.push(makeid(250));
}

function CreateNumberButtons(subject) {
  const buttonDiv = document.createElement("div");

  if (subject.slug === "use-of-english") {
    for (let i = 0; i < 60; i++) {
      const newContent = document.createElement("button");
      newContent.classList = "btn btn-warning me-2 mb-2";
      newContent.textContent = i + 1;
      newContent.addEventListener("click", function () {
        alert(`Button ${i + 1}`);
      });
      buttonDiv.appendChild(newContent);
    }
  } else {
    for (let i = 0; i < 40; i++) {
      const newContent = document.createElement("button");
      newContent.classList = "btn btn-warning me-2 mb-2";
      newContent.textContent = i + 1;
      newContent.addEventListener("click", function () {
        alert(`Button ${i + 1}`);
      });
      buttonDiv.appendChild(newContent);
    }
  }
  return buttonDiv;
}

//create the subject divs
function CreateSubjectDiv(subject) {
  const subjectDiv = document.createElement("div");
  subjectDiv.classList.add(subject.slug);
  document.querySelector(".subjectDiv").append(subjectDiv);

  const createdDiv = document.querySelector(`.${subject.slug}`);

  const buttonDiv = document.createElement("div");
  buttonDiv.classList = "mt-4 mb-4";
  buttonDiv.append(CreateNumberButtons(subject));

  createdDiv.append(buttonDiv);
  for (let i = 0; i < subjectButtons.length; i++) {
    document.querySelector(`.${subject.slug}`).style.display = "none";
  }
}

//show Calculator
function showCalculator() {
  document.querySelector(".calculatorContainer").style.display = "block";
  document.querySelector(".candidateDetails").style.display = "none";
}

//hide calculator
function hideCalculator() {
  document.querySelector(".calculatorContainer").style.display = "none";
  document.querySelector(".candidateDetails").style.display = "block";
}

function ToggleDivs(subject) {
  for (let i = 0; i < subjectButtons.length; i++) {
    document.querySelector(`.${subjectButtons[i].slug}`).style.display = "none";
  }
  document.querySelector(`.${subject.slug}`).style.display = "block";
}
