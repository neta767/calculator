import {Calculator} from "./Calculator.js";

const mapKeys = {
    'Enter': '=',
    '/': '÷',
    '*': '×',
}
const standCalcRegex = new RegExp(/^(([0-9]+[-+/*]?)*(\d+\.\d*)?)*$/);
const sciCalcRegex = new RegExp(/^(([0-9]+([-+/%]|\*{1,2})?)*(\d+\.\d*)?)*$/);
const version = '4.0.0'

class Application {
    private static calc = new Calculator();
    private mapKeys = {
        'Enter': '=',
        '/': '÷',
        '*': '×',
    }
    // private cal = new Calculator();
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
        this.calc.reset();
        this.calc.clearCalHistory();
        const queryString = window.location.search;
        if (queryString != '') {
            const urlParams = new URLSearchParams(queryString);
            this.color = urlParams.get('color');
            this.font = urlParams.get('font');
            this.theme = urlParams.get('theme');
            document.body.style.backgroundColor = this.color;
            document.body.style.fontFamily = this.font;
            document.querySelectorAll('input').forEach(elem => elem.style.fontFamily = this.font);
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
    public static configPageLoaded(fonts): void {
        fonts.forEach(font => font.style.fontFamily = font.value);
    }

    /**
     * implement button clicked style on element
     * @param element
     * @private
     */
    private static changeToggle(element: HTMLElement): void {
        element.classList.toggle("key-board-down");
    }

    /**
     * light on/off for calculator-screen
     */
    public static changeLight(lightBtn): void {
        document.body.classList.toggle("light-screen");
        this.lightOn = !this.lightOn;
        if (this.lightOn === true) {
            lightBtn.title = 'light off';
        } else {
            lightBtn.title = 'light on';
        }
        this.changeToggle(lightBtn)
    }

    /**
     * hide/show history
     */
    public static changeHistoryMode(historyBtn): void {
        document.body.classList.toggle('hide-history');
        this.displayHistory = !this.displayHistory;
        if (this.displayHistory === true) {
            historyBtn.title = 'hide history';
        } else {
            historyBtn.title = 'show history';
        }
        this.changeToggle(historyBtn)
    }

    /**
     *hide/show scientific calculator
     */
    public static changeCalcMode(calcModeBtn): void {
        this.calc.reset();
        this.calc.clearLogHistory();
        document.body.classList.toggle('hide-scientific');
        this.scientificMode = !this.scientificMode;
        if (this.scientificMode === true) {
            calcModeBtn.setAttribute('src', 'img/calculator.png');
            calcModeBtn.title = 'standard';
        } else {
            calcModeBtn.setAttribute('src', 'img/scientific.png');
            calcModeBtn.title = 'scientific';
        }
    }

    /**
     *change to local or remote calculation mode and disable op-log button
     */
    public static changeLocationMode(locationModeBtn, opLogBtn): void {
        this.remoteLocation = !this.remoteLocation;
        if (this.remoteLocation === true) {
            locationModeBtn.title = 'locally';
        } else {
            locationModeBtn.title = 'remote';
        }
        this.changeToggle(locationModeBtn)
        this.changeToggle(opLogBtn);
        opLogBtn.style.cursor = 'context-menu';
        opLogBtn.disabled = this.remoteLocation;
    }

    /**
     * show info popup
     */
    public static showPopup(infoBtn, popup, calculator): void {
        infoBtn.classList.add('key-board-down');
        popup.classList.add('show-popup');
        calculator.classList.add('blur');
    }

    /**
     * close info popup
     */
    public static closePopup(infoBtn, popup, calculator): void {
        infoBtn.classList.remove('key-board-down');
        popup.classList.remove('show-popup');
        calculator.classList.remove('blur');
    }

    /**
     * handle button click correctly to the current mode
     * @param locationMode
     * @param opLogBtn
     * @param input
     * @param btn
     */
    public static handelBtnClick(locationMode: HTMLElement, opLogBtn: HTMLButtonElement, input: Element, btn: HTMLInputElement) {
        if (input != document.activeElement) {
            // cal.processButton(btn, this.scientificMode, this.remoteLocation);
        }
        if (btn.id == 'clear') {
            this.calc.reset();
        }
        if (btn.id == 'equal' && this.remoteLocation) {
            this.displayRemoteCalc(input, locationMode, opLogBtn).then();
        }
    }

    private static async displayRemoteCalc(input, locationMode, opLogBtn) {
        const expression = input.value;
        const out = await this.remoteEval(input, locationMode, opLogBtn);
        // Calculator.output(expression, out);
    }

    /**
     * handle key down correctly to the current mode
     * implement button clicked style btn
     * @param input
     * @param btn
     * @param event
     */
    public static handleKeyDownBtn(input, btn: HTMLInputElement, event: KeyboardEvent): void {
        if (input != document.activeElement) {
            if (btn.value === event.key || btn.value === mapKeys[event.key]) {
                btn.classList.add('key-board-down');
                if (btn.value == '=') {
                    switch (this.scientificMode) {
                        case false:
                            this.calc.evalStandard();
                    }
                } else {
                    switch (this.scientificMode) {
                        case false:
                            this.calc.processButtonStandard(btn.value)
                    }
                }
                // cal.processButton(btn, this.scientificMode, this.remoteLocation);
                // if ((event.key == '=' || mapKeys[event.key] == '=') && this.remoteLocation) {
                //     this.displayRemoteCalc().then();
                // }
            }
        }
    }

    /**
     * remove button clicked style btn after key up
     * @param input
     * @param btn
     * @param event
     */
    public static handleKeyUpBtn(input, btn: HTMLInputElement, event: KeyboardEvent): void {
        if (input != document.activeElement) {
            if (btn.value === event.key || btn.value === mapKeys[event.key]) {
                btn.classList.remove('key-board-down');
            }
        }
    }

    /**
     *handle input value
     * when input value not valid show alert and delete the char
     */
    public static handleInputInsert(input): void {
        let typedInput: string = input.value;
        if (this.scientificMode) {
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
    }

    /**
     * calculate result from input insert when input out of focus
     */
    public static calculateByInputInsert(input): void {
        const mathEqu = input.value;
        input.value = eval(mathEqu);
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
    private static async remoteEval(input, locationMode, opLogBtn) {
        try {
            const url = `https://api.mathjs.org/v4/?expr=${encodeURIComponent(input.value)}`;
            const response = await this.fetchWithTimeout(url);
            const data = await response.json();
            return data;
        } catch (e) {
            if (confirm('Something went wrong. Would you like to change to local mode?')) {
                this.changeLocationMode(locationMode, opLogBtn);
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
        const fonts = document.querySelectorAll('option');
        Application.configPageLoaded(fonts);

    } else if (url.search('help.html') != -1) {
        document.querySelector('code').innerHTML = version;
    } else {
        // when on index.html
        const input = document.getElementById('calculator-screen') as HTMLInputElement;
        const buttons = document.querySelectorAll('.operator,.number') as NodeListOf<HTMLInputElement>;
        const historyBtn = document.getElementById('history');
        const calcModeBtn = document.getElementById('calcMode');
        const locationModeBtn = document.getElementById('location');
        const lightBts = document.getElementById('light');
        const infoBtn = document.getElementById('info');
        const popup = document.getElementById("popup");
        const calculator = document.querySelector('.calculator');
        const opLogBtn = document.getElementById('op-log') as HTMLButtonElement;

        Application.indexPageLoaded();
        historyBtn.addEventListener('click', () => Application.changeHistoryMode(historyBtn));
        calcModeBtn.addEventListener('click', () => Application.changeCalcMode(calcModeBtn));
        locationModeBtn.addEventListener('click', () => Application.changeLocationMode(locationModeBtn, opLogBtn));
        lightBts.addEventListener('click', () => Application.changeLight(lightBts));
        infoBtn.addEventListener('click', () => Application.showPopup(infoBtn, popup, calculator));
        infoBtn.addEventListener('focusout', () => Application.closePopup(infoBtn, popup, calculator));
        buttons.forEach(btn => {
            btn.addEventListener('pointerdown', () => Application.handelBtnClick(locationModeBtn, opLogBtn, input, btn));
        });
        document.addEventListener('keydown', event => {
            buttons.forEach(btn => Application.handleKeyDownBtn(input, btn, event));
        });
        document.addEventListener('keyup', event => {
            buttons.forEach(btn => Application.handleKeyUpBtn(input, btn, event));
        });
        // input.addEventListener('pointerdown', () => this.calc.reset());
        input.oninput = () => Application.handleInputInsert(input);
        input.addEventListener('focusout', () => Application.calculateByInputInsert(input));
        // document.getElementById('clear-log').addEventListener('pointerdown', () => Calculator.clearCalHistory())
    }
});