const STORAGE_KEY = "kelasin-data-v1";
const THEME_KEY = "kelasin-theme";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_INDEX = Object.fromEntries(DAYS.map((day, index) => [day, index]));

const page = document.getElementById("page");
const sidebar = document.getElementById("sidebar");
const themeButton = document.getElementById("themeButton");
const menuButton = document.getElementById("menuButton");
const mobileScrim = document.getElementById("mobileScrim");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalForm = document.getElementById("modalForm");
const modalClose = document.getElementById("modalClose");
const toastRegion = document.getElementById("toastRegion");
const topbarTitle = document.getElementById("topbarTitle");

let currentSection = "dashboard";
let assignmentQuery = "";
let assignmentFilter = "all";
let modalState = null;
let lastFocusedElement = null;
let toastTimer = null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildDefaultData() {
  const today = new Date();
  return {
    assignments: [
      { id: makeId(), subject: "Dasar Pemrograman", title: "C Assignment 01", dueDate: isoDate(addDays(today, 2)), done: false },
      { id: makeId(), subject: "Bahasa Indonesia", title: "Ringkasan materi", dueDate: isoDate(addDays(today, 4)), done: false },
      { id: makeId(), subject: "Kalkulus", title: "Latihan limit", dueDate: isoDate(today), done: true }
    ],
    schedule: [
      { id: makeId(), day: "Monday", subject: "Dasar Pemrograman", time: "09:00", end: "10:40", room: "Lab 2" },
      { id: makeId(), day: "Monday", subject: "Pancasila", time: "13:00", end: "14:40", room: "R. 3.2" },
      { id: makeId(), day: "Tuesday", subject: "Kalkulus", time: "09:00", end: "10:40", room: "R. 2.1" },
      { id: makeId(), day: "Wednesday", subject: "Bahasa Indonesia", time: "10:00", end: "11:40", room: "R. 3.1" },
      { id: makeId(), day: "Thursday", subject: "Critical Thinking", time: "13:00", end: "14:40", room: "R. 2.4" }
    ]
  };
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isValidAssignment(item) {
  return item && typeof item === "object" &&
    typeof item.id !== "undefined" &&
    typeof item.title === "string" &&
    typeof item.subject === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(item.dueDate) &&
    typeof item.done === "boolean";
}

function isValidSchedule(item) {
  return item && typeof item === "object" &&
    typeof item.id !== "undefined" &&
    DAYS.includes(item.day) &&
    typeof item.subject === "string" &&
    /^\d{2}:\d{2}$/.test(item.time) &&
    /^\d{2}:\d{2}$/.test(item.end) &&
    typeof item.room === "string";
}

function sanitizeData(raw) {
  if (!raw || typeof raw !== "object") return buildDefaultData();
  const assignments = Array.isArray(raw.assignments) ? raw.assignments.filter(isValidAssignment) : [];
  const schedule = Array.isArray(raw.schedule) ? raw.schedule.filter(isValidSchedule) : [];
  return { assignments, schedule };
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildDefaultData();
    return sanitizeData(JSON.parse(raw));
  } catch (error) {
    console.warn("KELASIN: saved data could not be loaded.", error);
    return buildDefaultData();
  }
}

let data = loadData();

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("KELASIN: could not save data.", error);
    showToast("Could not save changes in this browser.", "error");
    return false;
  }
}

function formatDate(dateString, options = {}) {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", ...options }).format(date);
}

function formatLongDate(dateString) {
  return formatDate(dateString, { weekday: "short" });
}

