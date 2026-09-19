const STORAGE_KEY = "kelasin-data-v1";

const defaultData = {
  assignments: [
    { id: 1, subject: "Dasar Pemrograman", title: "C Assignment 01", dueDate: "2026-09-21", done: false },
    { id: 2, subject: "Bahasa Indonesia", title: "Ringkasan materi", dueDate: "2026-09-23", done: false },
    { id: 3, subject: "Kalkulus", title: "Latihan limit", dueDate: "2026-09-19", done: true }
  ],
  schedule: [
    { id: 1, day: "Monday", subject: "Dasar Pemrograman", time: "09:00", end: "10:40", room: "Lab 2" },
    { id: 2, day: "Monday", subject: "Pancasila", time: "13:00", end: "14:40", room: "R. 3.2" },
    { id: 3, day: "Tuesday", subject: "Kalkulus", time: "09:00", end: "10:40", room: "R. 2.1" },
    { id: 4, day: "Wednesday", subject: "Bahasa Indonesia", time: "10:00", end: "11:40", room: "R. 3.1" },
    { id: 5, day: "Thursday", subject: "Critical Thinking", time: "13:00", end: "14:40", room: "R. 2.4" }
  ]
};

let data = loadData();
let currentSection = "dashboard";

const page = document.getElementById("page");
const sidebar = document.getElementById("sidebar");
const themeButton = document.getElementById("themeButton");
const menuButton = document.getElementById("menuButton");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalForm = document.getElementById("modalForm");
const modalClose = document.getElementById("modalClose");

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : structuredClone(defaultData);
  } catch (error) {
    console.warn("Could not load saved data.", error);
    return structuredClone(defaultData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getNextClass() {
  const day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
  const todayClasses = data.schedule.filter(item => item.day === day).sort((a, b) => a.time.localeCompare(b.time));
  if (todayClasses.length) {
    const now = new Date();
    const current = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return todayClasses.find(item => item.time >= current) || todayClasses[0];
  }
  return [...data.schedule].sort((a, b) => a.time.localeCompare(b.time))[0] || null;
}

function render() {
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.section === currentSection));

  if (currentSection === "dashboard") renderDashboard();
  if (currentSection === "schedule") renderSchedule();
  if (currentSection === "assignments") renderAssignments();
}

function renderDashboard() {
  const pending = data.assignments.filter(item => !item.done).length;
  const nextClass = getNextClass();
  const upcoming = [...data.assignments]
    .filter(item => !item.done)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  page.innerHTML = `
    <section class="hero">
      <div>
        <p class="eyebrow">Teknik Informatika 2026 B</p>
        <h1>${getGreeting()}, Mikael.</h1>
        <p class="hero-copy">A small place to keep your class life together.</p>
      </div>
      <button class="primary-button" data-action="add-assignment"><i class="icon icon-plus"></i> Add assignment</button>
    </section>

    <section class="grid stats">
      <article class="card stat-card">
        <div class="label">Classes today</div>
        <div class="value">${countTodayClasses()}</div>
        <div class="hint">based on your saved schedule</div>
      </article>
      <article class="card stat-card">
        <div class="label">Pending assignments</div>
        <div class="value">${pending}</div>
        <div class="hint">${pending === 0 ? "Nothing waiting." : "Keep an eye on the deadlines."}</div>
      </article>
      <article class="card stat-card">
        <div class="label">Next class</div>
        <div class="value">${nextClass ? nextClass.time : "—"}</div>
        <div class="hint">${nextClass ? nextClass.subject : "No schedule yet"}</div>
      </article>
    </section>

    <section class="grid content-grid">
      <article class="card">
        <div class="section-heading">
          <h2>Today</h2>
          <button class="link-button" data-section-link="schedule">View schedule</button>
        </div>
        ${renderTodayList()}
      </article>
      <article class="card">
        <div class="section-heading">
          <h2>Upcoming work</h2>
          <button class="link-button" data-section-link="assignments">View all</button>
        </div>
        ${upcoming.length ? `<div class="list">${upcoming.map(renderAssignmentItem).join("")}</div>` : emptyState("You're all caught up.", "No pending assignments right now.")}
      </article>
    </section>
  `;
}

