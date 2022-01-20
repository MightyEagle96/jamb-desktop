let timer = 120 * 60 * 1000;

const timeLeftDisplay = document.querySelector(".timeLeft");

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

//to load it by default
document.getElementById("subjectTitle").textContent = btns[0].textContent;

//==================

//to set it by the buttons
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function (e) {
    document.getElementById("subjectTitle").textContent = e.target.innerText;
    // CreateButtons(e.target.innerText);
  });
}

const questions = [
  {
    title: "USE OF ENGLISH",
    questions: [
      {
        question: "What is a noun",
        optionA: "A noun is a name of any person",
        optionB: "A book",
        optionC: "A toy",
        optionD: "A story",
        correctAns: "A book",
      },
      {
        question: "What is a noun",
        optionA: "A noun is a name of any person",
        optionB: "A book",
        optionC: "A toy",
        optionD: "A story",
        correctAns: "A book",
      },
      {
        question: "What is a noun",
        optionA: "A noun is a name of any person",
        optionB: "A book",
        optionC: "A toy",
        optionD: "A story",
        correctAns: "A book",
      },
      {
        question: "What is a noun",
        optionA: "A noun is a name of any person",
        optionB: "A book",
        optionC: "A toy",
        optionD: "A story",
        correctAns: "A book",
      },
      {
        question: "What is a noun",
        optionA: "A noun is a name of any person",
        optionB: "A book",
        optionC: "A toy",
        optionD: "A story",
        correctAns: "A book",
      },
    ],
  },
];

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

function CreateButtons(subjectTitle) {
  const answerBtn = document.querySelector(".answerBtn");

  for (let i = 0; i < 60; i++) {
    const newContent = document.createElement("button");
    newContent.classList = "btn btn-warning me-2 mb-2";

    newContent.textContent = i + 1;

    newContent.addEventListener("click", function () {
      alert(`Button ${i + 1}`);
    });

    answerBtn.appendChild(newContent);
  }
}

CreateButtons();
