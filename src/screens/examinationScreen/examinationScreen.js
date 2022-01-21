let timer = 120 * 60 * 1000;

let currentSubject = "";

const timeLeftDisplay = document.querySelector(".timeLeft");

const subjectButtons = [
  {
    title: "USE OF ENGLISH",
    slug: "use-of-english",
    questions: CreateQuestions("use-of-english"),
  },
  {
    title: "MATHEMATICS",
    slug: "mathematics",
    questions: CreateQuestions("mathematics"),
  },
  {
    title: "GEOGRAPHY",
    slug: "geography",
    questions: CreateQuestions("geography"),
  },
  {
    title: "ECONOMICS",
    slug: "economics",
    questions: CreateQuestions("economics"),
  },
];

function CreateQuestions(subject) {
  const questions = [];

  if (subject === "use-of-english") {
    for (let i = 0; i < 60; i++) {
      function makeid(length) {
        var result = "";
        var characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        return result;
      }
      questions.push({
        subject,
        question: makeid(150),
        optionA: makeid(50),
        optionB: makeid(50),
        optionC: makeid(50),
        optionD: makeid(50),
        correctAns: (function () {
          return this.optionC;
        })(),
      });
    }
  } else {
    for (let i = 0; i < 60; i++) {
      function makeid(length) {
        var result = "";
        var characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        return result;
      }
      questions.push({
        subject,
        question: makeid(150),
        optionA: makeid(50),
        optionB: makeid(50),
        optionC: makeid(50),
        optionD: makeid(50),
        correctAns: (function () {
          return this.optionB;
        })(),
      });
    }
  }
  return questions;
}

function CreateSubjectButtons() {
  const subjectButtonsDiv = document.querySelector(".subjectButtonsDiv");

  //to initialize the first subject
  document.getElementById("subjectTitle").textContent = subjectButtons[0].title;

  //initialize the first questions for each subject

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

//1. set the subject title
const btns = document.getElementsByClassName("subjectBtn");

function CreateNumberButtons(subject) {
  const buttonDiv = document.createElement("div");

  if (subject.slug === "use-of-english") {
    for (let i = 0; i < 60; i++) {
      const newContent = document.createElement("button");
      newContent.classList = "btn btn-warning me-2 mb-2";
      newContent.textContent = i + 1;
      newContent.addEventListener("click", function () {
        //to change the number
        document.querySelector(
          `.${subject.slug}-number`
        ).innerText = `Question ${i + 1}`;

        //to get the question for this number
        const subjectQuestions = subjectButtons.find(
          (c) => c.slug === subject.slug
        ).questions;
        for (let k = 0; k < subjectQuestions.length; k++) {
          document.querySelector(
            `.${subject.slug}-question${k}`
          ).style.display = "none";
        }
        document.querySelector(`.${subject.slug}-question${i}`).style.display =
          "block";
      });
      buttonDiv.appendChild(newContent);
    }
  } else {
    for (let i = 0; i < 40; i++) {
      const newContent = document.createElement("button");
      newContent.classList = "btn btn-warning me-2 mb-2";
      newContent.textContent = i + 1;
      newContent.addEventListener("click", function () {
        //to change the number
        document.querySelector(
          `.${subject.slug}-number`
        ).innerText = `Question ${i + 1}`;

        //to get the question for this number
        const subjectQuestions = subjectButtons.find(
          (c) => c.slug === subject.slug
        ).questions;
        for (let k = 0; k < subjectQuestions.length; k++) {
          document.querySelector(
            `.${subject.slug}-question${k}`
          ).style.display = "none";
        }
        document.querySelector(`.${subject.slug}-question${i}`).style.display =
          "block";
      });
      buttonDiv.appendChild(newContent);
    }
  }
  return buttonDiv;
}

//create the subject divs
function CreateSubjectDiv(subject) {
  const subjectDiv = document.createElement("div");
  const questionNumberDiv = document.createElement("div");
  const questionTextDiv = document.createElement("div");
  const questionContainer = document.createElement("div");

  questionTextDiv.classList = "mt-3 h4";
  questionTextDiv.classList.add(`questionDiv-${subject.slug}`);

  questionNumberDiv.classList = "mt-3 h4";
  questionNumberDiv.classList.add(`${subject.slug}-number`);

  CreateSubjectQuestionsDiv(subject).forEach((sub) =>
    questionContainer.append(sub)
  );

  subjectDiv.classList.add(subject.slug);
  document.querySelector(".subjectDiv").append(subjectDiv);

  const createdDiv = document.querySelector(`.${subject.slug}`);

  const buttonDiv = document.createElement("div");
  buttonDiv.classList = "mt-4 mb-4";
  buttonDiv.append(CreateNumberButtons(subject));

  createdDiv.append(questionNumberDiv);
  createdDiv.append(questionTextDiv);
  createdDiv.append(questionContainer);
  createdDiv.append(buttonDiv);

  for (let i = 0; i < subjectButtons.length; i++) {
    document.querySelector(`.${subject.slug}`).style.display = "none";
  }

  //initialize the first subject
  document.querySelector(`.${[subjectButtons[0].slug]}`).style.display =
    "block";

  document.querySelector(`.${subjectButtons[0].slug}-number`).textContent =
    "Question 1";
}

function ToggleDivs(subject) {
  for (let i = 0; i < subjectButtons.length; i++) {
    document.querySelector(`.${subjectButtons[i].slug}`).style.display = "none";
  }
  document.querySelector(`.${subject.slug}`).style.display = "block";
}

function CreateSubjectQuestionsDiv(subject) {
  const subjectQuestionDivs = [];

  const { questions } = subjectButtons.find((c) => c.slug === subject.slug);

  for (let i = 0; i < questions.length; i++) {
    const newQuestionDiv = document.createElement("div");
    const questionTextDiv = document.createElement("div");
    const optionsDiv = document.createElement("div");

    const optionA = document.createElement("input");
    optionA.type = "radio";

    const optionB = document.createElement("input");
    optionA.type = "radio";
    const optionC = document.createElement("input");
    optionA.type = "radio";
    const optionD = document.createElement("input");
    optionA.type = "radio";

    optionsDiv.classList = "mt-3 mb-3";

    questionTextDiv.textContent = questions[i].question;
    newQuestionDiv.classList = `${subject.slug}-question${i} p-3`;
    newQuestionDiv.append(questionTextDiv);

    subjectQuestionDivs.push(newQuestionDiv);
  }
  return subjectQuestionDivs;
}

function InitializeQuestions() {
  if (subjectButtons) {
    for (let i = 0; i < subjectButtons.length; i++) {
      for (let k = 0; k < subjectButtons[i].questions.length; k++) {
        document.querySelector(
          `.${subjectButtons[i].slug}-question${k}`
        ).style.display = "none";
      }
      document.querySelector(`.${subjectButtons[i].slug}-number`).innerText =
        "Question 1";
      document.querySelector(
        `.${subjectButtons[i].slug}-question${0}`
      ).style.display = "block";
    }
  }
}

CreateSubjectButtons();
UpdateTimer(timer);
InitializeQuestions();

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
