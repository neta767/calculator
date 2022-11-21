let darkTheme = false;
let displayHistory = false;
let scientificMode = false;
let remoteLocation = false;

function changeTheme() {
    const element = document.getElementById('theme');
    darkTheme = !darkTheme;
    document.body.classList.toggle("dark-mode");
    if (darkTheme === true) {
        element.title = 'light';
    } else {
        element.title = 'dark';
    }
}

function changeToggle(element) {
    element.classList.toggle("change-toggle");
}

function changeHistoryMode() {
    const element = document.getElementById('history');
    displayHistory = !displayHistory;
    if (displayHistory === true) {
        element.title = 'hide history';
    } else {
        element.title = 'show history';
    }
    changeToggle(element)
}

function changeCalcMode() {
    const elementPic = document.getElementById('calcModePic');
    const elementButton = document.getElementById('calcMode');
    scientificMode = !scientificMode;
    if (scientificMode === true) {
        elementPic.src = 'img/calculator.png';
        elementButton.title = 'standard';
    } else {
        elementPic.src = 'img/scientific.png';
        elementButton.title = 'scientific';
    }
}

function changeLocationMode() {
    const element = document.getElementById('location');
    remoteLocation = !remoteLocation;
    if (remoteLocation === true) {
        element.title = 'locally';
    } else {
        element.title = 'remote';
    }
    changeToggle(element)
}
