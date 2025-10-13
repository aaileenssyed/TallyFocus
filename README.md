# TallyFocus
A decision-aid webapp that helps users rank tasks when they feel overwhelmed.

Instead of forcing users to rate or drag items, it asks simple binary questions like:

“Which is more important right now: Do laundry or Finish report?”

It then:
Builds priority scores using tally marks (each time a task wins a comparison).
Generates a ranked to-do list based on scores.
(Optional) Lets you add estimated times and start timers for tasks.

🧩 Core Features
Stage	Feature	Description
1️⃣ Input	Task Entry	Add tasks manually (simple text list).
2️⃣ Compare	Pairwise Decisions	App randomly shows two tasks → you choose one.
3️⃣ Tally	Auto Count	Each task gets +1 every time it “wins.”
4️⃣ Result	Sorted To-Do List	App ranks tasks by tally score (highest first).
5️⃣ Optional	Time & Timer	Add estimated time per task and run a countdown timer.

⚙️ Technical Plan
We can build this in React + TailwindCSS (lightweight and fast).
Here’s how we could structure it:

Components
TaskInput → Add, edit, delete tasks.
CompareTasks → Show two random tasks to choose from.
ResultsList → Sorted final list with tallies.
TimerSection (optional) → Add time & countdown per task.

Logic Flow
flowchart TD
A[Enter Tasks] --> B[Pairwise Comparisons]
B --> C[User Chooses One]
C --> D[Update Tally]
D --> E[Repeat until enough comparisons]
E --> F[Generate Ranked List]
F --> G[Option to Add Time + Start Timer]

🧮 Simple Algorithm (Pairwise Tally System)
// tasks = [{ name: "Task 1", tally: 0 }, ...]
function recordChoice(winnerIndex) {
  tasks[winnerIndex].tally++;
}

// After comparisons:
const rankedTasks = tasks.sort((a, b) => b.tally - a.tally);

We can also include a comparison limit, e.g. each pair shown once or random until the user stops.

🧠 Future Enhancements
Save state in localStorage (so you can resume later).
“Focus Mode” → timer view only.
Visualization (triangle grid or heatmap of tallies).

Export as text or CSV.
