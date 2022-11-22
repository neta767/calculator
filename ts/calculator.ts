const buttons = document.querySelectorAll('.number, .operator');
const input = document.querySelector('input');
const log = document.querySelector('textarea');
let currentValue = '';
let firstOperand = '';
let secondOperand = '';
let operator = '';
let waitingForSecondOperand = false;
let strInput = '';

document.addEventListener("DOMContentLoaded", () => {
    reset();
});


function isOperator(char: string): boolean {
    return char == '+' || char == '-' || char == '×' || char == '÷';
}

function reset(): void {
    log.value = strInput = currentValue = firstOperand = secondOperand = operator = input.value = '';
}

function scientificEval(char): void {
    switch (char) {
        case '=':
            input.value = eval(strInput);
            break;
        case 'AC':
            strInput = input.value = '';
            break;
        case '÷':
            strInput += '/';
            break;
        case '×':
            strInput += '*';
            break;
        default:
            // if (Number.isInteger(Number(char)) || '') {
            if (!Number.isNaN(parseFloat(char)) || '.') {
                // if (char === '0' && strInput.slice(-1) === '/') {
                //     alert('undefined')
                // } else {
                strInput += char;
                input.value = eval(strInput);
                // }
            } else {
                strInput += char;
            }
    }
    log.value = strInput
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
    } else if (!Number.isNaN(parseFloat(char)) || '.') {
        strInput += char;
        log.value = strInput;
        if (waitingForSecondOperand) {
            secondOperand += char
            // console.log(firstOperand + operator + secondOperand);
            input.value = currentValue = eval(firstOperand + operator + secondOperand);
        } else {
            firstOperand += char;
        }
    }
}

function myEval(char): void {
    if (scientificMode) {
        scientificEval(char)
    } else {
        standardEval(char)
    }
}

for (let button of buttons) {
    const char = button.innerHTML;

    button.addEventListener('pointerdown', () => {
        myEval(char);
    });
}
document.addEventListener('keydown', event => {
    for (let button of buttons) {
        if (button.innerHTML === event.key) {
            button.classList.add('key-board-down');
            myEval(event.key)
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

function backSpace(): void {
    const newStrInput = strInput.slice(0, strInput.length - 1);
    console.log(newStrInput)
    reset();
    for (const char of newStrInput) {
        myEval(char);
    }
}