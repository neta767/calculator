import {Calculator} from "./Calculator.js";

const fonts = document.querySelectorAll('option');
const input = document.querySelector('input');
const buttons = document.querySelectorAll('.number, .operator');
const standCalcRegex = new RegExp(/^(([0-9]+[-+/*]?)*(\d+\.\d*)?)*$/);
const sciCalcRegex = new RegExp(/^(([0-9]+[-+/*%^]?)*(\d+\.\d*)?)*$/);

class Application {
    private static displayHistory = true;
    private static remoteLocation = false;
    private static lightOn = false;
    private static theme = 'light';
    private static color: string;
    private static font: string;

    static indexPageLoaded(): void {
        // Calculator.reset();
        const queryString = window.location.search;
        if (queryString != '') {
            const urlParams = new URLSearchParams(queryString);
            this.color = urlParams.get('color');
            this.font = urlParams.get('font');
            this.theme = urlParams.get('theme');
            document.body.style.backgroundColor = this.color;
            document.body.style.fontFamily = this.font;
            document.querySelectorAll('input').forEach(elem => elem.style.fontFamily = this.font);
            document.querySelectorAll('button').forEach(elem => elem.style.fontFamily = this.font);
            document.querySelectorAll('textarea').forEach(elem => elem.style.fontFamily = this.font);
            if (this.theme == 'dark') {
                document.body.classList.add("dark-mode")
            } else {
                document.body.classList.remove("dark-mode")

            }
        }
    }

    static configPageLoaded(): void {
        fonts.forEach(font => font.style.fontFamily = font.value);
    }

    private static changeToggle(element): void {
        element.classList.toggle("change-toggle");
    }

    static changeLight(): void {
        document.body.classList.toggle("light-screen");
        const element = document.getElementById('light');
        this.lightOn = !this.lightOn;
        if (this.lightOn === true) {
            element.title = 'light off';
        } else {
            element.title = 'light on';
        }
        this.changeToggle(element)
    }

    static changeHistoryMode(): void {
        document.body.classList.toggle('hide-history');
        const element = document.getElementById('history');
        this.displayHistory = !this.displayHistory;
        if (this.displayHistory === true) {
            element.title = 'hide history';
        } else {
            element.title = 'show history';
        }
        this.changeToggle(element)
    }

    static changeCalcMode(): void {
        // Calculator.reset();
        document.body.classList.toggle('hide-scientific');
        const elementPic = document.getElementById('calcModePic');
        const elementButton = document.getElementById('calcMode');
        Calculator.scientificMode = !Calculator.scientificMode;
        if (Calculator.scientificMode === true) {
            elementPic.setAttribute('src', 'img/calculator.png');
            elementButton.title = 'standard';
        } else {
            elementPic.setAttribute('src', 'img/scientific.png');
            elementButton.title = 'scientific';
        }
    }

    static changeLocationMode(): void {
        const element = document.getElementById('location');
        this.remoteLocation = !this.remoteLocation;
        if (this.remoteLocation === true) {
            element.title = 'locally';
        } else {
            element.title = 'remote';
        }
        this.changeToggle(element)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.location.href.search('index.html') != -1) {
        Application.indexPageLoaded();
        document.getElementById('history').addEventListener('click', () => Application.changeHistoryMode());
        document.getElementById('calcMode').addEventListener('click', () => Application.changeCalcMode());
        document.getElementById('location').addEventListener('click', () => Application.changeLocationMode());
        document.getElementById('light').addEventListener('click', () => Application.changeLight());
    } else {
        Application.configPageLoaded();
    }
});

input.addEventListener('pointerdown', () => {
    Calculator.reset();
});

input.oninput = function () {
    let typedInput: string = input.value;
    if (Calculator.scientificMode) {
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
            Calculator.myEval(btn.innerHTML);
        }
    });
});

document.addEventListener('keydown', event => {
    buttons.forEach(btn => {
        if (input != document.activeElement) {
            if (btn.innerHTML === event.key) {
                btn.classList.add('key-board-down');
                Calculator.myEval(event.key)
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

document.getElementById('backspace').addEventListener('click', () => Calculator.backSpace());