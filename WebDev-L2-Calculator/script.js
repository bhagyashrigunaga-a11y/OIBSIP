const display = document.getElementById("display");
const errorMessage = document.getElementById("error-message");

let currentInput = "";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const actionButtons = document.querySelectorAll("[data-action]");

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        const number = button.dataset.number;
        enterNumber(number);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedOperator = button.dataset.operator;
        chooseOperator(selectedOperator);
    });
});

actionButtons.forEach(button => {
    button.addEventListener("click", () => {
        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteLastCharacter();
        }

        if (action === "calculate") {
            calculateResult();
        }
    });
});

function enterNumber(number) {
    clearError();

    if (waitingForSecondNumber) {
        currentInput = "";
        waitingForSecondNumber = false;
    }

    if (number === "." && currentInput.includes(".")) {
        return;
    }

    if (currentInput === "0" && number !== ".") {
        currentInput = "";
    }

    currentInput += number;
    updateDisplay(currentInput);
}

function chooseOperator(selectedOperator) {
    clearError();

    if (currentInput === "" && firstNumber === null) {
        return;
    }

    if (firstNumber === null) {
        firstNumber = parseFloat(currentInput);
    } else if (!waitingForSecondNumber) {
        const result = performCalculation();

        if (result === null) {
            return;
        }

        firstNumber = result;
        currentInput = String(result);
        updateDisplay(currentInput);
    }

    operator = selectedOperator;
    waitingForSecondNumber = true;
}

function calculateResult() {
    clearError();

    if (firstNumber === null || operator === null || currentInput === "") {
        return;
    }

    const result = performCalculation();

    if (result === null) {
        return;
    }

    currentInput = String(result);
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;

    updateDisplay(currentInput);
}

function performCalculation() {
    const secondNumber = parseFloat(currentInput);
    let result;

    if (operator === "/" && secondNumber === 0) {
        showError("Cannot divide by zero");
        return null;
    }

    switch (operator) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            result = firstNumber / secondNumber;
            break;

        case "%":
            result = firstNumber % secondNumber;
            break;

        default:
            return null;
    }

    return parseFloat(result.toFixed(10));
}

function deleteLastCharacter() {
    clearError();

    if (waitingForSecondNumber) {
        return;
    }

    currentInput = currentInput.slice(0, -1);

    if (currentInput === "") {
        currentInput = "0";
    }

    updateDisplay(currentInput);
}

function clearCalculator() {
    currentInput = "";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;

    clearError();
    updateDisplay("0");
}

function updateDisplay(value) {
    display.value = value;
}

function showError(message) {
    errorMessage.textContent = message;
}

function clearError() {
    errorMessage.textContent = "";
}
