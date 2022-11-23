const buttons = document.querySelectorAll('.number, .operator');
const input = document.querySelector('input');
const log = document.querySelector('textarea');
let currentValue = '';
let firstOperand = '';
let secondOperand = '';
let operator = '';
let waitingForSecondOperand = false;
let strInput = '';
const standCalcRegex = new RegExp(/^(([0-9]+[-+/*]?)*(\d+\.\d*)?)*$/);
const sciCalcRegex = new RegExp(/^(([0-9]+[-+/*%^]?)*(\d+\.\d*)?)*$/);
document.addEventListener("DOMContentLoaded", () => {
    reset();
});


function isOperator(char: string): boolean {
    return char == '+' || char == '-' || char == '×' || char == '÷';
}

class calc {
    public static scientificMode = true;

    public static reset() {
    }
}

function reset(): void {
    log.value = strInput = currentValue = firstOperand = secondOperand = operator = input.value = '';
}

function scientificEval(char): void {
    if (char == '=') {
        input.value = eval(strInput);
    } else if (char == 'AC') {
        reset();
        waitingForSecondOperand = false;
    } else if (isOperator(char)) {
        if (isOperator(strInput.slice(-1))) {
            strInput = strInput.slice(0, -1);
        }
        if (char == '÷') {
            operator = '/';
        } else if (char == '×') {
            operator = '*';
        } else {
            operator = char;
        }
        strInput += operator;
        waitingForSecondOperand = true;
    } else if (!isNaN(Number(char)) || '.') {
        strInput += char;
        if (waitingForSecondOperand) {
            input.value = eval(strInput);
        }
    }
    log.value = strInput
}

function standardEval(char: string): void {
    if (char == '=') {
        input.value = eval(firstOperand + operator + secondOperand);
    } else if (char == 'AC') {
        reset();
        waitingForSecondOperand = false;
    } else if (isOperator(char)) {
        if (waitingForSecondOperand) {
            firstOperand = currentValue || firstOperand;
        }
        if (isOperator(strInput.slice(-1))) {
            strInput = strInput.slice(0, -1);
        }
        strInput += char;
        log.value = strInput;
        if (char == '÷') {
            operator = '/';
        } else if (char == '×') {
            operator = '*';
        } else {
            operator = char;
        }
        secondOperand = '';
        waitingForSecondOperand = true;
    } else if (!isNaN(Number(char)) || '.') {
        strInput += char;
        log.value = strInput;
        if (waitingForSecondOperand) {
            secondOperand += char;
            input.value = currentValue = eval(firstOperand + operator + secondOperand);
        } else {
            firstOperand += char;
        }
    }
}

function myEval(char): void {
    if (calc.scientificMode) {
        scientificEval(char);
    } else {
        standardEval(char);
    }
}

input.addEventListener('pointerdown', () => {
    reset();
});

input.oninput = function () {
    let typedInput: string = input.value;
    if (calc.scientificMode) {
        if (sciCalcRegex.test(typedInput) == false) {
            input.value = typedInput.slice(0, -1);
            window.alert('Input is not legal!');
        }
    } else {
        if (standCalcRegex.test(typedInput) == false) {
            input.value = typedInput.slice(0, -1);
            window.alert('Input is not legal!');
        }
    }
};

buttons.forEach(btn => {
    btn.addEventListener('pointerdown', () => {
        if (input != document.activeElement) {
            myEval(btn.innerHTML);
        }
    });
});

document.addEventListener('keydown', event => {
    buttons.forEach(btn => {
        if (input != document.activeElement) {
            if (btn.innerHTML === event.key) {
                btn.classList.add('key-board-down');
                myEval(event.key)
            }
        }
    });
});

document.addEventListener('keyup', event => {
    buttons.forEach(btn => {
        if (input != document.activeElement) {
            if (btn.innerHTML === event.key) {
                btn.classList.remove('key-board-down');
            }
        }
    });
});

function backSpace(): void {
    const newStrInput = strInput.slice(0, strInput.length - 1);
    reset();
    for (let i = 0; i < newStrInput.length; i++) {
        // myEval(newStrInput[i])
    }
}