const buttons = document.querySelectorAll('.number, .operator');
const input = document.querySelectorAll('input')[1];
const log = document.querySelectorAll('input')[0];
let currentValue = '';
let firstOperand = '';
let secondOperand = '';
let operator = '';
let waitingForSecondOperand = false;
let strInput = '';

document.addEventListener("DOMContentLoaded", () => {
    reset();
});

// function scientificEval(char) {
// }

function isOperator(char: string): boolean {
    return char == '+' || char == '-' || char == '×' || char == '÷';
}

function reset(): void {
    log.value = strInput = currentValue = firstOperand = secondOperand = operator = input.value = '';
}

//assuming correct input
function standardEval(char: string): void {
    if (char == '=') {
        input.value = eval(firstOperand + operator + secondOperand);
    } else if (char == 'AC') {
        reset();
        waitingForSecondOperand = false;
    } else if (isOperator(char)) {
        if (waitingForSecondOperand) {
            firstOperand = currentValue;
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
    } else if (!Number.isNaN(parseFloat(char)) || '.') {
        strInput += char;
        log.value = strInput;
        if (waitingForSecondOperand) {
            secondOperand += char
            console.log(firstOperand + operator + secondOperand);
            input.value = currentValue = eval(firstOperand + operator + secondOperand);
        } else {
            firstOperand += char;
        }
    }
}

for (let button of buttons) {
    const char = button.innerHTML;

    button.addEventListener('pointerdown', () => {
        standardEval(char);
    });
}
document.addEventListener('keydown', event => {
    for (let button of buttons) {
        if (button.innerHTML === event.key) {
            button.classList.add('key-board-down');
            standardEval(event.key)
        }
    }
});

document.addEventListener('keyup', event => {
    for (let button of buttons) {
        if (button.innerHTML === event.key) {
            button.classList.remove('key-board-down');
        }
    }
});

// function backSpace() {
//     if (strInput.length > 1) {
//         const newLastChar = strInput.slice(-2, -1)
//         strInput = strInput.slice(0, strInput.length - 2);
//         console.log(strInput, newLastChar);
//         standardEval(newLastChar)
//     }
// }