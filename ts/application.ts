import {calculator} from './calculator.js';

const buttons = document.querySelectorAll('.number, .operator');
const calc = new calculator();
let displayHistory = true;
let scientificMode = true;
let remoteLocation = false;
const fonts = document.querySelectorAll('option');
let theme = 'light';
let color: string;
let font: string;


document.addEventListener("DOMContentLoaded", () => {
    calc.reset();
    const queryString = window.location.search;
    if (queryString != '') {
        const urlParams = new URLSearchParams(queryString);
        color = urlParams.get('color');
        font = urlParams.get('font');
        theme = urlParams.get('theme');
        document.body.style.backgroundColor = color;
        document.body.style.fontFamily = font;
        document.querySelectorAll('input').forEach(elem => elem.style.fontFamily = font);
        document.querySelectorAll('button').forEach(elem => elem.style.fontFamily = font);
        document.querySelectorAll('textarea').forEach(elem => elem.style.fontFamily = font);
        if (theme == 'dark') {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");

        }
    }
    fonts.forEach(font => font.style.fontFamily = font.value);
});

function myEval(char): void {
    if (scientificMode) {
        calc.scientificEval(char)
    } else {
        calc.standardEval(char)
    }
}

function backSpace(): void {
    const newStrInput = calc.strInput.slice(0, calc.strInput.length - 1);
    console.log(newStrInput)
    calc.reset();
    for (let i = 0; i < newStrInput.length; i++) {
        myEval(newStrInput[i])
    }
}

buttons.forEach(button => try1(button));

function try1(button) {
    const char = button.innerHTML;

    button.addEventListener('pointerdown', () => {
        myEval(char);
    });
};

document.addEventListener('keydown', event => {
    buttons.forEach(button => try3(button, event))
});

function try3(button, event) {
    if (button.innerHTML === event.key) {
        button.classList.add('key-board-down');
        myEval(event.key)
    }
}

document.addEventListener('keyup', event => {
    buttons.forEach(button => try2(button, event))
});

function try2(button, event) {
    if (button.innerHTML === event.key) {
        button.classList.remove('key-board-down');
    }
}

function changeTheme(): void {
    // document.body.classList.toggle("dark-mode");
}

function changeToggle(element): void {
    element.classList.toggle("change-toggle");
}

function changeHistoryMode(): void {
    document.body.classList.toggle('hide-history');
    const element = document.getElementById('history');
    displayHistory = !displayHistory;
    if (displayHistory === true) {
        element.title = 'hide history';
    } else {
        element.title = 'show history';
    }
    changeToggle(element)
}

function changeCalcMode(): void {
    calc.reset();
    document.body.classList.toggle('hide-scientific');
    const elementPic = document.getElementById('calcModePic');
    const elementButton = document.getElementById('calcMode');
    scientificMode = !scientificMode;
    if (scientificMode === true) {
        elementPic.setAttribute('src', 'img/calculator.png');
        elementButton.title = 'standard';
    } else {
        elementPic.setAttribute('src', 'img/scientific.png');
        elementButton.title = 'scientific';
    }
}

function changeLocationMode(): void {
    const element = document.getElementById('location');
    remoteLocation = !remoteLocation;
    if (remoteLocation === true) {
        element.title = 'locally';
    } else {
        element.title = 'remote';
    }
    changeToggle(element)
}
