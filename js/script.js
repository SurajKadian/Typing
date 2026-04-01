// ============================================================
// ELEMENTS
// ============================================================
var text1 = document.getElementById("text1");
var text2 = document.getElementById("text2");
var submit = document.getElementById("submit");
var restart = document.getElementById("restart");
var outputDiv = document.getElementById("output-div");
var result = document.getElementById('result');
var output = document.getElementById("output");
var heading = document.querySelector('.top-bar h1');
var sidePanel = document.getElementById('side-panel');
var footerBtn = document.getElementById('footer-btn');
const timer = document.getElementById('timer');

// ============================================================
// STATE
// ============================================================
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
let masterLoadedFromFile = false; // tracks whether text1 was loaded from a .txt file

// ============================================================
// PALETTE
// ============================================================
const palettes = ['palette1', 'palette2', 'palette3', 'palette4', 'palette5', 'palette6', 'palette7'];
let currentPaletteIndex = 0;

document.getElementById('palette-btn').addEventListener('click', () => {
    document.body.classList.remove(palettes[currentPaletteIndex]);
    currentPaletteIndex = (currentPaletteIndex + 1) % palettes.length;
    document.body.classList.add(palettes[currentPaletteIndex]);
});

// ============================================================
// SIDE PANEL / MENU
// ============================================================
document.getElementById('menu-btn').addEventListener('click', function () {
    sidePanel.style.display = (window.getComputedStyle(sidePanel).display === 'flex') ? 'none' : 'flex';
    if (!submitButtonClicked) {
        footerBtn.style.display = (sidePanel.style.display === 'flex') ? 'none' : 'flex';
    }
});

// ============================================================
// TIMER
// ============================================================
function startTimer() {
    if (!timerStarted && !submitButtonClicked) {
        timerInterval = setInterval(updateTimer, 1000);
        timerStarted = true;
    }
    document.getElementById('toggle-container').style.display = 'none';
}

text2.addEventListener('input', startTimer);

document.getElementById('edit-time').addEventListener('click', function () {
    if (!submitButtonClicked) {
        const newTime = window.prompt('Enter new time (mm:ss):', '10:00');
        if (newTime !== null) {
            timer.textContent = `Time: ${newTime}`;
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
    } else {
        if (!increaseTime) {
            timeLeft--;
            if (timeLeft < 240) timer.style.color = 'red';
        } else {
            timeLeft++;
            time = "Time Elapsed: ";
            timer.style.color = 'green';
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
        this.querySelector('img').setAttribute('src', 'img/pause.svg');
    }
});

// ============================================================
// TEXT FILES
// ============================================================
var providedTexts = {
    '1': 'text/f001.html',   '2': 'text/CGL61.txt',   '3': 'text/CGL62.txt',
    '4': 'text/CGL64.txt',   '5': 'text/CGL66.txt',   '6': 'text/CHSL109.txt',
    '7': 'text/CHSL25.txt',  '8': 'text/CHSL26.txt',  '9': 'text/CHSL27.txt',
    '10': 'text/CHSL28.txt', '11': 'text/CHSL30.txt', '12': 'text/CHSL43.txt',
    '13': 'text/CHSL44.txt', '14': 'text/CHSL45.txt', '15': 'text/CHSL46.txt',
    '16': 'text/CHSL47.txt', '17': 'text/CHSL48.txt', '18': 'text/CHSL50.txt',
    '19': 'text/CHSL52.txt', '20': 'text/CHSL55.txt', '21': 'text/CHSL56.txt',
    '22': 'text/CHSL58.txt', '23': 'text/CHSL60.txt', '24': 'text/CHSL62.txt',
    '25': 'text/CHSL7PY.txt','26': 'text/CHSL8PY.txt',
    '27': 'text/CapitalisationPractice.txt',
    '28': 'text/SpellingPractice.txt','29': 'text/CGL58.txt'
};

for (var fileName in providedTexts) {
    var option = document.createElement('option');
    option.value = fileName;
    option.textContent = providedTexts[fileName].split('/').pop().split('.').slice(0, -1).join('.');
    document.getElementById('text-selector').appendChild(option);
}

function loadTextFile(fileUrl) {
    return fetch(fileUrl)
        .then(r => { if (!r.ok) throw new Error('Failed to load'); return r.text(); })
        .catch(err => console.error('Fetch error:', err));
}

document.getElementById('text-selector').addEventListener('change', function () {
    var url = providedTexts[this.value];
    if (url) {
        loadTextFile(url).then(content => {
            text1.innerHTML = content;

        });
    } else {
        text1.innerHTML = '';

    }
});

// Upload .txt file button
document.getElementById('up-btn').addEventListener('click', function () {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            text1.innerHTML = e.target.result;
        };
        reader.readAsText(file);
    }
});

