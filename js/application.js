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

//not perfect-maybe to use toggle
function changeToggle(element, toggle) {
    if (toggle === true) {
        element.style.boxShadow = 'none';
        element.style.transform = 'translateY(5px)';
        if (darkTheme === true) {
            element.style.backgroundColor = 'rgba(127, 127, 127, 0.5)';
        } else {
            element.style.backgroundColor = 'rgba(173, 216, 230, 0.52)';
        }
    } else {
        element.style.backgroundColor = '';
        if (darkTheme === true) {
            element.style.boxShadow = '0 5px #3b3c40';
        } else {
            element.style.boxShadow = '0 5px rgba(153, 153, 153, 0.5)';
        }
        element.style.transform = '';
    }
}

function changeHistoryMode() {
    const element = document.getElementById('history');
    displayHistory = !displayHistory;
    if (displayHistory === true) {
        element.title = 'hide history';
    } else {
        element.title = 'show history';
    }
    changeToggle(element, displayHistory)
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
    changeToggle(element, remoteLocation)
}
