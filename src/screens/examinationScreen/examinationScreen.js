//1. set the subject title
const btns = document.getElementsByClassName("subjectBtn");

//to load it by default
document.getElementById("subjectTitle").textContent = btns[0].textContent;
// const buttons = [];

// for (let i = 0; i < 60; i++) {
//   buttons.push(`<button class="btn btn-warning me-2 mb-2">${i + 1}</button>`);
// }
// document.querySelector(".answerBtn").innerHTML = buttons.join(" ");

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

//to create the btns below

// //change color of button
// function ChangeNumber(e) {
//     document.querySelector('.questionNumber').textContent
// }

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

  //   if (subjectTitle === "USE OF ENGLISH") {
  //     const buttons = [];

  //     for (let i = 0; i < 60; i++) {
  //       buttons.push(
  //         `<button class="btn btn-warning useOfEnglishBtn me-2 mb-2">${
  //           i + 1
  //         }</button>`
  //       );
  //     }
  //     document.querySelector(".answerBtn").innerHTML = buttons.join(" ");
  //   } else {
  //     const buttons = [];

  //     for (let i = 0; i < 40; i++) {
  //       buttons.push(
  //         `<button class="btn btn-warning me-2 mb-2"}=>${i + 1}</button>`
  //       );
  //     }
  //     document.querySelector(".answerBtn").innerHTML = buttons.join(" ");
  //  }
}

CreateButtons();
