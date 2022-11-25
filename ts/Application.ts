import {Calculator} from "./Calculator.js";

const log = document.querySelector('textarea');
const fonts = document.querySelectorAll('option');
const input = document.querySelector('input');
const buttons = document.querySelectorAll('.number, .operator');
const historyBtn = document.getElementById('history');
const calcModeBtn = document.getElementById('calcMode');
const locationModeBtn = document.getElementById('location');
const lightBts = document.getElementById('light');
const infoBtn = document.getElementById('info');
const popup = document.getElementById("popup");
const calculator = document.getElementsByClassName('calculator')[0];
const standCalcRegex = new RegExp(/^(([0-9]+[-+/*]?)*(\d+\.\d*)?)*$/);
const sciCalcRegex = new RegExp(/^(([0-9]+([-+/%]|\*{1,2})?)*(\d+\.\d*)?)*$/);
const version = '4.0.0'

class Application {
    public static scientificMode = true;
    private static displayHistory = true;
    public static remoteLocation = false;
    private static lightOn = false;
    private static theme = 'light';
    private static color: string;
    private static font: string;

    static indexPageLoaded(): void {
        Calculator.reset();
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
        this.lightOn = !this.lightOn;
        if (this.lightOn === true) {
            lightBts.title = 'light off';
        } else {
            lightBts.title = 'light on';
        }
        this.changeToggle(lightBts)
    }

    static changeHistoryMode(): void {
        document.body.classList.toggle('hide-history');
        this.displayHistory = !this.displayHistory;
        if (this.displayHistory === true) {
            historyBtn.title = 'hide history';
        } else {
            historyBtn.title = 'show history';
        }
        this.changeToggle(historyBtn)
    }

    static changeCalcMode(): void {
        Calculator.reset();
        document.body.classList.toggle('hide-scientific');
        const elementPic = document.getElementById('calcModePic');
        this.scientificMode = !this.scientificMode;
        if (this.scientificMode === true) {
            elementPic.setAttribute('src', 'img/calculator.png');
            calcModeBtn.title = 'standard';
        } else {
            elementPic.setAttribute('src', 'img/scientific.png');
            calcModeBtn.title = 'scientific';
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

    static showPopup(): void {
        infoBtn.classList.add('change-toggle');
        popup.classList.add('show-popup');
        calculator.classList.add('blur');
    }

    static closePopup(): void {
        infoBtn.classList.remove('change-toggle');
        popup.classList.remove('show-popup');
        calculator.classList.remove('blur');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const url = document.location.href;
    if (url.search('config.html') != -1) {
        Application.configPageLoaded();

    } else if (url.search('help.html') != -1) {
        document.getElementsByTagName('code')[0].innerHTML = version;
    } else {
        Application.indexPageLoaded();
        historyBtn.addEventListener('click', () => Application.changeHistoryMode());
        calcModeBtn.addEventListener('click', () => Application.changeCalcMode());
        locationModeBtn.addEventListener('click', () => Application.changeLocationMode());
        lightBts.addEventListener('click', () => Application.changeLight());
        infoBtn.addEventListener('click', () => Application.showPopup());
        infoBtn.addEventListener('focusout', () => Application.closePopup());
        input.addEventListener('pointerdown', () => {
            Calculator.reset();
        });
        buttons.forEach(btn => {
            btn.addEventListener('pointerdown', () => {
                if (input != document.activeElement) {
                    Calculator.processButton(btn, Application.scientificMode, Application.remoteLocation);
                }
            });
        });

        document.addEventListener('keydown', event => {
            buttons.forEach(btn => {
                if (input != document.activeElement) {
                    if (btn.innerHTML === event.key) {
                        btn.classList.add('key-board-down');
                        Calculator.processButton(btn, Application.scientificMode, Application.remoteLocation);
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

        async function fetchWithTimeout(url, timeout = 2000) {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            clearTimeout(id);
            return await fetch(url, {
                signal: controller.signal
            });
        }

        async function remoteEval() {
            try {
                const url = `https://api.mathjs.org/v4/?expr=${encodeURIComponent(input.value)}`;
                const response = await this.fetchWithTimeout(url);
                const data = await response.text();
                input.value = data;
            } catch (e) {
                if (confirm('Something went wrong. Would you like to change to local?')) {
                    Application.changeLocationMode();
                }
            }
        }

        input.oninput = function () {
            let typedInput: string = input.value;
            if (Application.scientificMode) {
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

        input.addEventListener('focusout', () => {
            const mathEqu = input.value;
            input.value = eval(mathEqu);
        });
    }
});