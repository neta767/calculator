let displayHistory = true;
let scientificMode = true;
let remoteLocation = false;
const fonts = document.querySelectorAll('option');
let theme = 'light';
let color: string;
let font: string;


document.addEventListener("DOMContentLoaded", () => {
    const queryString = window.location.search;
    if (queryString != '') {
        const urlParams = new URLSearchParams(queryString);
        console.log(urlParams);
        color = urlParams.get('color');
        font = urlParams.get('font');
        theme = urlParams.get('theme');
        console.log(color, font, theme);
        document.body.style.backgroundColor = color;
        document.body.style.fontFamily = font;
        if (theme == 'dark') {
            document.body.classList.add("dark-mode")
        } else {
            document.body.classList.remove("dark-mode")

        }
    }
    if (fonts != null) {
        for (const font of fonts) {
            font.style.fontFamily = font.value.toLowerCase();
        }
    }
});

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
    // reset();
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
