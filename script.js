const LS_KEY = 'todoListApp';
let todoList = [];
let deleteMode = false;
let editingId = null;

const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const timeInput = document.getElementById('time-input');
const repeatSelect = document.getElementById('repeat-select');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');

const sortSelect = document.getElementById('sort-select');
const toggleDeleteModeBtn = document.getElementById('toggle-delete-mode-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');
const deleteSelectedBtn = document.getElementById('delete-selected-btn');

const pastList = document.getElementById('past-list');
const todayList = document.getElementById('today-list');
const upcomingList = document.getElementById('upcoming-list');
const completedList = document.getElementById('completed-list');


const todayISO = () => new Date().toISOString().split('T')[0];
const genId = () => crypto.randomUUID();

function save() { localStorage.setItem(LS_KEY, JSON.stringify(todoList)); }
function load() { todoList = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }

function nextDate(dateStr, repeat) {
  const d = new Date(dateStr);
  if (repeat === 'daily') d.setDate(d.getDate() + 1);
  else if (repeat === 'weekly') d.setDate(d.getDate() + 7);
  else if (repeat === 'monthly') d.setMonth(d.getMonth() + 1);
  else if (repeat === 'yearly') d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split('T')[0];
}

function validateForm() {
  let valid = true;
  document.querySelectorAll(".error-msg").forEach(e => e.remove());

  if (!todoInput.value.trim()) {
    showError(todoInput, "Harap isi nama tugas.");
    valid = false;
  }
  if (!dateInput.value) {
    showError(dateInput, "Harap pilih tanggal.");
    valid = false;
  }
  return valid;
}

function showError(inputEl, msg) {
  const parent = inputEl.parentElement;
  const err = document.createElement('div');
  err.className = "error-msg text-red-500 text-sm mt-1";
  err.textContent = msg;
  parent.appendChild(err);
  setTimeout(() => err.remove(), 3000);
}

function addTodo() {
  if (!validateForm()) return;
  todoList.push({
    id: genId(),
    task: todoInput.value.trim(),
    date: dateInput.value,
    time: timeInput.value || '',
    repeat: repeatSelect.value || 'none',
    completed: false,
    completedAt: null
  });
  save();
  clearForm();
  render();
}

function startEdit(todo) {
  editingId = todo.id;
  todoInput.value = todo.task;
  dateInput.value = todo.date;
  timeInput.value = todo.time;
  repeatSelect.value = todo.repeat;

  addBtn.classList.add("hidden");
  saveBtn.classList.remove("hidden");
  todoInput.focus();
}

function saveEdit() {
  if (!validateForm()) return;
  const idx = todoList.findIndex(t => t.id === editingId);
  if (idx > -1) {
    todoList[idx].task = todoInput.value.trim();
    todoList[idx].date = dateInput.value;
    todoList[idx].time = timeInput.value || '';
    todoList[idx].repeat = repeatSelect.value || 'none';
  }
  save();
  clearForm();
  render();
  editingId = null;
  addBtn.classList.remove("hidden");
  saveBtn.classList.add("hidden");
}

function clearForm() {
  todoInput.value = '';
  dateInput.value = '';
  timeInput.value = '';
  repeatSelect.value = 'none';
}

function markCompleted(todo) {
  todo.completed = true;
  todo.completedAt = new Date().toISOString();
  if (todo.repeat !== 'none') {
    todoList.push({
      id: genId(),
      task: todo.task,
      date: nextDate(todo.date, todo.repeat),
      time: todo.time,
      repeat: todo.repeat,
      completed: false,
      completedAt: null
    });
  }
}

function toggleComplete(id) {
  const t = todoList.find(x => x.id === id);
  if (!t) return;
  if (!t.completed) markCompleted(t);
  else { t.completed = false; t.completedAt = null; }
  save();
  render();
}

function deleteSelected() {
  const checked = document.querySelectorAll('.select-checkbox:checked');
  if (checked.length === 0) {
    alert('Belum ada tugas yang dipilih.');
    return;
  }
  if (!confirm(`Hapus ${checked.length} tugas terpilih?`)) return;

  const ids = Array.from(checked).map(c => c.dataset.id);
  todoList = todoList.filter(t => !ids.includes(t.id));
  save();
  render();
}

function deleteAll() {
  if (!confirm('Hapus semua tugas?')) return;
  todoList = [];
  save();
  render();
}

function toggleDeleteMode() {
  deleteMode = !deleteMode;

  deleteAllBtn.classList.toggle('hidden', !deleteMode);
  deleteSelectedBtn.classList.toggle('hidden', !deleteMode);

  toggleDeleteModeBtn.textContent = deleteMode ? 'Batal' : '🗑️';
  render();
}