function getTodayName() {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function isOverdue(item) {
  return !item.done && new Date(`${item.dueDate}T23:59:59`) < new Date();
}

function getTodayClasses() {
  return data.schedule
    .filter(item => item.day === getTodayName())
    .sort((a, b) => a.time.localeCompare(b.time));
}

function getNextClass() {
  const now = new Date();
  const today = getTodayName();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const todayUpcoming = getTodayClasses().find(item => item.end > currentTime);
  if (todayUpcoming) return { ...todayUpcoming, isToday: true };

  const todayIndex = DAYS.indexOf(today);
  const upcoming = DAYS
    .map((day, offset) => ({ day, offset: (DAY_INDEX[day] - todayIndex + 7) % 7 }))
    .filter(item => item.offset > 0)
    .sort((a, b) => a.offset - b.offset)
    .flatMap(item => data.schedule.filter(schedule => schedule.day === item.day).sort((a, b) => a.time.localeCompare(b.time)));

  return upcoming.length ? { ...upcoming[0], isToday: false } : null;
}

function getCurrentClass() {
  const current = new Date();
  const time = `${String(current.getHours()).padStart(2, "0")}:${String(current.getMinutes()).padStart(2, "0")}`;
  return getTodayClasses().find(item => item.time <= time && item.end > time) || null;
}

function timeUntil(dateString, timeString) {
  const target = new Date(`${dateString}T${timeString}:00`);
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return "Now";
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `in ${mins}m`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem ? `in ${hours}h ${rem}m` : `in ${hours}h`;
}

function sortAssignments(items) {
  return [...items].sort((a, b) => {
    if (a.done !== b.done) return Number(a.done) - Number(b.done);
    return a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title);
  });
}

function render() {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.section === currentSection);
  });

  topbarTitle.textContent = currentSection === "dashboard"
    ? "Teknik Informatika 2026 B"
    : currentSection[0].toUpperCase() + currentSection.slice(1);

  if (currentSection === "dashboard") renderDashboard();
  if (currentSection === "schedule") renderSchedule();
  if (currentSection === "assignments") renderAssignments();
}

function renderDashboard() {
  const pending = data.assignments.filter(item => !item.done).length;
  const overdue = data.assignments.filter(isOverdue).length;
  const todayClasses = getTodayClasses();
  const nextClass = getNextClass();
  const currentClass = getCurrentClass();
  const upcoming = sortAssignments(data.assignments.filter(item => !item.done)).slice(0, 4);
  const nextLabel = currentClass ? "Now" : nextClass ? (nextClass.isToday ? nextClass.time : `${nextClass.day.slice(0, 3)} ${nextClass.time}`) : "—";
  const nextHint = currentClass ? `${currentClass.subject} is in progress` : nextClass ? `${nextClass.subject} · ${nextClass.room}` : "No class scheduled";

  page.innerHTML = `
    <section class="hero">
      <div class="hero-main">
        <p class="eyebrow">Teknik Informatika 2026 B</p>
        <h1>${getGreeting()}, Mikael.</h1>
        <p class="hero-copy">Classes, deadlines, and the little things worth remembering.</p>
      </div>
      <div class="hero-actions">
        <button class="secondary-button" type="button" data-action="add-schedule">${icon("calendar-plus")} Add class</button>
        <button class="primary-button" type="button" data-action="add-assignment">${icon("plus")} Add assignment</button>
      </div>
    </section>

    <section class="grid stats" aria-label="Overview">
      ${statCard("Classes today", todayClasses.length, "based on your saved schedule", "calendar")}
      ${statCard("Pending assignments", pending, overdue ? `${overdue} overdue` : "Nothing overdue", "list")}
      ${statCard("Next class", nextLabel, nextHint, "arrow")}
    </section>

    <section class="grid content-grid">
      <article class="card">
        <div class="section-heading">
          <div><p class="section-kicker">Today</p><h2>${todayNameLabel()}</h2></div>
          <button class="link-button" type="button" data-section-link="schedule">Full schedule ${icon("arrow-right")}</button>
        </div>
        ${renderTodayList(todayClasses)}
      </article>
      <article class="card">
        <div class="section-heading">
          <div><p class="section-kicker">Keep moving</p><h2>Upcoming work</h2></div>
          <button class="link-button" type="button" data-section-link="assignments">View all ${icon("arrow-right")}</button>
        </div>
        ${upcoming.length ? `<div class="list">${upcoming.map(item => renderDashboardAssignment(item)).join("")}</div>` : emptyState("You're all caught up.", "No pending assignments right now.")}
      </article>
    </section>

    <section class="card quick-note">
      <div class="quick-note-copy">
        <span class="soft-icon">${icon("database")}</span>
        <div><strong>Everything stays on this device.</strong><p>KELASIN uses localStorage, so there is no account or server behind this v1.</p></div>
      </div>
      <button class="link-button" type="button" data-action="reset-data">Reset demo data</button>
    </section>
  `;
}

