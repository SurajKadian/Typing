var text1 = document.getElementById("text1");
var text2 = document.getElementById("text2");
var submit = document.getElementById("submit");
var restart = document.getElementById("restart");
var outputDiv = document.getElementById("output-div");
var result = document.getElementById('result');
var output = document.getElementById("output");
var output2 = document.getElementById('detailedOutput');
var heading = document.querySelector('.top-bar h1');
var sidePanel = document.getElementById('side-panel');
var footerBtn = document.getElementById('footer-btn');
const timer = document.getElementById('timer');
let timerInterval;
let timeTotal = 600;
let timeLeft = 600;
var time = "Time left: ";
let timerStarted = false;
let submitButtonClicked = false;
let increaseTime = false;
let currentFontSize = 16;
let remainingTime = 0;
let hm = 70;
const palettes = ['palette1', 'palette2', 'palette3', 'palette4', 'palette5', 'palette6', 'palette7'];
let currentPaletteIndex = 0;

document.getElementById('palette-btn').addEventListener('click', () => {
    document.body.classList.remove(palettes[currentPaletteIndex]);
    currentPaletteIndex = (currentPaletteIndex + 1) % palettes.length;
    document.body.classList.add(palettes[currentPaletteIndex]);
});

document.getElementById('menu-btn').addEventListener('click', function () {
    sidePanel.style.display = (window.getComputedStyle(sidePanel).display === 'flex') ? 'none' : 'flex';
    if (!submitButtonClicked) { footerBtn.style.display = (sidePanel.style.display === 'flex') ? 'none' : 'flex'; }
});

function startTimer() {
    if (!timerStarted && !submitButtonClicked) {
        timerInterval = setInterval(updateTimer, 1000);
        timerStarted = true;
    }
}

text2.addEventListener('input', startTimer);

