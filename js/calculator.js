const buttons = document.querySelectorAll('.number, .operator');
const output = document.querySelector('input');
let input = '';

window.addEventListener("load", (event) => {
    output.value = '';
});

function calc(char) {
    switch (char) {
        case '=':
            output.value = eval(input);
            break;
        case 'AC':
            input = output.value = '';
            break;
        case '÷':
            input += '/';
            break;
        case '×':
            input += '*';
            break;
        default:
            if (Number.isInteger(Number(char)) || '') {
                if (char === '0' && input.slice(-1) === '/') {
                    alert('undefined')
                } else {
                    input += char;
                    output.value = eval(input);
                }
            } else {
                input += char;
            }
    }
}

for (let button of buttons) {
    const char = button.innerHTML;

    button.addEventListener('pointerdown', () => {
        calc(char);
    });
}
document.addEventListener('keydown', event => {
    for (let button of buttons) {
        if (button.innerHTML === event.key) {
            button.classList.add('key-board-down');
            calc(event.key)
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

function backSpace() {
    if (input.length > 1) {
        const newLastChar = input.slice(-2, -1)
        input = input.slice(0, input.length - 2);
        console.log(input, newLastChar);
        calc(newLastChar)
    }
}