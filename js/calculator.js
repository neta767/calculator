const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    lastInput: null
};

function inputDigit(digit) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue =
            calculator.displayValue === '0' ? digit : calculator.displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    calculator.lastInput = 'operator'
    const {firstOperand, displayValue, operator} = calculator;
    const inputValue = parseFloat(displayValue);

    if (firstOperand == null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const currentValue = firstOperand || 0;
        const result = parseFloat(calculate(currentValue, inputValue, operator).toFixed(7));

        calculator.displayValue = calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        if (secondOperand === 0) {
            alert('undefined')
            clearLast();
            return;
        }
        return firstOperand / secondOperand;
    }

    return secondOperand;
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.lastInput = null;
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.id = calculator.displayValue;
}

function clearLast() {
    if (calculator.lastInput === 'operator') {
        calculator.operator = null
    }
    calculator.lastInput = null;
    // if (calculator.firstOperand === null) {
    //     calculator.displayValue = '0'
    // } else {
    //     calculator.displayValue = calculator.firstOperand
    // }
}

updateDisplay();


const keys = document.querySelector('.calculator-keys');

keys.addEventListener('click', event => {
    const {target} = event;
    let {id} = target;
    if (!target.matches('button')) {
        return;
    }
    id = id.slice(1)
    switch (id) {
        case 'Backspace':
            clearLast();
            break;
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(id);
            break;
        case '.':
            inputDecimal(id);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        default:
            if (Number.isInteger(parseFloat(id))) {
                inputDigit(id);
            }
    }

    updateDisplay();
});

window.addEventListener('keydown', event => {
    let elementExists = document.getElementById('a' + event.key);
    if (elementExists) {
        elementExists.click();
        // elementExists.style.boxShadow = 'none';
        elementExists.classList.add('key-board-down');
    }
});

window.addEventListener('keyup', event => {

    let elementExists = document.getElementById('a' + event.key);
    if (elementExists) {
        elementExists.classList.remove('key-board-down')
    }
});
