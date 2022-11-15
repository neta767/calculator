let darkTheme = false;
let displayHistory = false;
let scientificMode = false;
let remoteLocation = false;

function changeTheme() {
    darkTheme = !darkTheme;
    document.body.classList.toggle("dark-mode");
    if (darkTheme === true) {
        document.getElementById('theme').style.backgroundColor = 'red';
    } else {
        document.getElementById('theme').style.backgroundColor = '';
    }
}

function changeHistoryMode() {
    displayHistory = !displayHistory;
    console.log(displayHistory)
    if (displayHistory === true) {
        document.getElementById('history').style.backgroundColor = 'red';
    } else {
        document.getElementById('history').style.backgroundColor = '';
    }
}

function changeCalcMode() {
    scientificMode = !scientificMode;
    if (scientificMode === true) {
        document.getElementById('calcMode').style.backgroundColor = 'red';
    } else {
        document.getElementById('calcMode').style.backgroundColor = '';
    }
}

function changeLocationMode() {
    remoteLocation = !remoteLocation;
    if (remoteLocation === true) {
        document.getElementById('location').style.backgroundColor = 'red';
    } else {
        document.getElementById('location').style.backgroundColor = '';
    }
}
