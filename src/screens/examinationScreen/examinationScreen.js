const { ipcRenderer } = require("electron");
const { default: Swal } = require("sweetalert2");

const fs = require("fs");

const {
  SaveAnswers,
  FinishExamination,
  LookingOut,
  GetSavedProgress,
} = require("../../utils/data");

let ServerIpAddress = "";

function GetServerAddress() {
  const readStream = fs.createReadStream("./serverAddress.txt");
  readStream.on("data", (data) => {
    ServerIpAddress = JSON.parse(data).serverIpAddress;
  });
}
GetServerAddress();

let candidateAnswers = [];
let candidateData = {};
let timer = 0;
let timeLeft = 0;
let hasSubmitted = false;

LookingOut();

function UpdateTimer(duration) {
  const timeLeftDisplay = document.querySelector(".timeLeft");
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
      Swal.fire({
        icon: "info",
        title: "Your time is up",
        text: "Your examination progress have been saved and your result uploaded. Kindly exit the examination hall",
      }).then(() => {
        hasSubmitted = true;

        FinishExamination({ candidateData, hasSubmitted }, ServerIpAddress);
      });
    }
  }, 1000);
}
ipcRenderer.send("fetchCandidate", "lemme have the candidate");
ipcRenderer.on("candidate", (e, candidate) => {
  candidateData = candidate;
  document.querySelector(".firstName").textContent = candidate.firstName;
  document.querySelector(".lastName").textContent = candidate.lastName;
  document.querySelector(".registrationNumber").textContent =
    candidate.registrationNumber.toUpperCase();

  document.querySelector(".seatNumber").textContent = candidate.seatNumber;
});