function statCard(label, value, hint, iconName) {
  return `<article class="card stat-card"><div class="stat-top"><span class="label">${label}</span><span class="stat-icon">${icon(iconName)}</span></div><div class="value">${escapeHtml(value)}</div><div class="hint">${escapeHtml(hint)}</div></article>`;
}

function todayNameLabel() {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" }).format(new Date());
}

function renderTodayList(items) {
  if (!items.length) return emptyState("No classes today", "Your schedule is clear for today.");
  const current = getCurrentClass();
  return `<div class="list">${items.map(item => `
    <div class="list-item ${current?.id === item.id ? "is-current" : ""}">
      <div class="time-block"><strong>${escapeHtml(item.time)}</strong><span>${escapeHtml(item.end)}</span></div>
      <div class="body"><strong>${escapeHtml(item.subject)}</strong><span>${escapeHtml(item.room)}</span></div>
      ${current?.id === item.id ? '<span class="badge accent">Now</span>' : ''}
    </div>
  `).join("")}</div>`;
}

function renderDashboardAssignment(item) {
  const status = isOverdue(item) ? "Overdue" : formatDueLabel(item.dueDate);
  const statusClass = isOverdue(item) ? "warning" : "";
  return `<button class="list-item list-item-button" type="button" data-edit-assignment="${escapeAttribute(item.id)}">
    <span class="status-dot"></span>
    <div class="body"><strong class="title">${escapeHtml(item.title)}</strong><span>${escapeHtml(item.subject)} · ${formatDate(item.dueDate)}</span></div>
    <span class="badge ${statusClass}">${escapeHtml(status)}</span>
  </button>`;
}