// When user manually edits text1, treat as rich (format checking enabled)
text1.addEventListener('input', function () {
});

// ============================================================
// RANDOM TEXT
// ============================================================
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomText() {
    var dropdown = document.getElementById('text-selector');
    var randomIndex = getRandomInt(0, dropdown.options.length - 1);
    dropdown.selectedIndex = randomIndex;
    dropdown.dispatchEvent(new Event('change'));
}

// ============================================================
// LAYOUT HELPERS
// ============================================================
document.getElementById('tt-btn').addEventListener('click', () => {
    currentFontSize += 2;
    if (currentFontSize > 22) currentFontSize = 16;
    text1.style.fontSize = currentFontSize + 'px';
    text2.style.fontSize = currentFontSize + 'px';
});

document.getElementById('fullscreen-btn').addEventListener('click', function () {
    const spanText = this.querySelector('span');
    if (document.fullscreenElement) {
        document.exitFullscreen();
        spanText.textContent = 'Full Screen';
        this.querySelector('img').setAttribute('src', 'img/FL.svg');
    } else {
        document.documentElement.requestFullscreen();
        spanText.textContent = 'Exit Full Screen';
        this.querySelector('img').setAttribute('src', 'img/eFL.svg');
    }
});

function rearrangeLayout() {
    outputDiv.style.display = 'block';
    footerBtn.style.display = 'none';
    heading.textContent = 'Results';
    clearInterval(timerInterval);
    document.getElementById('side-panel').style.display = 'none';
    document.getElementById('text-container').style.display = 'none';
    document.getElementById('text1').style.display = 'none';
    document.getElementById('text2').style.display = 'none';
}

function resetLayout() {
    outputDiv.style.display = 'none';
    heading.textContent = 'Typing Test';
    document.getElementById('text-container').style.display = 'grid';
}

function resetText() {
    text2.innerText = '';
    clearInterval(timerInterval);
    timeTotal = 600;
    timeLeft = 600;
    time = "Time left: ";
    timerStarted = false;
    increaseTime = false;
    submitButtonClicked = false;
    timer.textContent = `Time: 10:00`;
    masterLoadedFromFile = false;
    randomText();
}

document.getElementById('edit-text').addEventListener('click', () => resetLayout());
document.getElementById('restart2').addEventListener('click', () => restart.click());
restart.addEventListener('click', function () {
    resetLayout();
    resetText();
});

// ============================================================
// FORMATTING KEYBOARD SHORTCUTS (text2 only)
// ============================================================
document.getElementById('text2').addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'l') { e.preventDefault(); document.execCommand('justifyLeft'); }
        if (e.key === 'e') { e.preventDefault(); document.execCommand('justifyCenter'); }
        if (e.key === 'r') { e.preventDefault(); document.execCommand('justifyRight'); }
        if (e.key === 'j') { e.preventDefault(); document.execCommand('justifyFull'); }
        // Ctrl+B (bold), Ctrl+I (italic), Ctrl+U (underline) work natively in contenteditable
    }
});

// ============================================================
// FORMATTING HELPERS
// ============================================================

/**
 * Walks a contenteditable div and returns an array of
 * { word, bold, italic, underline, align } for every word.
 */
function getFormattedWords(editorDiv) {
    const words = [];

    function getStyleAt(node) {
        let bold = false, italic = false, underline = false, align = 'left';
        let el = node.nodeType === 3 ? node.parentElement : node;

        while (el && el !== editorDiv) {
            const tag = el.tagName;
            const style = window.getComputedStyle(el);

            if (tag === 'B' || tag === 'STRONG' || parseInt(style.fontWeight) >= 700) bold = true;
            if (tag === 'I' || tag === 'EM' || style.fontStyle === 'italic') italic = true;
            if (tag === 'U' || style.textDecorationLine.includes('underline')) underline = true;

            const ta = style.textAlign;
            if (ta && ta !== 'start') align = ta;

            el = el.parentElement;
        }
        return { bold, italic, underline, align };
    }

    function walk(node) {
        if (node.nodeType === 3) {
            const style = getStyleAt(node);
            node.textContent.split(/\s+/).filter(w => w.length > 0)
                .forEach(w => words.push({ word: w, ...style }));
        } else {
            node.childNodes.forEach(walk);
        }
    }

    walk(editorDiv);
    return words;
}

/**
 * Returns true if two word format objects match.
 */
function formatsMatch(f1, f2) {
    if (!f1 || !f2) return true; // if either is missing, don't penalise
    return f1.bold === f2.bold &&
           f1.italic === f2.italic &&
           f1.underline === f2.underline &&
           f1.align === f2.align;
}