document.getElementById('edit-time').addEventListener('click', function () {
    if (!submitButtonClicked) {
        const newTime = window.prompt('Enter new time (mm:ss):', '10:00');
        if (newTime !== null) {
            const timerDisplay = document.getElementById('timer');
            timerDisplay.textContent = `Time: ${newTime}`;
            timeLeft = parseTimeToSeconds(newTime);
            timeTotal = parseTimeToSeconds(newTime);
        }
    }
});

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timer.textContent = `${time} ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (timeLeft === 0) {
        if (confirm("Time's up! Do you want to submit?")) {
            clearInterval(timerInterval);
            submit.click();
        } else {
            increaseTime = true;
            timeLeft = 1;
        }
    }
    else {
        if (!increaseTime) {
            timeLeft--;
            if (timeLeft < 240) {
                timer.style.color = 'red';
            }
        } else {
            timeLeft++;
            time = "Time Elapsed: ";
            timer.style.color = 'green';
            timer.style.fontWeight = 'semi-bold';
        }
    }
}

function parseTimeToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(':').map(parseFloat);
    return minutes * 60 + seconds;
}

document.getElementById('pause-btn').addEventListener('click', function () {
    const spanText = this.querySelector('span');
    if (timerStarted) {
        clearInterval(timerInterval);
        remainingTime = timeLeft;
        timerStarted = false;
        this.querySelector('img').setAttribute('src', 'img/resume.svg');
        spanText.textContent = 'Resume Timer';
    } else {
        startTimer();
        spanText.textContent = 'Pause Timer';
        this.querySelector('img').setAttribute('src', "img/pause.svg");
    }
});

function loadTextFile(fileUrl) {
    return fetch(fileUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

var providedTexts = {
    '1': 'text/CGL58.txt',
    '2': 'text/CGL61.txt',
    '3': 'text/CGL62.txt',
    '4': 'text/CGL64.txt',
    '5': 'text/CGL66.txt',
    '6': 'text/CHSL109.txt',
    '7': 'text/CHSL25.txt',
    '8': 'text/CHSL26.txt',
    '9': 'text/CHSL27.txt',
    '10': 'text/CHSL28.txt',
    '11': 'text/CHSL30.txt',
    '12': 'text/CHSL43.txt',
    '13': 'text/CHSL44.txt',
    '14': 'text/CHSL45.txt',
    '15': 'text/CHSL46.txt',
    '16': 'text/CHSL47.txt',
    '17': 'text/CHSL48.txt',
    '18': 'text/CHSL50.txt',
    '19': 'text/CHSL52.txt',
    '20': 'text/CHSL55.txt',
    '21': 'text/CHSL56.txt',
    '22': 'text/CHSL58.txt',
    '23': 'text/CHSL60.txt',
    '24': 'text/CHSL62.txt',
    '25': 'text/CHSL7PY.txt',
    '26': 'text/CHSL8PY.txt',
    '27': 'text/CapitalisationPractice.txt',
    '28': 'text/SpellingPractice.txt'
};

document.getElementById('up-btn').addEventListener('click', function () {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            text1.value = text;
        };
        reader.readAsText(file);
    }
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomText() {
    var dropdown = document.getElementById('text-selector');
    var numOptions = dropdown.options.length;
    var randomIndex = getRandomInt(0, numOptions - 1);
    dropdown.selectedIndex = randomIndex;
    var event = new Event('change');
    dropdown.dispatchEvent(event);
}

document.addEventListener('DOMContentLoaded', function () {
    randomText();
});

document.getElementById('text-selector').addEventListener('change', function () {
    var selectedFileName = this.value;
    var selectedFileUrl = providedTexts[selectedFileName];
    if (selectedFileUrl) {
        loadTextFile(selectedFileUrl)
            .then(content => {
                text1.value = content;
            });
    } else {
        text1.value = '';
    }
});

document.getElementById('fullscreen-btn').addEventListener('click', function () {
    const spanText = this.querySelector('span');
    if (document.fullscreenElement) {
        document.exitFullscreen();
        spanText.textContent = 'Full Screen';
        this.querySelector('img').setAttribute('src', "img/FL.svg");
    } else {
        document.documentElement.requestFullscreen();
        spanText.textContent = 'Exit Full Screen';
        this.querySelector('img').setAttribute('src', "img/eFL.svg");
    }
});

document.getElementById('tt-btn').addEventListener('click', () => {
    currentFontSize += 2;
    if (currentFontSize > 22) {
        currentFontSize = 16;
    }
    text1.style.fontSize = currentFontSize + 'px';
    text2.style.fontSize = currentFontSize + 'px';
});

for (var fileName in providedTexts) {
    var option = document.createElement('option');
    option.value = fileName;
    option.textContent = providedTexts[fileName].split('/').pop().split('.').slice(0, -1).join('.');
    document.getElementById('text-selector').appendChild(option);
}

function rearrangeLayout() {
    outputDiv.style.display = 'block';
    footerBtn.style.display = 'none';
    heading.textContent = 'Results';
    clearInterval(timerInterval);
    //document.getElementById('top-bar').style.background = 'transparent';
    document.getElementById('side-panel').style.display = 'none';
    document.getElementById('text-container').style.display = 'none';
}

function resetLayout() {
    outputDiv.style.display = 'none';
    document.getElementById('side-panel').style.display = 'flex';
    heading.textContent = 'Typing Test';
    document.getElementById('text-container').style.display = 'grid';
    text2.value = '';
    clearInterval(timerInterval);
    timeTotal = 600;
    timeLeft = 600;
    time = "Time left: ";
    timerStarted = false;
    increaseTime = false;
    submitButtonClicked = false;
    timer.textContent = `Time: 10:00`;
    randomText();
}

function errorsPercentage(fullMistakes, halfMistakes, totalWords) {
    if (!isNaN(fullMistakes) && !isNaN(halfMistakes) && !isNaN(totalWords)) {
        var errorsPercentage = ((fullMistakes + (halfMistakes / 2)) / totalWords) * 100;
        return errorsPercentage.toFixed(2);
    } else {
        return 'Could not calculate Error Percentage!';
    }
}

function ld(word1, word2) {
    var m = word1.length;
    var n = word2.length;
    var dp = [];

    for (var i = 0; i <= m; i++) {
        dp[i] = [];
        for (var j = 0; j <= n; j++) {
            if (i === 0) {
                dp[i][j] = j;
            } else if (j === 0) {
                dp[i][j] = i;
            } else if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }

    var distance = dp[m][n];
    var maxLength = Math.max(m, n);
    var similarityPercentage = ((maxLength - distance) / maxLength) * 100;

    return {
        distance: distance,
        similarityPercentage: similarityPercentage
    };
}

function lcs(text1, text2) {
    var m = text1.length;
    var n = text2.length;
    var output = '';
    var redWords = [];
    var orangeWords = [];
    var blueWords = [];

    var dp = [];
    for (var i = 0; i <= m; i++) {
        dp[i] = [];
        for (var j = 0; j <= n; j++) {
            dp[i][j] = -1;
        }
    }

    function lcsLength(i, j) {
        if (i === 0 || j === 0) {
            return 0;
        }

        if (dp[i][j] !== -1) {
            return dp[i][j];
        }

        if (text1[i - 1] === text2[j - 1]) {
            dp[i][j] = 1 + lcsLength(i - 1, j - 1);
        } else if (ld(text1[i - 1], text2[j - 1]).similarityPercentage >= hm
            && ld(text1[i - 1], text2[j - 1]).similarityPercentage < 100) {
            dp[i][j] = 0.5 + lcsLength(i - 1, j - 1);
        } else {
            dp[i][j] = Math.max(lcsLength(i - 1, j), lcsLength(i, j - 1));
        }

        return dp[i][j];
    }

    function constructLCS(i, j) {
        if (i === 0 && j === 0) {
            return '';
        } else if (i === 0) {
            redWords.push(text2[j - 1]);
            return '<span class="red">' + text2[j - 1] + '</span> ' + constructLCS(i, j - 1);
        } else if (j === 0) {
            orangeWords.push(text1[i - 1]);
            return '<span class="red orange">' + text1[i - 1] + '</span> ' + constructLCS(i - 1, j);
        } else if (text1[i - 1] === text2[j - 1]) {
            return constructLCS(i - 1, j - 1)
                + '<span>' + text1[i - 1] + '</span> ';
        } else if (ld(text1[i - 1], text2[j - 1]).similarityPercentage >= hm
            && ld(text1[i - 1], text2[j - 1]).similarityPercentage < 100) {
            blueWords.push('<span class="blue">' + text1[i - 1]
                + '<span class="green">{' + text2[j - 1] + '}</span></span>');
            return constructLCS(i - 1, j - 1)
                + '<span class="blue">' + text1[i - 1]
                + '<span class="green">{' + text2[j - 1] + '}</span></span> ';
        } else {
            if (lcsLength(i - 1, j) >= lcsLength(i, j - 1)) {
                orangeWords.push(text1[i - 1]);
                return constructLCS(i - 1, j)
                    + '<span class="red orange">' + text1[i - 1] + '</span> ';
            } else {
                redWords.push(text2[j - 1]);
                return constructLCS(i, j - 1)
                    + '<span class="red">' + text2[j - 1] + '</span> ';
            }
        }
    }

    output = constructLCS(m, n);

    return {
        output: output,
        redWords: redWords,
        orangeWords: orangeWords,
        blueWords: blueWords
    };
}

document.getElementById('restart2').addEventListener('click', function () { restart.click() });
restart.addEventListener('click', function () {
    resetLayout();
});

document.getElementById('submit2').addEventListener('click', function () { submit.click() });
submit.addEventListener('click', function () {
    const invisibleChar = '\u200B ';
    let inputText1 = invisibleChar + text1.value;
    let inputText2 = invisibleChar + text2.value;

    const considerComma = document.getElementById('considerComma').checked;
    const considerPeriod = document.getElementById('considerPeriod').checked;
    const considerCase = document.getElementById('considerCase').checked;
    const considerAllPunctuation = document.getElementById('considerAllPunctuation').checked;

    if (considerAllPunctuation) {

        if (!considerComma) {
            inputText1 = inputText1.replace(/,/g, '');
            inputText2 = inputText2.replace(/,/g, '');
        }

        if (!considerPeriod) {
            inputText1 = inputText1.replace(/\./g, '');
            inputText2 = inputText2.replace(/\./g, '');
        }
    } else {

        inputText1 = inputText1.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, '');
        inputText2 = inputText2.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, '');
    }

    if (!considerCase) {
        inputText1 = inputText1.toLowerCase();
        inputText2 = inputText2.toLowerCase();
    } var word1 = inputText1.trim().split(/\s+/);
    var word2 = inputText2.trim().split(/\s+/);
    var wordCount1 = word1.length;
    var wordCount2 = word2.length;
    var charCount1 = text1.value.length;
    var charCount2 = text2.value.length;
    var charWord1 = Math.round(charCount1 / 5);
    var charWord2 = Math.round(charCount2 / 5);
    rearrangeLayout();
    var L = lcs(word2, word1);
    var redWords = L.redWords.slice().reverse();
    var blueWords = L.blueWords.slice().reverse();
    var red = redWords.length;
    var orangeWords = L.orangeWords.slice().reverse();
    var orange = orangeWords.length;
    var blue = blueWords.length;
    var fm = red + orange;
    var error = errorsPercentage(fm, blue, wordCount1);

    if (!submitButtonClicked) {
        if (!increaseTime) {
            timeTotal = timeTotal - timeLeft;
        } else {
            timeTotal = timeTotal + timeLeft;
        }
    }

    if (wordCount2 > 1 && charCount2 > 1) {
        var wpm = Math.round(wordCount2 / (timeTotal / 60));
        var cpm = Math.round(charWord2 / (timeTotal / 60));
    } else {
        wpm = cpm = "0"
    }

    document.querySelector('#result').innerHTML = `
  <div class="results-grid">
  <div class="result-card"><span>Typing Speed:</span><strong>${wpm} WPM (${cpm})</strong></div>
  <div class="result-card"><span>Error:</span><strong>${error}%</strong></div>
  <div class="result-card"><span>Full Mistakes:</span><strong>${fm}</strong></div>
  <div class="result-card"><span>Half Mistakes:</span><strong>${blue}</strong></div>
  <div class="result-card"><span>Total Words:</span><strong>${wordCount1 + ' (' + charWord1 + ')'}</strong></div>
  <div class="result-card"><span>Words Typed:</span><strong>${wordCount2 + ' (' + charWord2 + ')'}</strong></div>
  <div class="result-card"><span>Time Taken:</span><strong>${Math.floor(timeTotal / 60)}:${(timeTotal % 60).toString().padStart(2, '0')}</strong></div>
  </div>
`;

    // output
    output.innerHTML = L.output + '<br>';
    submitButtonClicked = true;
});

const checkboxes = document.querySelectorAll('.checkbox-controls input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        submit.click();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', function (event) {
        if (event.shiftKey && event.key === 'Enter') {
            event.preventDefault();
            submit.click()
        }
        if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
            event.preventDefault();
            restart.click()
        }
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            document.getElementById('download-pdf').click()
        }
    });
});
