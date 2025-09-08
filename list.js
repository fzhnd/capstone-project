const LS_KEY = 'todoListApp';
let todoList = JSON.parse(localStorage.getItem(LS_KEY) || '[]');

const monthYearEl = document.getElementById('month-year');
const calendarGrid = document.getElementById('calendar-grid');
const tasksOnDate = document.getElementById('tasks-on-date');
const selectedDateLabel = document.getElementById('selected-date-label');

let currentDate = new Date();
let selectedDate = new Date().toISOString().split('T')[0];

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYearEl.textContent = currentDate.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  calendarGrid.innerHTML = '';
  for (let i = 0; i < firstDay; i++) {
    calendarGrid.appendChild(document.createElement('div'));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cell = document.createElement('div');
    cell.className = "flex flex-col items-center";

    const btn = document.createElement('button');
    btn.textContent = day;
    btn.className = "w-10 h-10 flex items-center justify-center rounded-full";
    if (dateStr === selectedDate) btn.classList.add("bg-pink-600", "text-white");
    else btn.classList.add("hover:bg-pink-200");

    btn.addEventListener('click', () => {
      selectedDate = dateStr;
      renderCalendar();
      showTasks(dateStr);
    });

    const dot = document.createElement('div');
    dot.className = "w-1.5 h-1.5 rounded-full mt-1";
    if (hasTaskOnDate(dateStr)) dot.classList.add("bg-pink-500");
    cell.appendChild(btn);
    cell.appendChild(dot);

    calendarGrid.appendChild(cell);
  }
}

function hasTaskOnDate(dateStr) {
  return uniqueTasks(todoList.filter(t => matchesDate(t, dateStr))).length > 0;
}

function matchesDate(task, dateStr) {
  const taskDate = new Date(task.date);
  const current = new Date(dateStr);

  if (current < taskDate) return false;
  if (task.completed && task.completedAt === dateStr) return false;

  if (task.date === dateStr) return true;
  if (task.repeat === 'daily') return current >= taskDate;
  if (task.repeat === 'weekly') {
    return current >= taskDate && taskDate.getDay() === current.getDay();
  }
  if (task.repeat === 'monthly') {
    return current >= taskDate && task.date.split('-')[2] === dateStr.split('-')[2];
  }
  if (task.repeat === 'yearly') {
    return current >= taskDate && task.date.slice(5) === dateStr.slice(5);
  }
  return false;
}

function getRepeatLabel(repeat) {
  switch (repeat) {
    case 'daily': return 'Harian';
    case 'weekly': return 'Mingguan';
    case 'monthly': return 'Bulanan';
    case 'yearly': return 'Tahunan';
    default: return '';
  }
}

function uniqueTasks(tasks) {
  const seen = new Set();
  return tasks.filter(t => {
    const key = `${t.task}-${t.repeat}-${t.time}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function showTasks(dateStr) {
  selectedDateLabel.textContent = dateStr;
  tasksOnDate.innerHTML = '';

  let tasks = todoList.filter(t => matchesDate(t, dateStr));
  tasks = uniqueTasks(tasks);

  if (dateStr === todayISO()) {
    const unfinished = tasks.filter(t => !(t.completed && t.completedAt === dateStr));
    if (unfinished.length === 0) {
      tasksOnDate.innerHTML = '<div class="text-gray-500">Semua tugas hari ini sudah selesai 🎉</div>';
      return;
    }
  }

  if (tasks.length === 0) {
    tasksOnDate.innerHTML = '<div class="text-gray-500">Tidak ada tugas</div>';
    return;
  }

  tasks.forEach(t => {
    const div = document.createElement('div');
    div.className = "bg-white border-2 border-pink-200 rounded-lg p-3 shadow";

    const isCompletedToday = t.completed && t.completedAt === dateStr;
    const taskName = isCompletedToday
      ? `<span class="line-through text-gray-400">${t.task}</span>`
      : t.task;

    div.innerHTML = `
      <div class="font-semibold">${taskName}</div>
      <div class="text-sm text-gray-500">
        ${t.time ? t.time : ''} ${t.repeat !== 'none' ? '🔁 ' + getRepeatLabel(t.repeat) : ''}
      </div>`;
    tasksOnDate.appendChild(div);
  });
}

document.getElementById('prev-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});
document.getElementById('next-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
showTasks(selectedDate);