function countTodayClasses() {
  const day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
  return data.schedule.filter(item => item.day === day).length;
}

function renderTodayList() {
  const day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
  const today = data.schedule.filter(item => item.day === day).sort((a, b) => a.time.localeCompare(b.time));
  if (!today.length) return emptyState("No classes today", "Take the day to catch up or rest.");
  return `<div class="list">${today.map(item => `
    <div class="list-item">
      <div class="time">${item.time}</div>
      <div class="body"><strong>${escapeHtml(item.subject)}</strong><span>${item.end} · ${escapeHtml(item.room)}</span></div>
      <span class="badge accent">Class</span>
    </div>
  `).join("")}</div>`;
}

function renderAssignmentItem(item) {
  const overdue = !item.done && new Date(`${item.dueDate}T23:59:59`) < new Date();
  return `
    <div class="list-item assignment-item ${item.done ? "done" : ""}">
      <span class="status-dot"></span>
      <div class="body"><strong class="title">${escapeHtml(item.title)}</strong><span>${escapeHtml(item.subject)} · ${formatDate(item.dueDate)}</span></div>
      <span class="badge ${overdue ? "warning" : item.done ? "success" : ""}">${item.done ? "Done" : overdue ? "Overdue" : "Pending"}</span>
    </div>
  `;
}

function renderSchedule() {
  const grouped = [...data.schedule].sort((a, b) => {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.time.localeCompare(b.time);
  });

  page.innerHTML = `
    <section class="hero">
      <div><p class="eyebrow">Weekly view</p><h1>Schedule.</h1><p class="hero-copy">Your saved class timetable, kept simple.</p></div>
      <button class="primary-button" data-action="add-schedule"><i class="icon icon-plus"></i> Add class</button>
    </section>
    <article class="card">
      ${grouped.length ? `<div class="schedule-list">${grouped.map(item => `
        <div class="schedule-row">
          <div class="day">${item.day}<br>${item.time}</div>
          <div><strong>${escapeHtml(item.subject)}</strong><span>${item.time}–${item.end}</span></div>
          <div class="room">${escapeHtml(item.room)}</div>
        </div>
      `).join("")}</div>` : emptyState("No classes yet", "Add your first class to build your timetable.")}
    </article>
  `;
}

function renderAssignments(filter = "") {
  const sorted = [...data.assignments].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const filtered = sorted.filter(item => `${item.title} ${item.subject}`.toLowerCase().includes(filter.toLowerCase()));

  page.innerHTML = `
    <section class="hero">
      <div><p class="eyebrow">Classwork</p><h1>Assignments.</h1><p class="hero-copy">Keep the small deadlines from becoming big problems.</p></div>
      <button class="primary-button" data-action="add-assignment"><i class="icon icon-plus"></i> Add assignment</button>
    </section>
    <div class="page-toolbar">
      <input class="input search" id="assignmentSearch" type="search" placeholder="Search assignments..." value="${escapeAttribute(filter)}" />
    </div>
    <article class="card">
      ${filtered.length ? `<div class="list">${filtered.map(item => `
        <div class="list-item assignment-item ${item.done ? "done" : ""}" data-id="${item.id}">
          <input type="checkbox" aria-label="Mark assignment done" ${item.done ? "checked" : ""} data-toggle-assignment="${item.id}" />
          <div class="body"><strong class="title">${escapeHtml(item.title)}</strong><span>${escapeHtml(item.subject)} · Due ${formatDate(item.dueDate)}</span></div>
          <button class="icon-button" title="Delete assignment" data-delete-assignment="${item.id}"><i class="icon icon-trash-2"></i></button>
        </div>
      `).join("")}</div>` : emptyState("No assignments found", "Try another search or add a new assignment.")}
    </article>
  `;

  const search = document.getElementById("assignmentSearch");
  search?.addEventListener("input", event => renderAssignments(event.target.value));
}

function emptyState(title, message) {
  return `<div class="empty"><strong>${title}</strong><p>${message}</p></div>`;
}