ipcRenderer.send("getQuestions", "Lemme have the questions");
ipcRenderer.on("sendQuestions", (e, questions) => {
  const subjectButtons = questions;
  timer = 120 * 60 * 1000;

  function CreateSubjectButtons() {
    const subjectButtonsDiv = document.querySelector(".subjectButtonsDiv");
    //to initialize the first subject
    document.getElementById("subjectTitle").textContent =
      subjectButtons[0].subject.title;
    //initialize the first questions for each subject
    for (let i = 0; i < subjectButtons.length; i++) {
      const newSubjectBtn = document.createElement("button");
      newSubjectBtn.classList =
        i === 0
          ? `btn btn-success me-2 subBtn_${subjectButtons[i].subject.slug}`
          : `btn btn-danger me-2 subBtn_${subjectButtons[i].subject.slug}`;
      newSubjectBtn.textContent = subjectButtons[i].subject.title;
      newSubjectBtn.addEventListener("click", function (e) {
        document.getElementById("subjectTitle").textContent =
          e.target.innerText;
        ToggleDivs(subjectButtons[i]);

        for (let k = 0; k < subjectButtons.length; k++) {
          document
            .querySelector(`.subBtn_${subjectButtons[k].subject.slug}`)
            .classList.replace("btn-success", "btn-danger");
        }

        if (
          document.getElementById("subjectTitle").textContent ===
          newSubjectBtn.textContent
        ) {
          newSubjectBtn.classList.replace("btn-danger", "btn-success");
        }
      });
      subjectButtonsDiv.append(newSubjectBtn);
      CreateSubjectDiv(subjectButtons[i]);
    }
  }

  CreateSubjectButtons();

  //1. set the subject title

  function CreateNumberButtons(subject) {
    const buttonDiv = document.createElement("div");
    for (let i = 0; i < subject.questions.length; i++) {
      const newButton = document.createElement("button");
      newButton.classList = `btn btn-warning me-2 mb-2 ${subject.subject.slug}_${subject.questions[i]._id}`;
      newButton.textContent = i + 1;

      if (i == 0) {
        newButton.classList.replace("btn-warning", "btn-danger");
      }
      newButton.addEventListener("click", function () {
        //to change the color

        for (let k = 0; k < subject.questions.length; k++) {
          document
            .querySelector(
              `.${subject.subject.slug}_${subject.questions[k]._id}`
            )
            .classList.replace("btn-danger", "btn-warning");
        }

        document
          .querySelector(`.${subject.subject.slug}_${subject.questions[i]._id}`)
          .classList.replace("btn-warning", "btn-danger");

        //to change the number
        document.querySelector(
          `.${subject.subject.slug}_number`
        ).innerText = `Question ${i + 1}`;

        //to get the question for this number
        const subjectQuestions = subjectButtons.find(
          (c) => c.subject.slug === subject.subject.slug
        ).questions;
        for (let k = 0; k < subjectQuestions.length; k++) {
          document.querySelector(
            `.${subject.subject.slug}_question${k}`
          ).style.display = "none";
        }
        document.querySelector(
          `.${subject.subject.slug}_question${i}`
        ).style.display = "block";
      });
      buttonDiv.appendChild(newButton);
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
    questionTextDiv.classList.add(`questionDiv_${subject.slug}`);
    questionNumberDiv.classList = "mt-3 h4";
    questionNumberDiv.classList.add(`${subject.subject.slug}_number`);

    CreateSubjectQuestionsDiv(subject).forEach((sub) =>
      questionContainer.append(sub)
    );
    subjectDiv.classList.add(subject.subject.slug);
    document.querySelector(".subjectDiv").append(subjectDiv);
    const createdDiv = document.querySelector(`.${subject.subject.slug}`);
    const buttonDiv = document.createElement("div");
    buttonDiv.classList = "mt-4 mb-4";
    buttonDiv.append(CreateNumberButtons(subject));
    createdDiv.append(questionNumberDiv);
    createdDiv.append(questionTextDiv);
    createdDiv.append(questionContainer);
    createdDiv.append(buttonDiv);
    for (let i = 0; i < subjectButtons.length; i++) {
      document.querySelector(`.${subject.subject.slug}`).style.display = "none";
    }
    //initialize the first subject
    document.querySelector(
      `.${[subjectButtons[0].subject.slug]}`
    ).style.display = "block";
    document.querySelector(
      `.${subjectButtons[0].subject.slug}_number`
    ).textContent = "Question 1";
  }

  function ToggleDivs(subject) {
    for (let i = 0; i < subjectButtons.length; i++) {
      document.querySelector(
        `.${subjectButtons[i].subject.slug}`
      ).style.display = "none";
    }
    document.querySelector(`.${subject.subject.slug}`).style.display = "block";
  }

  function CreateSubjectQuestionsDiv(subject) {
    const subjectQuestionDivs = [];
    const { questions } = subjectButtons.find(
      (c) => c.subject.slug === subject.subject.slug
    );

    for (let i = 0; i < questions.length; i++) {
      const newQuestionDiv = document.createElement("div");

      const questionTextDiv = document.createElement("div");
      const optionsDiv = document.createElement("div");
      //==========
      const divA = document.createElement("div");
      divA.classList = "form-check mb-2";
      const optionA = document.createElement("input");
      optionA.type = "radio";
      optionA.className = "form-check-input";
      optionA.value = questions[i].optionA;
      optionA.setAttribute(
        "name",
        `${subject.subject.slug}_${questions[i]._id}`
      );
      optionA.setAttribute("id", `${questions[i]._id}_${questions[i].optionA}`);
      optionA.addEventListener("click", function () {
        MarkQuestion(
          subject.subject.slug,
          `${subject.subject.slug}_${questions[i]._id}`,
          questions[i].optionA,
          questions[i].correctAnswer
        );
      });
      divA.append(optionA);
      const labelOptionA = document.createElement("label");
      labelOptionA.className = "form-check-label";
      labelOptionA.setAttribute(
        "for",
        `${questions[i]._id}_${questions[i].optionA}`
      );
      labelOptionA.textContent = `A. ${questions[i].optionA}`;

      divA.append(labelOptionA);
      //================
      const divB = document.createElement("div");
      divB.classList = "form-check mb-2";
      const optionB = document.createElement("input");
      optionB.type = "radio";
      optionB.className = "form-check-input";
      optionB.value = questions[i].optionB;
      optionB.setAttribute(
        "name",
        `${subject.subject.slug}_${questions[i]._id}`
      );
      optionB.setAttribute("id", `${questions[i]._id}_${questions[i].optionB}`);
      optionB.addEventListener("click", function () {
        MarkQuestion(
          subject.subject.slug,
          `${subject.subject.slug}_${questions[i]._id}`,
          questions[i].optionB,
          questions[i].correctAnswer
        );
      });
      divB.append(optionB);
      const labeloptionB = document.createElement("label");
      labeloptionB.className = "form-check-label";
      labeloptionB.setAttribute(
        "for",
        `${questions[i]._id}_${questions[i].optionB}`
      );
      labeloptionB.textContent = `B. ${questions[i].optionB}`;
      divB.append(labeloptionB);
      //================
      const divC = document.createElement("div");
      divC.classList = "form-check mb-2";
      const optionC = document.createElement("input");
      optionC.type = "radio";
      optionC.className = "form-check-input";
      optionC.value = questions[i].optionC;
      optionC.setAttribute(
        "name",
        `${subject.subject.slug}_${questions[i]._id}`
      );
      optionC.setAttribute("id", `${questions[i]._id}_${questions[i].optionC}`);
      optionC.addEventListener("click", function () {
        MarkQuestion(
          subject.subject.slug,
          `${subject.subject.slug}_${questions[i]._id}`,
          questions[i].optionC,
          questions[i].correctAnswer
        );
      });
      divC.append(optionC);
      const labeloptionC = document.createElement("label");
      labeloptionC.className = "form-check-label";
      labeloptionC.setAttribute(
        "for",
        `${questions[i]._id}_${questions[i].optionC}`
      );
      labeloptionC.textContent = `C. ${questions[i].optionC}`;
      divC.append(labeloptionC);
      //================
      const divD = document.createElement("div");
      divD.classList = "form-check mb-2";
      const optionD = document.createElement("input");
      optionD.type = "radio";
      optionD.className = "form-check-input";
      optionD.setAttribute(
        "name",
        `${subject.subject.slug}_${questions[i]._id}`
      );
      optionD.value = questions[i].optionD;
      optionD.setAttribute("id", `${questions[i]._id}_${questions[i].optionD}`);
      optionD.addEventListener("click", function () {
        MarkQuestion(
          subject.subject.slug,
          `${subject.subject.slug}_${questions[i]._id}`,
          questions[i].optionD,
          questions[i].correctAnswer
        );
      });
      divD.append(optionD);
      const labeloptionD = document.createElement("label");
      labeloptionD.className = "form-check-label";
      labeloptionD.setAttribute(
        "for",
        `${questions[i]._id}_${questions[i].optionD}`
      );
      labeloptionD.textContent = `D. ${questions[i].optionD}`;
      divD.append(labeloptionD);
      //==========
      const correctAnswer = document.createElement("input");
      correctAnswer.type = "hidden";
      correctAnswer.value = questions[i].correctAnswer;
      //===========================
      optionsDiv.classList = "mt-5 mb-3";
      optionsDiv.append(divA);
      optionsDiv.append(divB);
      optionsDiv.append(divC);
      optionsDiv.append(divD);
      questionTextDiv.textContent = questions[i].question;
      questionTextDiv.classList = "questionText";
      newQuestionDiv.classList = `${subject.subject.slug}_question${i} p-3`;
      newQuestionDiv.append(questionTextDiv);
      newQuestionDiv.append(optionsDiv);
      subjectQuestionDivs.push(newQuestionDiv);
    }
    return subjectQuestionDivs;
  }

  function InitializeQuestions() {
    if (subjectButtons) {
      for (let i = 0; i < subjectButtons.length; i++) {
        for (let k = 0; k < subjectButtons[i].questions.length; k++) {
          document.querySelector(
            `.${subjectButtons[i].subject.slug}_question${k}`
          ).style.display = "none";
        }
        document.querySelector(
          `.${subjectButtons[i].subject.slug}_number`
        ).innerText = "Question 1";
        document.querySelector(
          `.${subjectButtons[i].subject.slug}_question${0}`
        ).style.display = "block";
      }
    }
  }
  InitializeQuestions();

  function MarkQuestion(subject, questionId, candidateAnswer, correctAnswer) {
    const score = candidateAnswer === correctAnswer ? 1 : 0;
    const data = { subject, questionId, candidateAnswer, correctAnswer, score };
    const index = candidateAnswers.findIndex(
      (cand) => cand.questionId === questionId
    );
    if (index < 0) {
      candidateAnswers.push(data);
    } else {
      candidateAnswers[index] = data;
    }

    const { subjectCombinations } = candidateData;

    function GetSubjectLength(slug) {
      const length = subjectButtons.find((q) => q.subject.slug === slug)
        .questions.length;
      return length;
    }

    function CalculateScore(answers, length) {
      let score = 0;
      answers.forEach((ans) => {
        score += ans.score;
      });

      return Math.floor((score / length) * 100);
    }
    let subject1 = {};
    subject1.answers = candidateAnswers.filter(
      (c) => c.subject === subjectCombinations[0].subject.slug
    );
    subject1.subject = subjectCombinations[0];
    subject1.length = GetSubjectLength(subject1.subject.subject.slug);
    subject1.score = CalculateScore(subject1.answers, subject1.length);

    let subject2 = {};
    subject2.answers = candidateAnswers.filter(
      (c) => c.subject === subjectCombinations[1].subject.slug
    );
    subject2.subject = subjectCombinations[1];
    subject2.length = GetSubjectLength(subject2.subject.subject.slug);
    subject2.score = CalculateScore(subject2.answers, subject2.length);

    let subject3 = {};
    subject3.answers = candidateAnswers.filter(
      (c) => c.subject === subjectCombinations[2].subject.slug
    );
    subject3.subject = subjectCombinations[2];
    subject3.length = GetSubjectLength(subject3.subject.subject.slug);
    subject3.score = CalculateScore(subject3.answers, subject3.length);

    let subject4 = {};
    subject4.answers = candidateAnswers.filter(
      (c) => c.subject === subjectCombinations[3].subject.slug
    );
    subject4.subject = subjectCombinations[3];
    subject4.length = GetSubjectLength(subject4.subject.subject.slug);
    subject4.score = CalculateScore(subject4.answers, subject4.length);

    SaveAnswers(
      {
        candidateData,
        subject1,
        subject2,
        subject3,
        subject4,
        timeLeft,
        hasSubmitted,
      },
      ServerIpAddress
    );
    //update the candidate's question answered counter
    document.querySelector(".answerCounter").textContent =
      candidateAnswers.length;
    //change colour of button
    document
      .querySelector(`.${questionId}`)
      .classList.replace("btn-danger", "btn-success");
  }

  //to ensure that candidates don't submit too early
  document
    .querySelector(".submitExamination")
    .addEventListener("click", function () {
      if (timer - timeLeft < 5 * 60 * 1000) {
        Swal.fire({
          icon: "info",
          title: "SUBMITTING TOO EARLY",
          text: "You can't submit now until 20 minutes into the examination",
          confirmButtonText: "Continue Examination",
        });
      } else if (candidateAnswers.length < 90) {
        Swal.fire({
          icon: "info",
          title: "FEW QUESTIONS ANSWERED",
          text: "Please answer more than half of the total questions for your subject combinations",
          confirmButtonText: "Continue Examination",
        });
      } else {
        Swal.fire({
          icon: "question",
          title: "Submit and End examination?",
          text: "Are you sure you want to submit and end this examination?",
          confirmButtonText: "Yes, submit",
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "No do not submit",
        }).then((result) => {
          if (result.isConfirmed) {
            hasSubmitted = true;

            FinishExamination({ candidateData, hasSubmitted });
          }
        });
      }
    });

  //use the arrow

  function ArrowNavigationFunc() {
    //get the the array of questions belonging to this subject

    window.addEventListener("keydown", function (e) {
      const currentSubject =
        document.getElementById("subjectTitle").textContent;
      const rawData = subjectButtons.filter(
        (c) => c.subject.title === currentSubject
      )[0];

      const { questions, subject } = rawData;

      let index = 0;
      for (let i = 0; i < questions.length; i++) {
        if (
          document.querySelector(`.${subject.slug}_question${i}`).style
            .display === "block"
        ) {
          index = i;
        }
      }

      if (
        (e.code === "ArrowRight" || e.code === "KeyN") &&
        index + 1 >= 0 &&
        index + 1 < questions.length
      ) {
        const increment = index + 1;

        for (let i = 0; i < questions.length; i++) {
          document.querySelector(
            `.${subject.slug}_question${i}`
          ).style.display = "none";

          document
            .querySelector(`.${subject.slug}_${questions[i]._id}`)
            .classList.replace("btn-danger", "btn-warning");
        }
        document.querySelector(
          `.${subject.slug}_question${index + 1}`
        ).style.display = "block";

        document
          .querySelector(`.${subject.slug}_${questions[index + 1]._id}`)
          .classList.replace("btn-warning", "btn-danger");

        document.querySelector(
          `.${subject.slug}_number`
        ).textContent = `Question ${increment + 1}`;
      }
      if ((e.code === "ArrowLeft" || e.code === "KeyP") && index - 1 >= 0) {
        const decrement = index - 1;

        for (let i = 0; i < questions.length; i++) {
          document.querySelector(
            `.${subject.slug}_question${i}`
          ).style.display = "none";

          document
            .querySelector(`.${subject.slug}_${questions[i]._id}`)
            .classList.replace("btn-danger", "btn-warning");
        }
        document.querySelector(
          `.${subject.slug}_question${index - 1}`
        ).style.display = "block";

        document
          .querySelector(`.${subject.slug}_${questions[index - 1]._id}`)
          .classList.replace("btn-warning", "btn-danger");
        document.querySelector(
          `.${subject.slug}_number`
        ).textContent = `Question ${decrement + 1}`;
      }

      function UncheckOtherOptions() {
        document.getElementById(
          `${questions[index]._id}_${questions[index].optionA}`
        ).checked = false;
        document.getElementById(
          `${questions[index]._id}_${questions[index].optionB}`
        ).checked = false;
        document.getElementById(
          `${questions[index]._id}_${questions[index].optionC}`
        ).checked = false;
        document.getElementById(
          `${questions[index]._id}_${questions[index].optionD}`
        ).checked = false;
      }

      if (e.code === "KeyA") {
        UncheckOtherOptions();
        document.getElementById(
          `${questions[index]._id}_${questions[index].optionA}`
        ).checked = true;
        MarkQuestion(
          subject.slug,
          `${subject.slug}_${questions[index]._id}`,
          questions[index].optionA,
          questions[index].correctAnswer
        );
      }
      if (e.code === "KeyB") {
        UncheckOtherOptions();
        document.getElementById(
          `${questions[index]._id}_${questions[index].optionB}`
        ).checked = true;
        MarkQuestion(
          subject.slug,
          `${subject.slug}_${questions[index]._id}`,
          questions[index].optionB,
          questions[index].correctAnswer
        );
      }
      if (e.code === "KeyC") {
        UncheckOtherOptions();
        document.getElementById(
          `${questions[index]._id}_${questions[index].optionC}`
        ).checked = true;
        MarkQuestion(
          subject.slug,
          `${subject.slug}_${questions[index]._id}`,
          questions[index].optionC,
          questions[index].correctAnswer
        );
      }
      if (e.code === "KeyD") {
        UncheckOtherOptions();
        document.getElementById(
          `${questions[index]._id}_${questions[index].optionD}`
        ).checked = true;
        MarkQuestion(
          subject.slug,
          `${subject.slug}_${questions[index]._id}`,
          questions[index].optionD,
          questions[index].correctAnswer
        );
      }
    });
  }

  ArrowNavigationFunc();
});

setTimeout(() => {
  ipcRenderer.send("GetSavedProgress", "Can I have my progress");
  ipcRenderer.on("MySavedProgress", (e, progress) => {
    if (progress) {
      const timeRemaining = progress.timeLeft;

      UpdateTimer(timeRemaining);

      let savedAnswers = [];
      const { subject1, subject2, subject3, subject4 } = progress;

      function populateCandidateAnswers(subject) {
        const { answers } = subject;
        answers.forEach((element) => {
          savedAnswers.push(element);
          document
            .querySelector(`.${element.questionId}`)
            .classList.replace("btn-warning", "btn-success");
          document
            .querySelector(`.${element.questionId}`)
            .classList.replace("btn-danger", "btn-success");

          document.getElementById(
            `${element.questionId.split("_")[1]}_${element.candidateAnswer}`
          ).checked = true;
        });
      }

      populateCandidateAnswers(subject1);
      populateCandidateAnswers(subject2);
      populateCandidateAnswers(subject3);
      populateCandidateAnswers(subject4);

      candidateAnswers = savedAnswers;

      document.querySelector(".answerCounter").textContent =
        candidateAnswers.length;
    } else {
      UpdateTimer(timer);
    }
  });
}, 1000);