function createCard(todo) {
  const card = document.createElement('div');
  card.className =
    "flex items-center justify-between bg-white border-2 border-[#f5d5e0] " +
    "rounded-xl p-3 shadow transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg";

  const left = document.createElement('div');
  left.className = "flex items-center gap-3 flex-1";

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className =
    "w-7 h-7 flex items-center justify-center rounded-full border-2 cursor-pointer font-bold transition " +
    (todo.completed
      ? "bg-[#a6c8e0] text-white border-transparent"
      : "bg-[#c6e2fb] text-[#333] border-gray-300 hover:bg-[#b197d6]");
  toggle.innerHTML = todo.completed ? "✔️" : "";
  toggle.addEventListener('click', () => toggleComplete(todo.id));

  const body = document.createElement('div');
  body.className = "min-w-0";

  const titleRow = document.createElement('div');
  titleRow.className = "flex items-center gap-2";

  const title = document.createElement('span');
  title.className =
    "text-base truncate " + (todo.completed ? "line-through text-[#9aa0a6]" : "");
  title.textContent = todo.task;

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.textContent = "✏️";
  editBtn.addEventListener('click', () => startEdit(todo));

  titleRow.appendChild(title);
  titleRow.appendChild(editBtn);

  const meta = document.createElement('div');
  meta.className = "text-sm text-[#9aa0a6] mt-1";
  let metaTxt = "";
  if (todo.date) metaTxt += todo.date;
  if (todo.time) metaTxt += " " + todo.time;
  if (todo.repeat !== 'none') metaTxt += " 🔁";
  meta.textContent = metaTxt.trim();

  body.appendChild(titleRow);
  if (metaTxt) body.appendChild(meta);

  left.appendChild(toggle);
  left.appendChild(body);

  const right = document.createElement('div');
  right.className = "flex items-center justify-end gap-2 min-w-[60px]";

  if (deleteMode) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className =
        "select-checkbox w-4 h-4 cursor-pointer accent-[#9aa0a6]";
    checkbox.dataset.id = todo.id;
    right.appendChild(checkbox);
  }

  card.appendChild(left);
  card.appendChild(right);

  return card;
}

function render() {
  pastList.innerHTML = '';
  todayList.innerHTML = '';
  upcomingList.innerHTML = '';
  completedList.innerHTML = '';

  const today = todayISO();
  let list = [...todoList];

  switch (sortSelect.value) {
    case 'dueDate': list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
    case 'newest': list.sort((a, b) => b.id.localeCompare(a.id)); break;
    case 'oldest': list.sort((a, b) => a.id.localeCompare(b.id)); break;
    case 'az': list.sort((a, b) => a.task.localeCompare(b.task)); break;
    case 'za': list.sort((a, b) => b.task.localeCompare(a.task)); break;
  }

  list.forEach(t => {
    if (t.completed) {
      if (t.completedAt && t.completedAt.split('T')[0] === today) {
        completedList.appendChild(createCard(t));
      }
    } else {
      if (t.date < today) {
        pastList.appendChild(createCard(t));
      } else if (t.date === today) {
        todayList.appendChild(createCard(t));
      } else {
        upcomingList.appendChild(createCard(t));
      }
    }
  });

  if (!pastList.hasChildNodes()) pastList.innerHTML = '<div class="text-sm text-[#9aa0a6]">Tidak ada tugas sebelumnya</div>';
  if (!todayList.hasChildNodes()) todayList.innerHTML = '<div class="text-sm text-[#9aa0a6]">Tidak ada tugas hari ini</div>';
  if (!upcomingList.hasChildNodes()) upcomingList.innerHTML = '<div class="text-sm text-[#9aa0a6]">Tidak ada tugas mendatang</div>';
  if (!completedList.hasChildNodes()) completedList.innerHTML = '<div class="text-sm text-[#9aa0a6]">Belum ada tugas selesai hari ini</div>';
}

addBtn.addEventListener('click', addTodo);
saveBtn.addEventListener('click', saveEdit);
sortSelect.addEventListener('change', render);
toggleDeleteModeBtn.addEventListener('click', toggleDeleteMode);
deleteAllBtn.addEventListener('click', deleteAll);
deleteSelectedBtn.addEventListener('click', deleteSelected);

document.querySelectorAll('.section-title').forEach(title => {
  title.addEventListener('click', () => {
    const targetId = title.getAttribute('data-target');
    const list = document.getElementById(targetId);
    const icon = title.querySelector('.toggle-icon');

    list.classList.toggle('hidden');
    icon.textContent = list.classList.contains('hidden') ? '🔺' : '🔻';
  });
});

load();
render();