function formatDueLabel(dateString) {
  const target = new Date(`${dateString}T23:59:59`);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const targetDay = new Date(target);
  targetDay.setHours(0, 0, 0, 0);
  const diff = Math.round((targetDay - start) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return formatDate(dateString);
}

function renderSchedule() {
  const grouped = DAYS.map(day => ({
    day,
    classes: data.schedule.filter(item => item.day === day).sort((a, b) => a.time.localeCompare(b.time))
  })).filter(group => group.classes.length);
  const today = getTodayName();

  page.innerHTML = `
    <section class="hero">
      <div class="hero-main"><p class="eyebrow">Weekly view</p><h1>Schedule.</h1><p class="hero-copy">A simple timetable that is easy to change when your week changes.</p></div>
      <button class="primary-button" type="button" data-action="add-schedule">${icon("plus")} Add class</button>
    </section>

    <article class="card schedule-card">
      ${grouped.length ? grouped.map(group => `
        <section class="day-section ${group.day === today ? "is-today" : ""}">
          <div class="day-heading"><div><span class="day-name">${group.day}</span>${group.day === today ? '<span class="today-chip">Today</span>' : ''}</div><span class="day-count">${group.classes.length} ${group.classes.length === 1 ? "class" : "classes"}</span></div>
          <div class="schedule-list">${group.classes.map(renderScheduleRow).join("")}</div>
        </section>
      `).join("") : emptyState("No classes yet", "Add your first class to build your timetable.")}
    </article>
  `;
}

function renderScheduleRow(item) {
  return `
    <div class="schedule-row">
      <div class="schedule-time"><strong>${escapeHtml(item.time)}</strong><span>${escapeHtml(item.end)}</span></div>
      <div class="schedule-main"><strong>${escapeHtml(item.subject)}</strong><span>${escapeHtml(item.room || "No room set")}</span></div>
      <div class="row-actions">
        <button class="icon-button small" type="button" title="Edit class" aria-label="Edit ${escapeAttribute(item.subject)}" data-edit-schedule="${escapeAttribute(item.id)}">${icon("pencil")}</button>
        <button class="icon-button small danger-hover" type="button" title="Delete class" aria-label="Delete ${escapeAttribute(item.subject)}" data-delete-schedule="${escapeAttribute(item.id)}">${icon("trash")}</button>
      </div>
    </div>
  `;
}

function renderAssignments() {
  const filtered = sortAssignments(data.assignments).filter(item => {
    const searchMatch = `${item.title} ${item.subject}`.toLowerCase().includes(assignmentQuery.toLowerCase());
    const filterMatch = assignmentFilter === "all" ||
      (assignmentFilter === "pending" && !item.done && !isOverdue(item)) ||
      (assignmentFilter === "done" && item.done) ||
      (assignmentFilter === "overdue" && isOverdue(item));
    return searchMatch && filterMatch;
  });

  const counts = {
    all: data.assignments.length,
    pending: data.assignments.filter(item => !item.done && !isOverdue(item)).length,
    done: data.assignments.filter(item => item.done).length,
    overdue: data.assignments.filter(isOverdue).length
  };

  page.innerHTML = `
    <section class="hero">
      <div class="hero-main"><p class="eyebrow">Classwork</p><h1>Assignments.</h1><p class="hero-copy">Keep the small deadlines from becoming big problems.</p></div>
      <button class="primary-button" type="button" data-action="add-assignment">${icon("plus")} Add assignment</button>
    </section>

    <div class="page-toolbar">
      <label class="search-wrap"><span class="sr-only">Search assignments</span>${icon("search")}<input class="input search" id="assignmentSearch" type="search" placeholder="Search assignments or subjects..." value="${escapeAttribute(assignmentQuery)}" autocomplete="off"></label>
      <div class="filter-tabs" role="tablist" aria-label="Assignment filters">
        ${filterTab("all", "All", counts.all)}
        ${filterTab("pending", "Pending", counts.pending)}
        ${filterTab("done", "Done", counts.done)}
        ${filterTab("overdue", "Overdue", counts.overdue)}
      </div>
    </div>

    <article class="card">
      ${filtered.length ? `<div class="assignment-list">${filtered.map(renderAssignmentRow).join("")}</div>` : emptyState("No assignments found", assignmentQuery ? "Try another search term." : "Add an assignment to get started.")}
    </article>
  `;

  const search = document.getElementById("assignmentSearch");
  search?.addEventListener("input", event => {
    assignmentQuery = event.target.value;
    renderAssignments();
    const input = document.getElementById("assignmentSearch");
    input?.focus();
    input?.setSelectionRange(assignmentQuery.length, assignmentQuery.length);
  });
}

function filterTab(key, label, count) {
  return `<button class="filter-tab ${assignmentFilter === key ? "active" : ""}" type="button" role="tab" aria-selected="${assignmentFilter === key}" data-assignment-filter="${key}"><span>${label}</span><b>${count}</b></button>`;
}

function renderAssignmentRow(item) {
  const overdue = isOverdue(item);
  const status = item.done ? "Done" : overdue ? "Overdue" : formatDueLabel(item.dueDate);
  const statusClass = item.done ? "success" : overdue ? "warning" : "";
  return `
    <div class="assignment-row ${item.done ? "done" : ""}" data-id="${escapeAttribute(item.id)}">
      <label class="check-wrap"><input type="checkbox" ${item.done ? "checked" : ""} data-toggle-assignment="${escapeAttribute(item.id)}"><span class="custom-check"></span><span class="sr-only">Mark ${escapeAttribute(item.title)} as done</span></label>
      <div class="assignment-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.subject)}</span></div>
      <div class="assignment-due"><strong>${formatDate(item.dueDate)}</strong><span>${formatLongDate(item.dueDate)}</span></div>
      <span class="badge ${statusClass}">${escapeHtml(status)}</span>
      <div class="row-actions">
        <button class="icon-button small" type="button" title="Edit assignment" aria-label="Edit ${escapeAttribute(item.title)}" data-edit-assignment="${escapeAttribute(item.id)}">${icon("pencil")}</button>
        <button class="icon-button small danger-hover" type="button" title="Delete assignment" aria-label="Delete ${escapeAttribute(item.title)}" data-delete-assignment="${escapeAttribute(item.id)}">${icon("trash")}</button>
      </div>
    </div>
  `;
}

function emptyState(title, message) {
  return `<div class="empty"><div class="empty-icon">${icon("inbox")}</div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p></div>`;
}

function openModal(type, id = null) {
  modalState = { type, id };
  lastFocusedElement = document.activeElement;
  const item = id ? findItem(type, id) : null;
  const editing = Boolean(item);
  const isAssignment = type === "assignment";

  document.getElementById("modalEyebrow").textContent = editing ? "EDIT" : "NEW";
  document.getElementById("modalTitle").textContent = isAssignment
    ? `${editing ? "Edit" : "Add"} assignment`
    : `${editing ? "Edit" : "Add"} class`;

  modalForm.innerHTML = isAssignment ? assignmentFormMarkup(item) : scheduleFormMarkup(item);
  modalBackdrop.classList.remove("hidden");
  document.body.classList.add("modal-open");

  requestAnimationFrame(() => {
    const firstInput = modalForm.querySelector("input, select");
    firstInput?.focus();
  });
}

function assignmentFormMarkup(item) {
  const dueDate = item?.dueDate || isoDate(new Date());
  return `
    <div class="form-grid">
      <div class="field"><label for="assignmentTitle">Assignment</label><input class="input" id="assignmentTitle" maxlength="80" required placeholder="e.g. C Assignment 02" value="${escapeAttribute(item?.title || "")}"><span class="field-error" data-error-for="assignmentTitle"></span></div>
      <div class="field"><label for="assignmentSubject">Subject</label><input class="input" id="assignmentSubject" maxlength="60" required placeholder="e.g. Dasar Pemrograman" value="${escapeAttribute(item?.subject || "")}"><span class="field-error" data-error-for="assignmentSubject"></span></div>
      <div class="field"><label for="assignmentDue">Due date</label><input class="input" id="assignmentDue" type="date" required value="${escapeAttribute(dueDate)}"><span class="field-error" data-error-for="assignmentDue"></span></div>
      <div class="form-actions"><button type="button" class="secondary-button" data-modal-cancel>Cancel</button><button type="submit" class="primary-button">${item ? "Save changes" : "Save assignment"}</button></div>
    </div>
  `;
}

function scheduleFormMarkup(item) {
  return `
    <div class="form-grid">
      <div class="field"><label for="classSubject">Subject</label><input class="input" id="classSubject" maxlength="60" required placeholder="e.g. Kalkulus" value="${escapeAttribute(item?.subject || "")}"><span class="field-error" data-error-for="classSubject"></span></div>
      <div class="form-two">
        <div class="field"><label for="classDay">Day</label><select class="select" id="classDay">${DAYS.map(day => `<option ${item?.day === day ? "selected" : ""}>${day}</option>`).join("")}</select></div>
        <div class="field"><label for="classRoom">Room</label><input class="input" id="classRoom" maxlength="30" placeholder="e.g. Lab 1" value="${escapeAttribute(item?.room || "")}"></div>
      </div>
      <div class="form-two">
        <div class="field"><label for="classTime">Start time</label><input class="input" id="classTime" type="time" required value="${escapeAttribute(item?.time || "08:00")}"><span class="field-error" data-error-for="classTime"></span></div>
        <div class="field"><label for="classEnd">End time</label><input class="input" id="classEnd" type="time" required value="${escapeAttribute(item?.end || "09:40")}"><span class="field-error" data-error-for="classEnd"></span></div>
      </div>
      <div class="form-hint">Keep start and end times in the same day. KELASIN will block overlapping classes.</div>
      <div class="form-actions"><button type="button" class="secondary-button" data-modal-cancel>Cancel</button><button type="submit" class="primary-button">${item ? "Save changes" : "Save class"}</button></div>
    </div>
  `;
}

function findItem(type, id) {
  const list = type === "assignment" ? data.assignments : data.schedule;
  return list.find(item => String(item.id) === String(id)) || null;
}

function validateAssignmentForm() {
  const title = document.getElementById("assignmentTitle");
  const subject = document.getElementById("assignmentSubject");
  const dueDate = document.getElementById("assignmentDue");
  let valid = true;
  [title, subject, dueDate].forEach(input => setFieldError(input, ""));

  if (!title.value.trim()) { setFieldError(title, "Enter an assignment name."); valid = false; }
  if (!subject.value.trim()) { setFieldError(subject, "Enter the subject."); valid = false; }
  if (!dueDate.value) { setFieldError(dueDate, "Choose a due date."); valid = false; }
  return valid;
}

function validateScheduleForm() {
  const subject = document.getElementById("classSubject");
  const start = document.getElementById("classTime");
  const end = document.getElementById("classEnd");
  let valid = true;
  [subject, start, end].forEach(input => setFieldError(input, ""));

  if (!subject.value.trim()) { setFieldError(subject, "Enter a subject name."); valid = false; }
  if (!start.value) { setFieldError(start, "Choose a start time."); valid = false; }
  if (!end.value) { setFieldError(end, "Choose an end time."); valid = false; }
  if (start.value && end.value && start.value >= end.value) { setFieldError(end, "End time must be after start time."); valid = false; }

  if (valid && hasScheduleConflict({
    id: modalState?.id,
    day: document.getElementById("classDay").value,
    time: start.value,
    end: end.value
  })) {
    setFieldError(start, "This time overlaps another class.");
    valid = false;
  }
  return valid;
}

function hasScheduleConflict(candidate) {
  return data.schedule.some(item => {
    if (String(item.id) === String(candidate.id)) return false;
    if (item.day !== candidate.day) return false;
    return candidate.time < item.end && candidate.end > item.time;
  });
}

function setFieldError(input, message) {
  if (!input) return;
  const error = document.querySelector(`[data-error-for="${CSS.escape(input.id)}"]`);
  input.classList.toggle("has-error", Boolean(message));
  if (error) error.textContent = message;
}

function closeModal() {
  if (modalBackdrop.classList.contains("hidden")) return;
  modalBackdrop.classList.add("hidden");
  document.body.classList.remove("modal-open");
  modalState = null;
  modalForm.innerHTML = "";
  lastFocusedElement?.focus?.();
  lastFocusedElement = null;
}

function handleModalSubmit(event) {
  event.preventDefault();
  if (!modalState) return;

  if (modalState.type === "assignment") {
    if (!validateAssignmentForm()) return;
    const id = modalState.id || makeId();
    const existing = findItem("assignment", id);
    const next = {
      id,
      title: document.getElementById("assignmentTitle").value.trim(),
      subject: document.getElementById("assignmentSubject").value.trim(),
      dueDate: document.getElementById("assignmentDue").value,
      done: existing?.done ?? false
    };
    if (existing) Object.assign(existing, next);
    else data.assignments.push(next);
    saveData();
    closeModal();
    render();
    showToast(existing ? "Assignment updated." : "Assignment added.");
    return;
  }

  if (!validateScheduleForm()) return;
  const id = modalState.id || makeId();
  const existing = findItem("schedule", id);
  const next = {
    id,
    subject: document.getElementById("classSubject").value.trim(),
    day: document.getElementById("classDay").value,
    time: document.getElementById("classTime").value,
    end: document.getElementById("classEnd").value,
    room: document.getElementById("classRoom").value.trim() || "—"
  };
  if (existing) Object.assign(existing, next);
  else data.schedule.push(next);
  saveData();
  closeModal();
  render();
  showToast(existing ? "Class updated." : "Class added.");
}

function toggleAssignment(id, checked) {
  const item = findItem("assignment", id);
  if (!item) return;
  item.done = checked;
  saveData();
  render();
  showToast(checked ? "Assignment marked done." : "Assignment moved back to pending.");
}

function deleteAssignment(id) {
  const item = findItem("assignment", id);
  if (!item) return;
  if (!window.confirm(`Delete “${item.title}”?`)) return;
  data.assignments = data.assignments.filter(entry => String(entry.id) !== String(id));
  saveData();
  render();
  showToast("Assignment deleted.");
}

function deleteSchedule(id) {
  const item = findItem("schedule", id);
  if (!item) return;
  if (!window.confirm(`Delete ${item.subject} from the schedule?`)) return;
  data.schedule = data.schedule.filter(entry => String(entry.id) !== String(id));
  saveData();
  render();
  showToast("Class removed from schedule.");
}

function resetDemoData() {
  if (!window.confirm("Reset KELASIN to the original demo data? Your current local data will be replaced.")) return;
  data = buildDefaultData();
  assignmentQuery = "";
  assignmentFilter = "all";
  saveData();
  render();
  showToast("Demo data restored.");
}

function showToast(message, tone = "success") {
  clearTimeout(toastTimer);
  toastRegion.innerHTML = `<div class="toast ${tone}"><span class="toast-icon">${icon(tone === "error" ? "alert" : "check")}</span><span>${escapeHtml(message)}</span></div>`;
  toastTimer = setTimeout(() => { toastRegion.innerHTML = ""; }, 2600);
}

function icon(name) {
  const icons = {
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="3" width="7" height="7" rx="1.5"></rect><rect x="3" y="14" width="7" height="7" rx="1.5"></rect><rect x="14" y="14" width="7" height="7" rx="1.5"></rect></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="17" rx="2.5"></rect><line x1="16" y1="2.5" x2="16" y2="6.5"></line><line x1="8" y1="2.5" x2="8" y2="6.5"></line><line x1="3" y1="9" x2="21" y2="9"></line></svg>',
    list: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="8" y1="6" x2="20" y2="6"></line><line x1="8" y1="12" x2="20" y2="12"></line><line x1="8" y1="18" x2="20" y2="18"></line><circle cx="4" cy="6" r="1"></circle><circle cx="4" cy="12" r="1"></circle><circle cx="4" cy="18" r="1"></circle></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line><line x1="4.9" y1="4.9" x2="7" y2="7"></line><line x1="17" y1="17" x2="19.1" y2="19.1"></line><line x1="17" y1="7" x2="19.1" y2="4.9"></line><line x1="4.9" y1="19.1" x2="7" y2="17"></line></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.2A8 8 0 0 1 8.8 4 8.7 8.7 0 1 0 20 15.2Z"></path></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    "calendar-plus": '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="17" rx="2.5"></rect><line x1="16" y1="2.5" x2="16" y2="6.5"></line><line x1="8" y1="2.5" x2="8" y2="6.5"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="12" y1="13" x2="12" y2="18"></line><line x1="9.5" y1="15.5" x2="14.5" y2="15.5"></line></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="4" y1="12" x2="19" y2="12"></line><polyline points="13,6 19,12 13,18"></polyline></svg>',
    "arrow-right": '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="4" y1="12" x2="19" y2="12"></line><polyline points="13,6 19,12 13,18"></polyline></svg>',
    database: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"></ellipse><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5"></path><path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"></path></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><line x1="16" y1="16" x2="21" y2="21"></line></svg>',
    pencil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z"></path><line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="4,7 20,7"></polyline><path d="M9 7V4h6v3"></path><path d="M7 7l1 13h8l1-13"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>',
    inbox: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16l2 8v6H2v-6l2-8Z"></path><path d="M2 13h5l2 3h6l2-3h5"></path></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="5,12 10,17 19,7"></polyline></svg>',
    alert: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 22 20H2L12 3Z"></path><line x1="12" y1="9" x2="12" y2="14"></line><circle cx="12" cy="17" r=".8"></circle></svg>'
  };
  return `<span class="svg-icon">${icons[name] || icons.grid}</span>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function applyStoredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const theme = stored === "light" || stored === "dark" ? stored : "dark";
  document.documentElement.dataset.theme = theme;
  themeButton.innerHTML = icon(theme === "dark" ? "sun" : "moon");
  themeButton.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  themeButton.setAttribute("title", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
}

function setSidebarOpen(open) {
  sidebar.classList.toggle("open", open);
  mobileScrim.classList.toggle("visible", open);
  mobileScrim.setAttribute("aria-hidden", String(!open));
  menuButton.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
}

document.addEventListener("click", event => {
  const nav = event.target.closest(".nav-item");
  if (nav) {
    currentSection = nav.dataset.section;
    setSidebarOpen(false);
    render();
    return;
  }

  const sectionLink = event.target.closest("[data-section-link]");
  if (sectionLink) {
    currentSection = sectionLink.dataset.sectionLink;
    render();
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (actionTarget) {
    const action = actionTarget.dataset.action;
    if (action === "add-assignment") openModal("assignment");
    if (action === "add-schedule") openModal("schedule");
    if (action === "reset-data") resetDemoData();
    return;
  }

  const filterTarget = event.target.closest("[data-assignment-filter]");
  if (filterTarget) {
    assignmentFilter = filterTarget.dataset.assignmentFilter;
    renderAssignments();
    return;
  }

  const toggle = event.target.closest("[data-toggle-assignment]");
  if (toggle) {
    toggleAssignment(toggle.dataset.toggleAssignment, toggle.checked);
    return;
  }

  const editAssignment = event.target.closest("[data-edit-assignment]");
  if (editAssignment) {
    openModal("assignment", editAssignment.dataset.editAssignment);
    return;
  }

  const deleteAssignmentButton = event.target.closest("[data-delete-assignment]");
  if (deleteAssignmentButton) {
    deleteAssignment(deleteAssignmentButton.dataset.deleteAssignment);
    return;
  }

  const editSchedule = event.target.closest("[data-edit-schedule]");
  if (editSchedule) {
    openModal("schedule", editSchedule.dataset.editSchedule);
    return;
  }

  const deleteScheduleButton = event.target.closest("[data-delete-schedule]");
  if (deleteScheduleButton) {
    deleteSchedule(deleteScheduleButton.dataset.deleteSchedule);
    return;
  }

  const cancel = event.target.closest("[data-modal-cancel]");
  if (cancel) closeModal();
});

modalForm.addEventListener("submit", handleModalSubmit);
themeButton.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyStoredTheme();
});
menuButton.addEventListener("click", () => setSidebarOpen(!sidebar.classList.contains("open")));
mobileScrim.addEventListener("click", () => setSidebarOpen(false));
modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (!modalBackdrop.classList.contains("hidden")) closeModal();
    else if (sidebar.classList.contains("open")) setSidebarOpen(false);
  }
});

applyStoredTheme();
render();