/**
 * Describes expected format as a short string e.g. "bold+italic"
 */
function describeFormat(f) {
    if (!f) return 'normal';
    const parts = [];
    if (f.bold) parts.push('bold');
    if (f.italic) parts.push('italic');
    if (f.underline) parts.push('underline');
    if (f.align && f.align !== 'left') parts.push(f.align);
    return parts.length ? parts.join('+') : 'normal';
}

/**
 * Strips punctuation/case from a plain word string based on checkbox settings.
 */
function applyChecks(word, considerComma, considerPeriod, considerCase, considerAllPunctuation) {
    if (!considerAllPunctuation) word = word.replace(/[!"#$%&'()*+\-/:;<=>?@[\\\]^_`{|}~]/g, '');
    if (!considerComma)          word = word.replace(/,/g, '');
    if (!considerPeriod)         word = word.replace(/\./g, '');
    if (!considerCase)           word = word.toLowerCase();
    return word;
}

// ============================================================
// ERROR PERCENTAGE
// ============================================================
function errorsPercentage(fullMistakes, halfMistakes, totalWords) {
    if (!isNaN(fullMistakes) && !isNaN(halfMistakes) && !isNaN(totalWords)) {
        return (((fullMistakes + (halfMistakes / 2)) / totalWords) * 100).toFixed(2);
    }
    return 'Could not calculate Error Percentage!';
}

// ============================================================
// LEVENSHTEIN DISTANCE
// ============================================================
function ld(word1, word2) {
    var m = word1.length, n = word2.length;
    var dp = [];
    for (var i = 0; i <= m; i++) {
        dp[i] = [];
        for (var j = 0; j <= n; j++) {
            if (i === 0) dp[i][j] = j;
            else if (j === 0) dp[i][j] = i;
            else if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    var distance = dp[m][n];
    var maxLength = Math.max(m, n);
    return {
        distance,
        similarityPercentage: ((maxLength - distance) / maxLength) * 100
    };
}

// ============================================================
// LCS — CORE COMPARISON
// fmt1 = typed word formats, fmt2 = master word formats
// Pass null for both when format checking is disabled (txt files)
// ============================================================
function lcs(text1, text2, fmt1, fmt2) {
    var m = text1.length, n = text2.length;
    var output = '';
    var redWords = [], orangeWords = [], blueWords = [];
    var checkFormats = fmt1 !== null && fmt2 !== null;

    var dp = [];
    for (var i = 0; i <= m; i++) {
        dp[i] = [];
        for (var j = 0; j <= n; j++) dp[i][j] = -1;
    }

    function lcsLength(i, j) {
        if (i === 0 || j === 0) return 0;
        if (dp[i][j] !== -1) return dp[i][j];

        if (text1[i - 1] === text2[j - 1]) {
            dp[i][j] = 1 + lcsLength(i - 1, j - 1);
        } else if (ld(text1[i - 1], text2[j - 1]).similarityPercentage >= hm &&
                   ld(text1[i - 1], text2[j - 1]).similarityPercentage < 100) {
            dp[i][j] = 0.5 + lcsLength(i - 1, j - 1);
        } else {
            dp[i][j] = Math.max(lcsLength(i - 1, j), lcsLength(i, j - 1));
        }
        return dp[i][j];
    }

    function constructLCS(i, j) {
        if (i === 0 && j === 0) return '';

        if (i === 0) {
            // Word in master not found in typed → full mistake (red)
            redWords.push(text2[j - 1]);
            return '<span class="red">' + text2[j - 1] + '</span> ' + constructLCS(i, j - 1);
        }

        if (j === 0) {
            // Word typed that isn't in master → full mistake (orange)
            orangeWords.push(text1[i - 1]);
            return '<span class="red orange">' + text1[i - 1] + '</span> ' + constructLCS(i - 1, j);
        }

        if (text1[i - 1] === text2[j - 1]) {
            // Spelling matches — now check formatting (if enabled)
            if (checkFormats) {
                const tFmt = fmt1[j - 1]; // typed word format
                const mFmt = fmt2[i - 1]; // master word format
                if (!formatsMatch(mFmt, tFmt)) {
                    // Correct spelling, wrong format → half mistake (blue)
                    const expected = describeFormat(mFmt);
                    blueWords.push(text1[i - 1]);
                    return constructLCS(i - 1, j - 1)
                        + `<span class="blue">${text1[i - 1]}<span class="green">{${expected}}</span></span> `;
                }
            }
            // Fully correct
            return constructLCS(i - 1, j - 1) + '<span>' + text1[i - 1] + '</span> ';

        } else if (ld(text1[i - 1], text2[j - 1]).similarityPercentage >= hm &&
                   ld(text1[i - 1], text2[j - 1]).similarityPercentage < 100) {
            // Near-match spelling → half mistake (blue)
            blueWords.push('<span class="blue">' + text1[i - 1] +
                '<span class="green">{' + text2[j - 1] + '}</span></span>');
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
    return { output, redWords, orangeWords, blueWords };
}

// ============================================================
// SUBMIT
// ============================================================
document.getElementById('submit2').addEventListener('click', () => submit.click());

submit.addEventListener('click', function () {
    rearrangeLayout();

    // Read checkbox settings
    const considerComma            = document.getElementById('considerComma').checked;
    const considerPeriod           = document.getElementById('considerPeriod').checked;
    const considerCase             = document.getElementById('considerCase').checked;
    const considerAllPunctuation   = document.getElementById('considerAllPunctuation').checked;

    // Get formatted word arrays from both divs
    const masterWordsRaw = getFormattedWords(text1);
    const typedWordsRaw  = getFormattedWords(text2);

    // Apply punctuation/case settings to plain word strings
    const masterPlainWords = masterWordsRaw
        .map(w => applyChecks(w.word, considerComma, considerPeriod, considerCase, considerAllPunctuation))
        .filter(w => w.length > 0);

    const typedPlainWords = typedWordsRaw
        .map(w => applyChecks(w.word, considerComma, considerPeriod, considerCase, considerAllPunctuation))
        .filter(w => w.length > 0);

    // Format arrays — null if loaded from file (format checking disabled)
    const masterFmts = masterLoadedFromFile ? null : masterWordsRaw.map(w => ({ bold: w.bold, italic: w.italic, underline: w.underline, align: w.align }));
    const typedFmts  = masterLoadedFromFile ? null : typedWordsRaw.map(w =>  ({ bold: w.bold, italic: w.italic, underline: w.underline, align: w.align }));

    // Run comparison
    // lcs(typed, master, typedFmts, masterFmts)
    var L = lcs(typedPlainWords, masterPlainWords, typedFmts, masterFmts);

    var redWords    = L.redWords.slice().reverse();
    var orangeWords = L.orangeWords.slice().reverse();
    var blueWords   = L.blueWords.slice().reverse();
    var red    = redWords.length;
    var orange = orangeWords.length;
    var blue   = blueWords.length;
    var fm     = red + orange;

    // Word / char counts (use raw innerText for stats)
    var wordCount1 = masterPlainWords.length;
    var wordCount2 = typedPlainWords.length;
    var charCount1 = text1.innerText.length;
    var charCount2 = text2.innerText.length;
    var charWord1  = Math.round(charCount1 / 5);
    var charWord2  = Math.round(charCount2 / 5);

    var error = errorsPercentage(fm, blue, wordCount1);

    // Time
    if (!submitButtonClicked) {
        timeTotal = increaseTime ? timeTotal + timeLeft : timeTotal - timeLeft;
    }

    var wpm, cpm;
    if (wordCount2 > 1 && charCount2 > 1) {
        wpm = Math.round(wordCount2 / (timeTotal / 60));
        cpm = Math.round(charWord2  / (timeTotal / 60));
    } else {
        wpm = cpm = "0";
    }

    // Results display
    const formatNote = masterLoadedFromFile
        ? '<div class="result-card"><span>Format Check:</span><strong>Disabled (plain text)</strong></div>'
        : '';

    document.querySelector('#result').innerHTML = `
        <div class="results-grid">
            <div class="result-card"><span>Typing Speed:</span><strong>${wpm} WPM (${cpm})</strong></div>
            <div class="result-card"><span>Error:</span><strong>${error}%</strong></div>
            <div class="result-card"><span>Full Mistakes:</span><strong>${fm}</strong></div>
            <div class="result-card"><span>Half Mistakes:</span><strong>${blue}</strong></div>
            <div class="result-card"><span>Total Words:</span><strong>${wordCount1} (${charWord1})</strong></div>
            <div class="result-card"><span>Words Typed:</span><strong>${wordCount2} (${charWord2})</strong></div>
            <div class="result-card"><span>Time Taken:</span><strong>${Math.floor(timeTotal / 60)}:${(timeTotal % 60).toString().padStart(2, '0')}</strong></div>
            ${formatNote}
        </div>`;

    output.innerHTML = L.output + '<br>';
    submitButtonClicked = true;
});

// ============================================================
// CHECKBOXES — re-run on change
// ============================================================
document.querySelectorAll('.checkbox-controls input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => submit.click());
});

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    randomText();
    document.addEventListener('keydown', function (event) {
        if (event.shiftKey && event.key === 'Enter') {
            event.preventDefault();
            submit.click();
        }
        if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
            event.preventDefault();
            restart.click();
        }
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            document.getElementById('download-pdf').click();
        }
    });
});
