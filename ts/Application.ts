import {Calculator} from "./Calculator.js";

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
const sciCalcRegex = new RegExp(/^(([0-9]+[-+/*%^]?)*(\d+\.\d*)?)*$/);
const version = '4.0.0'

class Application {
    private static scientificMode = true;
    private static displayHistory = true;
    private static remoteLocation = false;
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


    static async try1() {
        try {
            const response = await fetch('https://api.mathjs.org/v4/?expr=' + encodeURIComponent(input.value));
            const data = await response.json();
            input.value = data;
            return;
        } catch (e) {
            alert('something wont wrong');
        }
    }

    static myEval(): void {
        if (this.remoteLocation == true) {
            this.try1().then();
        } else {
            if (this.scientificMode) {

            } else {

            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const url = document.location.href;
    if (url.search('config.html') != -1) {
        Application.configPageLoaded();

    } else if (url.search('help.html') != -1) {
        document.getElementsByTagName('code')[0].innerHTML = version;
    } else {
        if (url.search('index.html') != -1) {
            Application.indexPageLoaded();
            historyBtn.addEventListener('click', () => Application.changeHistoryMode());
            calcModeBtn.addEventListener('click', () => Application.changeCalcMode());
            locationModeBtn.addEventListener('click', () => Application.changeLocationMode());
            lightBts.addEventListener('click', () => Application.changeLight());
            infoBtn.addEventListener('click', () => Application.showPopup());
            infoBtn.addEventListener('focusout', () => Application.closePopup());
            document.getElementById('equal').addEventListener('click', () => Application.myEval());
            input.addEventListener('pointerdown', () => {
                Calculator.reset();
            });

            input.oninput = function () {
                console.log(1, input.value)
                let typedInput: string = input.value;
                // if (this.scientificMode) {
                //     if (sciCalcRegex.test(typedInput) == false) {
                //         input.value = typedInput.slice(0, -1);
                //         window.alert('Input is not legal!');
                //     }
                // } else {
                //     if (standCalcRegex.test(typedInput) == false) {
                //         input.value = typedInput.slice(0, -1);
                //         window.alert('Input is not legal!');
                //     }
                // }
            };
//not working!!
// input.addEventListener('focusout', () => {
//     const mathEqu = input.value;
//     for (let i = 0; i < mathEqu.length; i++) {
//         Calculator.myEval(mathEqu[i])
//     }
// });

            // buttons.forEach(btn => {
            //     btn.addEventListener('pointerdown', () => {
            //         if (input != document.activeElement) {
            //             Calculator.myEval(btn.innerHTML);
            //         }
            //     });
            // });
            //
            // document.addEventListener('keydown', event => {
            //     buttons.forEach(btn => {
            //         if (input != document.activeElement) {
            //             if (btn.innerHTML === event.key) {
            //                 btn.classList.add('key-board-down');
            //                 Calculator.myEval(event.key)
            //             }
            //         }
            //     });
            // });
            //
            // document.addEventListener('keyup', event => {
            //     buttons.forEach(btn => {
            //         if (input != document.activeElement) {
            //             if (btn.innerHTML === event.key) {
            //                 btn.classList.remove('key-board-down');
            //             }
            //         }
            //     });
            // });
            //
            // document.getElementById('backspace').addEventListener('click', () => Calculator.backSpace());

        }
    }
});