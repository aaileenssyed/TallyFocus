const maxTasks = 10;
const taskInputsDiv = document.getElementById("tasks");
const matrixTable = document.getElementById("matrix");
const resultsDiv = document.getElementById("results");

for(let i = 0; i < maxTasks; i++) {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = String.fromCharCode(65 + i) + " Task";
  input.id = 'task' + i;
  taskInputsDiv.appendChild(input);
  if ((i + 1) % 5 === 0) taskInputsDiv.appendChild(document.createElement("br"));
}

let tasks = [];
let comparisons = {};

function initializeMatrix() {
  tasks = [];
  comparisons = {};
  for(let i = 0; i < maxTasks; i++) {
    const val = document.getElementById('task' + i).value.trim();
    if (val) tasks.push(val);
  }
  if(tasks.length < 2) {
    alert("Enter at least 2 tasks to prioritize!");
    return;
  }
  buildMatrix();
  resultsDiv.innerHTML = "";
}

function buildMatrix() {
  matrixTable.innerHTML = '';
  const headerRow = document.createElement('tr');
  headerRow.appendChild(document.createElement('th'));
  tasks.forEach(task => {
    const th = document.createElement('th');
    th.textContent = task;
    headerRow.appendChild(th);
  });
  matrixTable.appendChild(headerRow);

  for(let i = 0; i < tasks.length; i++) {
    const row = document.createElement('tr');
    const headerCell = document.createElement('th');
    headerCell.textContent = tasks[i];
    row.appendChild(headerCell);

    for(let j = 0; j < tasks.length; j++) {
      const cell = document.createElement('td');
      if(i < j) {
        const key = `${i}-${j}`;
        cell.textContent = "?";
        cell.addEventListener('click', () => {
          if(!comparisons[key]) {
            comparisons[key] = i;
          } else if(comparisons[key] === i) {
            comparisons[key] = j;
          } else {
            delete comparisons[key];
          }
          renderMatrix();
          calculateResults();
        });
      } else if(i === j) {
        cell.style.backgroundColor = '#ddd';
      } else {
        const revKey = `${j}-${i}`;
        if(comparisons[revKey] === i) cell.textContent = "◀";
        else if(comparisons[revKey] === j) cell.textContent = "▶";
        else cell.textContent = "";
        cell.style.backgroundColor = '#f0f0f0';
      }
      row.appendChild(cell);
    }
    matrixTable.appendChild(row);
  }
}

function renderMatrix() {
  for(let i=0; i<tasks.length; i++) {
    for(let j=0; j<tasks.length; j++) {
      if(i < j) {
        const key = `${i}-${j}`;
        const cell = matrixTable.rows[i+1].cells[j+1];
        if(comparisons[key] === i) {
          cell.textContent = tasks[i];
          cell.classList.add('selected');
        } else if(comparisons[key] === j) {
          cell.textContent = tasks[j];
          cell.classList.add('selected');
        } else {
          cell.textContent = "?";
          cell.classList.remove('selected');
        }
      } else if(i > j) {
        const revKey = `${j}-${i}`;
        const cell = matrixTable.rows[i+1].cells[j+1];
        if(comparisons[revKey] === i) cell.textContent = "◀";
        else if(comparisons[revKey] === j) cell.textContent = "▶";
        else cell.textContent = "";
      }
    }
  }
}

function calculateResults() {
  const scores = new Array(tasks.length).fill(0);
  Object.entries(comparisons).forEach(([key, winner]) => {
    scores[winner]++;
  });
  const sorted = tasks.map((task, idx) => ({task, score: scores[idx]}))
    .sort((a,b) => b.score - a.score);
  resultsDiv.innerHTML = "<h2>Ranking Results</h2><ol>" + 
    sorted.map(item => `<li>${item.task} (${item.score} wins)</li>`).join('') + "</ol>";
}
