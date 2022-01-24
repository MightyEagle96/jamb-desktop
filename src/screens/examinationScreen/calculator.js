const operators = ["+", "-", "/", "*"];
let screenText = [];

//Clear button
document.getElementById("clear").addEventListener("click", function () {
  screenText = [];
  document.querySelector(".calculatorScreen").value = "";
});

//equal button
document.getElementById("equalSign").addEventListener("click", function () {
  if (screenText.length > 2) {
    const result = MyFunc(
      screenText[1],
      Number(screenText[0]),
      Number(screenText[2])
    );
    console.log(result);
    document.querySelector(".calculatorScreen").value = result;
  }
});

//make buttons active
function displayNum(num) {
  performOperation(num);
  if (screenText.length < 1) {
    screenText.push(num);
  } else if (num !== "+" && num !== "-" && num !== "*" && num !== "/") {
    if (
      screenText[screenText.length - 1] === "+" ||
      screenText[screenText.length - 1] === "-" ||
      screenText[screenText.length - 1] === "/" ||
      screenText[screenText.length - 1] === "*"
    ) {
      screenText.push(num);
    } else {
      screenText[screenText.length - 1] =
        screenText[screenText.length - 1] + num;
    }
  } else {
    if (
      screenText[1] === "+" ||
      screenText[1] === "-" ||
      screenText[1] === "*" ||
      screenText[1] === "/"
    ) {
      screenText[1] = num;
    } else screenText.push(num);
  }
  document.querySelector(".calculatorScreen").value = screenText.join("");
}

function performOperation(num) {
  let result = 0;
  if (
    screenText.length > 2 &&
    (num === "+" || num === "-" || num === "/" || num === "*")
  ) {
    result = MyFunc(
      screenText[1],
      Number(screenText[0]),
      Number(screenText[2])
    );

    screenText = [];
    screenText.push(result.toString());
  }
}

function MyFunc(operator, operand1, operand2) {
  switch (operator) {
    case "+":
      return operand1 + operand2;
    case "-":
      return operand1 - operand2;
    case "*":
      return operand1 * operand2;
    case "/":
      return operand1 / operand2;

    default:
      break;
  }
}

//show caluclator
function showCalculator() {
  document.querySelector(".calculatorContainer").style.display = "block";
  document.querySelector(".candidateDetails").style.display = "none";
}
//hide calculator
function hideCalculator() {
  document.querySelector(".calculatorContainer").style.display = "none";
  document.querySelector(".candidateDetails").style.display = "block";
}
