const clickSound = document.getElementById('clickSound');
function playClick() { clickSound.currentTime = 0; clickSound.play(); }

let tasks = [];
let pairs = [];
let currentPairIndex = 0;
let wins = [];

const numTasksInput = document.getElementById('num-tasks');
const setNumBtn = document.getElementById('set-num-btn');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksContainer = document.getElementById('tasks-container');
const startCompareBtn = document.getElementById('start-compare-btn');
const comparisonSection = document.getElementById('comparison');
const comparisonText = document.getElementById('comparison-text');
const choice1Btn = document.getElementById('choice1-btn');
const choice2Btn = document.getElementById('choice2-btn');
const progressText = document.getElementById('progress');
const resultsSection = document.getElementById('results');
const resultList = document.getElementById('result-list');
const confettiContainer = document.getElementById('confetti-container');
const celebrationSound = document.getElementById('celebration-sound');


function renderTaskInputs() {
  tasksContainer.innerHTML = '';
  tasks.forEach((task, i) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = task || '';
    input.placeholder = `Task ${i + 1}`;
    input.dataset.index = i;
    input.addEventListener('input', e => {
      tasks[e.target.dataset.index] = e.target.value.trim();
      checkStartReady();
    });
    tasksContainer.appendChild(input);
  });
}

function checkStartReady() {
  startCompareBtn.disabled = tasks.length < 2 || tasks.some(t => !t);
}

function createPairs() {
  pairs = [];
  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      pairs.push([i, j]);
    }
  }
}

function startComparisons() {
  wins = new Array(tasks.length).fill(0);
  currentPairIndex = 0;
  document.getElementById('task-entry').style.display = 'none';
  comparisonSection.style.display = 'block';
  resultsSection.style.display = 'none';
  showNextComparison();
}

function showNextComparison() {
  if (currentPairIndex >= pairs.length) {
    showResults();
    return;
  }
  const [i, j] = pairs[currentPairIndex];
  comparisonText.textContent = `Which is more important?`;
  choice1Btn.textContent = tasks[i];
  choice2Btn.textContent = tasks[j];
  progressText.textContent = `Match ${currentPairIndex + 1} of ${pairs.length}`;
}

function recordWin(winnerIndex) {
  playClick();
  wins[winnerIndex]++;
  currentPairIndex++;
  showNextComparison();
}

function showResults() {
  comparisonSection.style.display = 'none';
  resultsSection.style.display = 'block';
  const sortedTasks = tasks.map((task, i) => ({ task, wins: wins[i] }))
    .sort((a, b) => b.wins - a.wins);

  resultList.innerHTML = '';
  sortedTasks.forEach(({ task }) => {
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  const label = document.createElement('label');
  label.textContent = ` ${task}`;
  li.appendChild(checkbox);
  li.appendChild(label);
  resultList.appendChild(li);

  checkbox.addEventListener('change', () => {
    const allChecked = [...resultList.querySelectorAll('input[type="checkbox"]')]
      .every(cb => cb.checked);
    if (allChecked) launchConfetti();
  });
});

}

setNumBtn.addEventListener('click', () => {
  playClick();
  const num = Number(numTasksInput.value);
  if (num < 2 || num > 20) return alert('Enter 2–20 tasks!');
  tasks = Array(num).fill('');
  renderTaskInputs();
});

addTaskBtn.addEventListener('click', () => {
  playClick();
  if (tasks.length >= 20) return alert('Max 20 tasks.');
  tasks.push('');
  renderTaskInputs();
});

startCompareBtn.addEventListener('click', () => {
  playClick();
  if (tasks.some(t => !t)) return alert('Fill in all tasks!');
  createPairs();
  startComparisons();
});

choice1Btn.addEventListener('click', () => recordWin(pairs[currentPairIndex][0]));
choice2Btn.addEventListener('click', () => recordWin(pairs[currentPairIndex][1]));

// Gradient background that follows mouse movement
document.body.addEventListener('mousemove', e => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  const color1 = `hsl(${x * 360}, 70%, 85%)`;
  const color2 = `hsl(${y * 360}, 60%, 90%)`;
  document.body.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
});

tasks = Array(Number(numTasksInput.value)).fill('');
renderTaskInputs();

// Prettier confetti using canvas-confetti
function launchConfetti() {
  celebrationSound.currentTime = 0;
  celebrationSound.play();

  const duration = 2 * 1000; // 2 seconds
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 40, spread: 360, ticks: 70, zIndex: 1000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);
    confetti({
      particleCount,
      startVelocity: 35,
      spread: 70,
      origin: {
        x: randomInRange(0.1, 0.9),
        y: Math.random() - 0.2,
      },
      colors: ['#f999b6ff', '#94f98fff', '#fbd680ff', '#9e9cffff', '#84f9fdff']
    });
  }, 200);
}
