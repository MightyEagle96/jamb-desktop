const { ipcRenderer } = require("electron");

let candidateAnswers = [];

ipcRenderer.send("getQuestions", "Lemme have the server ip address");
ipcRenderer.on("sendQuestions", (e, questions) => {
  const subjectButtons = questions;
  let timer = 120 * 60 * 1000;

  let currentSubject = "";
  const timeLeftDisplay = document.querySelector(".timeLeft");
  function CreateSubjectButtons() {
    const subjectButtonsDiv = document.querySelector(".subjectButtonsDiv");

    //to initialize the first subject
    document.getElementById("subjectTitle").textContent =
      subjectButtons[0].title;

    //initialize the first questions for each subject

    for (let i = 0; i < subjectButtons.length; i++) {
      const newSubjectBtn = document.createElement("button");
      newSubjectBtn.classList = "btn btn-success me-2 ";
      newSubjectBtn.textContent = subjectButtons[i].title;
      newSubjectBtn.addEventListener("click", function (e) {
        document.getElementById("subjectTitle").textContent =
          e.target.innerText;
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

  //  //1. set the subject title
  const btns = document.getElementsByClassName("subjectBtn");

  function CreateNumberButtons(subject) {
    const buttonDiv = document.createElement("div");
    if (subject.slug === "use-of-english") {
      for (let i = 0; i < subject.questions.length; i++) {
        const newContent = document.createElement("button");
        newContent.classList = `btn btn-warning me-2 mb-2 ${subject.slug}-${subject.questions[i]._id}`;

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
          document.querySelector(
            `.${subject.slug}-question${i}`
          ).style.display = "block";
        });
        buttonDiv.appendChild(newContent);
      }
    } else {
      for (let i = 0; i < subject.questions.length; i++) {
        const newContent = document.createElement("button");
        newContent.classList = `btn btn-warning me-2 mb-2 ${subject.slug}-${subject.questions[i]._id}`;
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
          document.querySelector(
            `.${subject.slug}-question${i}`
          ).style.display = "block";
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
      document.querySelector(`.${subjectButtons[i].slug}`).style.display =
        "none";
    }
    document.querySelector(`.${subject.slug}`).style.display = "block";
  }

  function CreateSubjectQuestionsDiv(subject) {
    console.log(subject);
    const subjectQuestionDivs = [];
    const { questions } = subjectButtons.find((c) => c.slug === subject.slug);
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
      optionA.setAttribute("name", `${subject.slug}-${questions[i]._id}`);
      optionA.setAttribute("id", `${questions[i]._id}-${questions[i].optionA}`);
      optionA.addEventListener("click", function () {
        MarkQuestion(
          subject.slug,
          `${subject.slug}-${questions[i]._id}`,
          questions[i].optionA,
          questions[i].correctAnswer
        );
      });

      divA.append(optionA);
      const labelOptionA = document.createElement("label");
      labelOptionA.className = "form-check-label";
      labelOptionA.setAttribute(
        "for",
        `${questions[i]._id}-${questions[i].optionA}`
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
      optionB.setAttribute("name", `${subject.slug}-${questions[i]._id}`);
      optionB.setAttribute("id", `${questions[i]._id}-${questions[i].optionB}`);
      optionB.addEventListener("click", function () {
        MarkQuestion(
          subject.slug,
          `${subject.slug}-${questions[i]._id}`,
          questions[i].optionB,
          questions[i].correctAnswer
        );
      });

      divB.append(optionB);
      const labeloptionB = document.createElement("label");
      labeloptionB.className = "form-check-label";
      labeloptionB.setAttribute(
        "for",
        `${questions[i]._id}-${questions[i].optionB}`
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
      optionC.setAttribute("name", `${subject.slug}-${questions[i]._id}`);
      optionC.setAttribute("id", `${questions[i]._id}-${questions[i].optionC}`);
      optionC.addEventListener("click", function () {
        MarkQuestion(
          subject.slug,
          `${subject.slug}-${questions[i]._id}`,
          questions[i].optionC,
          questions[i].correctAnswer
        );
      });

      divC.append(optionC);
      const labeloptionC = document.createElement("label");
      labeloptionC.className = "form-check-label";
      labeloptionC.setAttribute(
        "for",
        `${questions[i]._id}-${questions[i].optionC}`
      );
      labeloptionC.textContent = `C. ${questions[i].optionC}`;
      divC.append(labeloptionC);

      //================
      const divD = document.createElement("div");
      divD.classList = "form-check mb-2";

      const optionD = document.createElement("input");
      optionD.type = "radio";
      optionD.className = "form-check-input";
      optionD.setAttribute("name", `${subject.slug}-${questions[i]._id}`);
      optionD.value = questions[i].optionD;
      optionD.setAttribute("id", `${questions[i]._id}-${questions[i].optionD}`);
      optionD.addEventListener("click", function () {
        MarkQuestion(
          subject.slug,
          `${subject.slug}-${questions[i]._id}`,
          questions[i].optionD,
          questions[i].correctAnswer
        );
      });

      divD.append(optionD);
      const labeloptionD = document.createElement("label");
      labeloptionD.className = "form-check-label";
      labeloptionD.setAttribute(
        "for",
        `${questions[i]._id}-${questions[i].optionD}`
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

      newQuestionDiv.classList = `${subject.slug}-question${i} p-3`;
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

    console.log(candidateAnswers);
    //update the candidate's question answered counter
    document.querySelector(".answerCounter").textContent =
      candidateAnswers.length;

    //change colour of button
    document.querySelector(`.${questionId}`).classList.remove("btn-warning");
    document.querySelector(`.${questionId}`).classList.add("btn-success");
  }
});