function openModal(type) {
  modalBackdrop.classList.remove("hidden");
  document.getElementById("modalEyebrow").textContent = "NEW";
  document.getElementById("modalTitle").textContent = type === "assignment" ? "Add assignment" : "Add class";

  modalForm.innerHTML = type === "assignment" ? `
    <div class="form-grid">
      <div class="field"><label for="assignmentTitle">Assignment</label><input class="input" id="assignmentTitle" required placeholder="e.g. C Assignment 02" /></div>
      <div class="field"><label for="assignmentSubject">Subject</label><input class="input" id="assignmentSubject" required placeholder="e.g. Dasar Pemrograman" /></div>
      <div class="field"><label for="assignmentDue">Due date</label><input class="input" id="assignmentDue" type="date" required /></div>
      <div class="form-actions"><button type="button" class="secondary-button" id="cancelModal">Cancel</button><button class="primary-button" type="submit">Save assignment</button></div>
    </div>
  ` : `
    <div class="form-grid">
      <div class="field"><label for="classSubject">Subject</label><input class="input" id="classSubject" required placeholder="e.g. Kalkulus" /></div>
      <div class="field"><label for="classDay">Day</label><select class="select" id="classDay"><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option></select></div>
      <div class="field"><label for="classTime">Start time</label><input class="input" id="classTime" type="time" required /></div>
      <div class="field"><label for="classEnd">End time</label><input class="input" id="classEnd" type="time" required /></div>
      <div class="field"><label for="classRoom">Room</label><input class="input" id="classRoom" placeholder="e.g. Lab 1" /></div>
      <div class="form-actions"><button type="button" class="secondary-button" id="cancelModal">Cancel</button><button class="primary-button" type="submit">Save class</button></div>
    </div>
  `;

  document.getElementById("cancelModal").addEventListener("click", closeModal);
  modalForm.addEventListener("submit", event => {
    event.preventDefault();
    if (type === "assignment") {
      data.assignments.push({
        id: Date.now(),
        title: document.getElementById("assignmentTitle").value.trim(),
        subject: document.getElementById("assignmentSubject").value.trim(),
        dueDate: document.getElementById("assignmentDue").value,
        done: false
      });
    } else {
      data.schedule.push({
        id: Date.now(),
        subject: document.getElementById("classSubject").value.trim(),
        day: document.getElementById("classDay").value,
        time: document.getElementById("classTime").value,
        end: document.getElementById("classEnd").value,
        room: document.getElementById("classRoom").value.trim() || "—"
      });
    }
    saveData();
    closeModal();
    render();
  }, { once: true });
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
  modalForm.innerHTML = "";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function applyStoredTheme() {
  const theme = localStorage.getItem("kelasin-theme") || "light";
  document.documentElement.dataset.theme = theme;
  themeButton.innerHTML = `<i class="icon icon-${theme === "dark" ? "moon" : "sun"}"></i>`;
}

document.addEventListener("click", event => {
  const nav = event.target.closest(".nav-item");
  if (nav) {
    currentSection = nav.dataset.section;
    sidebar.classList.remove("open");
    render();
    return;
  }

  const sectionLink = event.target.closest("[data-section-link]");
  if (sectionLink) {
    currentSection = sectionLink.dataset.sectionLink;
    render();
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "add-assignment") openModal("assignment");
  if (action === "add-schedule") openModal("schedule");

  const toggle = event.target.closest("[data-toggle-assignment]");
  if (toggle) {
    const item = data.assignments.find(item => item.id === Number(toggle.dataset.toggleAssignment));
    if (item) {
      item.done = toggle.checked;
      saveData();
      render();
    }
  }

  const del = event.target.closest("[data-delete-assignment]");
  if (del) {
    const id = Number(del.dataset.deleteAssignment);
    data.assignments = data.assignments.filter(item => item.id !== id);
    saveData();
    renderAssignments(document.getElementById("assignmentSearch")?.value || "");
  }
});

themeButton.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("kelasin-theme", next);
  applyStoredTheme();
});

menuButton.addEventListener("click", () => sidebar.classList.toggle("open"));
modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) closeModal();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modalBackdrop.classList.contains("hidden")) closeModal();
});

applyStoredTheme();
render();
