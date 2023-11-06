// Variables
const typingBox = document.getElementById("typingBox");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const wpmDisplay = document.getElementById("wpmDisplay");
const cpmDisplay = document.getElementById("cpmDisplay");
const timeDisplay = document.getElementById("timeDisplay");
const shareBtn = document.getElementById("shareBtn");
const resultsTable = document.getElementById("resultsTable");

let time = 0;
let timer = null;
let isStarted = false;
let currentText = "";
let typedText = "";
let wpm = 0;
let cpm = 0;


// Functions
function getRandomText() {
  const url = "https://baconipsum.com/api/?type=all-meat&sentences=5";
  fetch(url)
    .then(response => response.json())
    .then(data => {
      currentText = data[0];
      typingBoxFetch.value = currentText.toLowerCase();
    })
    .catch(error => console.log(error));
}

function calculateCPM(text) {
  const charactersTyped = text.length;
  const minutesElapsed = time / 60;
  const cpm = Math.round(charactersTyped / minutesElapsed);
  return cpm;
}

function calculateWPM(text) {
  const wordsTyped = text.trim().split(" ").length;
  const minutesElapsed = time / 60;
  const wordCount = wordsTyped;
  const averageWordLength = text.length / wordCount;
  const wpm = Math.round(wordCount / minutesElapsed);
  return wpm;
}

typingBox.addEventListener("input", function() {
  typedText = typingBox.value;
  cpm = calculateCPM(typedText);
  wpm = calculateWPM(typedText);
  cpmDisplay.textContent = `CPM: ${isFinite(cpm) ? cpm : 0}`;
  wpmDisplay.textContent = `WPM: ${isFinite(wpm) ? wpm : 0}`;
});


function updateResultsTable() {
  resultsTable.innerHTML = "";
  const results = JSON.parse(localStorage.getItem("results"));
  if (results) {
    const numRows = Math.min(results.length, 10);
    const startIndex = results.length - numRows;
    for (let i = startIndex; i < results.length; i++) {
      const row = `
        <tr>
          <td>${i + 1}</td>
          <td>${results[i].date}</td>
          <td>${results[i].wpm}</td>
          <td>${results[i].cpm}</td>
        </tr>
      `;
      resultsTable.innerHTML += row;
    }
  }
}

function saveResults() {
  const results = JSON.parse(localStorage.getItem("results")) || [];
  const date = new Date().toLocaleString();
  const result = {
    date: date,
    wpm: wpm,
    cpm: cpm
  };
  results.push(result);
  localStorage.setItem("results", JSON.stringify(results));
  updateResultsTable();
}

function startTimer() {
  timer = setInterval(() => {
    time++;
    timeDisplay.innerText = `Time: ${time}`;
    if (time === 60) {
      clearInterval(timer);
      isStarted = false;
      time = 0;
      if (typedText.length > 0) {
        wpm = Math.round(typedText.length / 5);
        cpm = Math.round(typedText.length);
        wpmDisplay.innerText = `WPM: ${wpm}`;
        cpmDisplay.innerText = `CPM: ${cpm}`;
        saveResults();
        shareBtn.style.display = "block";
      } else {
        wpmDisplay.innerText = `WPM: 0`;
        cpmDisplay.innerText = `CPM: 0`;
      }
    }
  }, 1000);
}


// Event Listeners
startBtn.addEventListener("click", () => {
  if (!isStarted) {
    isStarted = true;
    typedText = "";
    wpm = 0;
    cpm = 0;
    wpmDisplay.innerText = "WPM: 0";
    cpmDisplay.innerText = "CPM: 0";
    timeDisplay.innerText = "Time: 0";
    shareBtn.style.display = "none";
    getRandomText();
    typingBox.removeAttribute("readonly");
    typingBox.focus();
    startTimer();
  }
});

resetBtn.addEventListener("click", () => {
  localStorage.clear();
  updateResultsTable();
});

shareBtn.addEventListener("click", () => {
  const url = "https://wa.me/?text=";
  const text = `Check out my typing test results! I got ${wpm} WPM and ${cpm} CPM. Try it out for yourself!`;
  window.open(`${url}${encodeURIComponent(text)}`, "_blank");
});



