const operators = ["+", "-", "/", "*"];
let screenText = [];

//Clear button
document.getElementById("clear").addEventListener("click", function () {
  screenText = [];
  document.querySelector(".calculatorScreen").value = "";
});

//backspace button
document.getElementById("backSpace").addEventListener("click", function () {
  if (screenText.length === 1) {
    let newString = screenText[0];
    const reducedText = newString.slice(0, screenText[0].length - 1);

    screenText = [];
    screenText.push(reducedText);
    console.log(screenText);

    document.querySelector(".calculatorScreen").value = screenText.join("");
  }
});

//equal button
document.getElementById("equalSign").addEventListener("click", function () {
  if (screenText.length === 3) {
    const result = MyFunc(
      screenText[1],
      Number(screenText[0]),
      Number(screenText[2])
    );

    document.querySelector(".calculatorScreen").value = result;
  } else if (screenText.length >= 4 && screenText.includes("/")) {
    const result = Number(screenText[0]) / Number(-screenText[3]);
    document.querySelector(".calculatorScreen").value = result;
  }
});

//make buttons active
function displayNum(num) {
  performOperation(num);

  if (screenText.length < 1) {
    if (num === "-") {
      screenText.push(0);
    }
    if (
      num !== "*" &&
      num !== "+" &&
      num !== "/" &&
      num !== "(" &&
      num !== ")"
    ) {
      screenText.push(num);
    }
  } else {
    if (DotExists()) {
      return;
    } else {
      if (num !== "+" && num !== "-" && num !== "*" && num !== "/") {
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
          screenText[1] === "*"
        ) {
          screenText[1] = num;
        } else {
          screenText.push(num);
          console.log({ screenText });
        }
      }
    }
  }
  document.querySelector(".calculatorScreen").value = screenText.join("");
}

function performOperation(num) {
  let result = 0;

  if (screenText.length > 2 && (num === "+" || num === "-" || num === "*")) {
    result = MyFunc(
      screenText[1],
      Number(screenText[0]),
      Number(screenText[2])
    );
    screenText = [];
    screenText.push(result.toString());
  } else {
    console.log("something else");
  }
}

function MyFunc(operator, operand1, operand2) {
  switch (operator) {
    case "+":
      return operand1 + operand2;
    case "-":
      return operand1 - operand2;
    case "*":
      if (
        operand1.toString().includes(".") ||
        operand2.toString().includes(".")
      ) {
        return (operand1 * 10 * operand2) / 10;
      } else {
        return operand1 * operand2;
      }
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

function DotExists() {
  for (let i = 0; i < screenText.length; i++) {
    const last = screenText[i].lastIndexOf(".");
    const first = screenText[i].indexOf(".");
    if (last - first >= 1) {
      return true;
    }
  }
  return false;
}
