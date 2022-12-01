import {standardCalculator} from "./calculator.js";

const standardCalc = new standardCalculator();
const mapKeys = {
    'Enter': '=',
    '/': '÷',
    '*': '×',
};
const standCalcRegex = new RegExp(/^(([0-9]+[-+/*]?)*(\d+\.\d*)?)*$/);
const sciCalcRegex = new RegExp(/^(([0-9]+([-+/%]|\*{1,2})?)*(\d+\.\d*)?)*$/);

const version = '4.0.0';

// toggle variables
let scientificMode = true;
let displayHistory = true;
let remoteLocation = false;
let lightOn = false;
//config style variables
let theme = 'light';
let color: string;

let font: string;

/**
 * reset calculator and implement config style
 */
function indexPageLoaded(): void {
    standardCalc.reset();
    standardCalc.clearCalHistory();
    const queryString = window.location.search;
    if (queryString != '') {
        const urlParams = new URLSearchParams(queryString);
        color = urlParams.get('color');
        font = urlParams.get('font');
        theme = urlParams.get('theme');
        document.body.style.backgroundColor = color;
        document.body.style.fontFamily = font;
        document.querySelectorAll('input').forEach(elem => elem.style.fontFamily = font);
        if (theme == 'dark') {
            document.body.classList.add("dark-mode")
        } else {
            document.body.classList.remove("dark-mode")

        }
    }
}

/**
 *change fonts in fonts select tag from config.html
 */
function configPageLoaded(fonts): void {
    fonts.forEach(font => font.style.fontFamily = font.value);
}

/**
 * implement button clicked style on element
 * @param element
 * @function
 */
function changeToggle(element: HTMLElement): void {
    element.classList.toggle("key-board-down");
}

/**
 * light on/off for calculator-screen
 */
function changeLight(lightBtn): void {
    document.body.classList.toggle("light-screen");
    lightOn = !lightOn;
    if (lightOn === true) {
        lightBtn.title = 'light off';
    } else {
        lightBtn.title = 'light on';
    }
    changeToggle(lightBtn)
}

/**
 * hide/show history
 */
function changeHistoryMode(historyBtn): void {
    document.body.classList.toggle('hide-history');
    displayHistory = !displayHistory;
    if (displayHistory === true) {
        historyBtn.title = 'hide history';
    } else {
        historyBtn.title = 'show history';
    }
    changeToggle(historyBtn)
}

/**
 *hide/show scientific calculator
 */
function changeCalcMode(calcModeBtn): void {
    standardCalc.reset();
    standardCalc.clearLogHistory();
    document.body.classList.toggle('hide-scientific');
    scientificMode = !scientificMode;
    if (scientificMode === true) {
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
function changeLocationMode(locationModeBtn, opLogBtn): void {
    remoteLocation = !remoteLocation;
    if (remoteLocation === true) {
        locationModeBtn.title = 'locally';
    } else {
        locationModeBtn.title = 'remote';
    }
    changeToggle(locationModeBtn)
    changeToggle(opLogBtn);
    opLogBtn.style.cursor = 'context-menu';
    opLogBtn.disabled = remoteLocation;
}

/**
 * show info popup
 */
function showPopup(infoBtn, popup, calculator): void {
    infoBtn.classList.add('key-board-down');
    popup.classList.add('show-popup');
    calculator.classList.add('blur');
}

/**
 * close info popup
 */
function closePopup(infoBtn, popup, calculator): void {
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
function handelBtnClick(locationMode: HTMLElement, opLogBtn: HTMLButtonElement, input: Element, btn: HTMLInputElement) {
    if (input != document.activeElement) {
        // cal.processButton(btn, scientificMode, remoteLocation);
    }
    if (btn.id == 'clear') {
        standardCalc.reset();
    }
    if (btn.id == 'equal' && remoteLocation) {
        displayRemoteCalc(input, locationMode, opLogBtn).then();
    }
}

async function displayRemoteCalc(input, locationMode, opLogBtn) {
    const expression = input.value;
    const out = await remoteEval(input, locationMode, opLogBtn);
    // Calculator.output(expression, out);
}

/**
 * handle key down correctly to the current mode
 * implement button clicked style btn
 * @param input
 * @param btn
 * @param event
 */
function handleKeyDownBtn(input, btn: HTMLInputElement, event: KeyboardEvent): void {
    if (input != document.activeElement) {
        if (btn.value === event.key || btn.value === mapKeys[event.key]) {
            btn.classList.add('key-board-down');
            if (btn.value == '=') {
                switch (scientificMode) {
                    case false:
                        standardCalc.eval();
                }
            } else {
                switch (scientificMode) {
                    case false:
                        standardCalc.processButton(btn.value)
                }
            }
            // cal.processButton(btn, scientificMode, remoteLocation);
            // if ((event.key == '=' || mapKeys[event.key] == '=') && remoteLocation) {
            //     displayRemoteCalc().then();
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
function handleKeyUpBtn(input, btn: HTMLInputElement, event: KeyboardEvent): void {
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
function handleInputInsert(input): void {
    let typedInput: string = input.value;
    if (scientificMode) {
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
function calculateByInputInsert(input): void {
    const mathEqu = input.value;
    input.value = eval(mathEqu);
}

/**
 *  improved version of fetch() that creates requests with a configurable timeout
 * @param url
 * @param timeout
 * @function
 */
async function fetchWithTimeout(url: string, timeout = 2000) {
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
 * @function
 */
async function remoteEval(input, locationMode, opLogBtn) {
    try {
        const url = `https://api.mathjs.org/v4/?expr=${encodeURIComponent(input.value)}`;
        const response = await fetchWithTimeout(url);
        const data = await response.json();
        return data;
    } catch (e) {
        if (confirm('Something went wrong. Would you like to change to local mode?')) {
            changeLocationMode(locationMode, opLogBtn);
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
        configPageLoaded(fonts);

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

        indexPageLoaded();
        historyBtn.addEventListener('click', () => changeHistoryMode(historyBtn));
        calcModeBtn.addEventListener('click', () => changeCalcMode(calcModeBtn));
        locationModeBtn.addEventListener('click', () => changeLocationMode(locationModeBtn, opLogBtn));
        lightBts.addEventListener('click', () => changeLight(lightBts));
        infoBtn.addEventListener('click', () => showPopup(infoBtn, popup, calculator));
        infoBtn.addEventListener('focusout', () => closePopup(infoBtn, popup, calculator));
        buttons.forEach(btn => {
            btn.addEventListener('pointerdown', () => handelBtnClick(locationModeBtn, opLogBtn, input, btn));
        });
        document.addEventListener('keydown', event => {
            buttons.forEach(btn => handleKeyDownBtn(input, btn, event));
        });
        document.addEventListener('keyup', event => {
            buttons.forEach(btn => handleKeyUpBtn(input, btn, event));
        });
        // input.addEventListener('pointerdown', () => standardCalc.reset());
        input.oninput = () => handleInputInsert(input);
        input.addEventListener('focusout', () => calculateByInputInsert(input));
        // document.getElementById('clear-log').addEventListener('pointerdown', () => Calculator.clearCalHistory())
    }
});