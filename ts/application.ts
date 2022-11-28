import {Calculator} from "./calculator";

const fonts = () => document.querySelectorAll('option');
const input = () => document.querySelector('input');
const buttons = () => document.querySelectorAll('.number, .operator');
const historyBtn = () => document.getElementById('history');
const calcModeBtn = () => document.getElementById('calcMode');
const locationModeBtn = () => document.getElementById('location');
const lightBts = () => document.getElementById('light');
const infoBtn = () => document.getElementById('info');
const popup = () => document.getElementById('popup');
const calculator = () => document.getElementsByClassName('calculator')[0];
const standCalcRegex = new RegExp(/^(([0-9]+[-+/*]?)*(\d+\.\d*)?)*$/);
const sciCalcRegex = new RegExp(/^(([0-9]+([-+/%]|\*{1,2})?)*(\d+\.\d*)?)*$/);
const version = '4.0.0'

class Application {
    // toggle variables
    public static scientificMode = true;
    private static displayHistory = true;
    public static remoteLocation = false;
    private static lightOn = false;
    //config style variables
    private static theme = 'light';
    private static color: string;
    private static font: string;

    /**
     * reset calculator and implement config style
     */
    public static indexPageLoaded(): void {
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

    /**
     *change fonts in fonts select tag from config.html
     */
    public static configPageLoaded(): void {
        fonts().forEach(font => font.style.fontFamily = font.value);
    }

    /**
     * implement button clicked style on element
     * @param element
     * @private
     */
    private static changeToggle(element: HTMLElement): void {
        element.classList.toggle("change-toggle");
    }

    /**
     * light on/off for calculator-screen
     */
    public static changeLight(): void {
        document.body.classList.toggle("light-screen");
        this.lightOn = !this.lightOn;
        if (this.lightOn === true) {
            lightBts().title = 'light off';
        } else {
            lightBts().title = 'light on';
        }
        this.changeToggle(lightBts())
    }

    /**
     * hide/show history
     */
    public static changeHistoryMode(): void {
        document.body.classList.toggle('hide-history');
        this.displayHistory = !this.displayHistory;
        if (this.displayHistory === true) {
            historyBtn().title = 'hide history';
        } else {
            historyBtn().title = 'show history';
        }
        this.changeToggle(historyBtn())
    }

    /**
     *hide/show scientific calculator
     */
    public static changeCalcMode(): void {
        Calculator.reset();
        document.body.classList.toggle('hide-scientific');
        const elementPic = document.getElementById('calcModePic');
        this.scientificMode = !this.scientificMode;
        if (this.scientificMode === true) {
            elementPic.setAttribute('src', 'assets/calculator.png');
            calcModeBtn().title = 'standard';
        } else {
            elementPic.setAttribute('src', 'assets/scientific.png');
            calcModeBtn().title = 'scientific';
        }
    }

    /**
     *change to local or remote calculation mode
     */
    public static changeLocationMode(): void {
        const element = document.getElementById('location');
        this.remoteLocation = !this.remoteLocation;
        if (this.remoteLocation === true) {
            element.title = 'locally';
        } else {
            element.title = 'remote';
        }
        this.changeToggle(element)
    }

    /**
     * show info popup
     */
    public static showPopup(): void {
        infoBtn().classList.add('change-toggle');
        popup().classList.add('show-popup');
        calculator().classList.add('blur');
    }

    /**
     * close info popup
     */
    public static closePopup(): void {
        infoBtn().classList.remove('change-toggle');
        popup().classList.remove('show-popup');
        calculator().classList.remove('blur');
    }

    /**
     * handle button click correctly to the current mode
     * @param btn
     */
    public static handelBtnClick(btn: Element) {
        if (input() != document.activeElement) {
            Calculator.processButton(btn, this.scientificMode, this.remoteLocation);
        }
        if (btn.id == 'clear') {
            Calculator.reset();
        }
        if (btn.id == 'equal' && this.remoteLocation) {
            this.displayRemoteCalc().then();
        }
    }

    private static async displayRemoteCalc() {
        const expression = input().value;
        const out = await this.remoteEval();
        Calculator.output(expression, out);
    }

    /**
     * handle key down correctly to the current mode
     * implement button clicked style btn
     * @param btn
     * @param event
     */
    public static handleKeyDownBtn(btn: Element, event: KeyboardEvent): void {
        if (input() != document.activeElement) {
            if (btn.innerHTML === event.key) {
                btn.classList.add('key-board-down');
                Calculator.processButton(btn, this.scientificMode, this.remoteLocation);
                if (event.key == '=' && this.remoteLocation) {
                    this.displayRemoteCalc().then();
                }
            }
        }
    }

    /**
     * remove button clicked style btn after key up
     * @param btn
     * @param event
     */
    public static handleKeyUpBtn(btn: Element, event: KeyboardEvent): void {
        if (input() != document.activeElement) {
            if (btn.innerHTML === event.key) {
                btn.classList.remove('key-board-down');
            }
        }
    }

    /**
     *handle input value
     * when input value not valid show alert and delete the char
     */
    public static handleInputInsert(): void {
        let typedInput: string = input().value;
        if (this.scientificMode) {
            if (sciCalcRegex.test(typedInput) == false) {
                input().value = typedInput.slice(0, -1);
                window.alert('Input is not legal!');
            }
        } else {
            if (standCalcRegex.test(typedInput) == false) {
                input().value = typedInput.slice(0, -1);
                window.alert('Input is not legal!');
            }
        }
    }

    /**
     * calculate result from input insert when input out of focus
     */
    public static calculateByInputInsert(): void {
        const mathEqu = input().value;
        input().value = eval(mathEqu);
    }

    /**
     *  improved version of fetch() that creates requests with a configurable timeout
     * @param url
     * @param timeout
     * @private
     */
    private static async fetchWithTimeout(url: string, timeout = 2000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(url, {
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    }

    /**
     * calculate result when on remote mose
     * catch error when timeout or response return error
     * @private
     */
    private static async remoteEval() {
        try {
            const url = `https://api.mathjs.org/v4/?expr=${encodeURIComponent(input().value)}`;
            const response = await this.fetchWithTimeout(url);
            const data = await response.json();
            return data;
        } catch (e) {
            if (confirm('Something went wrong. Would you like to change to local mode?')) {
                this.changeLocationMode();
            }
        }
    }
}

/**
 * load page for each htmls page
 */
document.addEventListener("DOMContentLoaded", () => {
    const url = document.location.href;
    if (url.search('config.html') != -1) {
        Application.configPageLoaded();

    } else if (url.search('help.html') != -1) {
        console.log('hi')
        document.getElementsByTagName('code')[0].innerHTML = version;
    } else {
        // when on index.html
        Application.indexPageLoaded();
        historyBtn().addEventListener('click', () => Application.changeHistoryMode());
        calcModeBtn().addEventListener('click', () => Application.changeCalcMode());
        locationModeBtn().addEventListener('click', () => Application.changeLocationMode());
        lightBts().addEventListener('click', () => Application.changeLight());
        infoBtn().addEventListener('click', () => Application.showPopup());
        infoBtn().addEventListener('focusout', () => Application.closePopup());
        input().addEventListener('pointerdown', () => Calculator.reset());
        buttons().forEach(btn => {
            btn.addEventListener('pointerdown', () => Application.handelBtnClick(btn));
        });
        document.addEventListener('keydown', event => {
            buttons().forEach(btn => Application.handleKeyDownBtn(btn, event));
        });
        document.addEventListener('keyup', event => {
            buttons().forEach(btn => Application.handleKeyUpBtn(btn, event));
        });
        input().oninput = () => Application.handleInputInsert();
        input().addEventListener('focusout', () => Application.calculateByInputInsert());
    }
});