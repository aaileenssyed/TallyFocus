// State
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

// Helper - render task input boxes according to tasks array
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
  checkStartReady();
}

// Enable start button only if all tasks have text
function checkStartReady() {
  startCompareBtn.disabled = tasks.length < 2 || tasks.some(t => !t);
}

// Create all pairs from tasks indices
function createPairs() {
  pairs = [];
  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      pairs.push([i, j]);
    }
  }
}

// Start comparisons
function startComparisons() {
  wins = new Array(tasks.length).fill(0);
  currentPairIndex = 0;
  document.getElementById('task-entry').style.display = 'none';
  comparisonSection.style.display = 'block';
  resultsSection.style.display = 'none';
  showNextComparison();
}

// Show current comparison question
function showNextComparison() {
  if (currentPairIndex >= pairs.length) {
    showResults();
    return;
  }
  const [i, j] = pairs[currentPairIndex];
  comparisonText.textContent = `Which is more important?`;
  choice1Btn.textContent = tasks[i];
  choice2Btn.textContent = tasks[j];
  progressText.textContent = `Comparison ${currentPairIndex + 1} of ${pairs.length}`;
}

// Record win and advance
function recordWin(winnerIndex) {
  wins[winnerIndex]++;
  currentPairIndex++;
  showNextComparison();
}

// Display final task checklist ordered by wins descending
function showResults() {
  comparisonSection.style.display = 'none';
  resultsSection.style.display = 'block';
  const sortedTasks = tasks.map((task, i) => ({ task, wins: wins[i] }))
    .sort((a, b) => b.wins - a.wins);

  resultList.innerHTML = '';
  sortedTasks.forEach(({ task }, i) => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `task-checkbox-${i}`;
    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = task;
    li.appendChild(checkbox);
    li.appendChild(label);
    resultList.appendChild(li);
  });
}

// Event listeners
setNumBtn.addEventListener('click', () => {
  const num = Number(numTasksInput.value);
  if (num < 2 || num > 20) {
    alert('Please enter a number between 2 and 20');
    return;
  }
  tasks = Array(num).fill('');
  renderTaskInputs();
});

addTaskBtn.addEventListener('click', () => {
  if (tasks.length >= 20) {
    alert('Maximum 20 tasks allowed');
    return;
  }
  tasks.push('');
  renderTaskInputs();
});

startCompareBtn.addEventListener('click', () => {
  if (tasks.some(t => !t)) {
    alert('Please fill in all task fields');
    return;
  }
  createPairs();
  startComparisons();
});

choice1Btn.addEventListener('click', () => {
  const [i, ] = pairs[currentPairIndex];
  recordWin(i);
});

choice2Btn.addEventListener('click', () => {
  const [, j] = pairs[currentPairIndex];
  recordWin(j);
});

// Initialize with default tasks count and inputs
tasks = Array(Number(numTasksInput.value)).fill('');
renderTaskInputs();
