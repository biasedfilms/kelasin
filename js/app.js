const STORAGE_KEY = "kelasin-data-v1";
const THEME_KEY = "kelasin-theme";
const LANGUAGE_KEY = "kelasin-language";
const DATA_VERSION = 1;
const APP_VERSION = "1.4.0";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_INDEX = Object.fromEntries(DAYS.map((day, index) => [day, index]));

const page = document.getElementById("page");
const sidebar = document.getElementById("sidebar");
const themeButton = document.getElementById("themeButton");
const installButton = document.getElementById("installButton");
const menuButton = document.getElementById("menuButton");
const mobileScrim = document.getElementById("mobileScrim");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalForm = document.getElementById("modalForm");
const modalClose = document.getElementById("modalClose");
const toastRegion = document.getElementById("toastRegion");
const topbarTitle = document.getElementById("topbarTitle");
const languageButton = document.getElementById("languageButton");
const languageCode = document.getElementById("languageCode");
const importFileInput = document.getElementById("importFileInput");
const confirmBackdrop = document.getElementById("confirmBackdrop");
const confirmIcon = document.getElementById("confirmIcon");
const confirmEyebrow = document.getElementById("confirmEyebrow");
const confirmTitle = document.getElementById("confirmTitle");
const confirmMessage = document.getElementById("confirmMessage");
const confirmCancel = document.getElementById("confirmCancel");
const confirmProceed = document.getElementById("confirmProceed");

let currentSection = "dashboard";
let assignmentQuery = "";
let assignmentFilter = "all";
let modalState = null;
let confirmState = null;
let lastFocusedElement = null;
let lastConfirmFocusedElement = null;
let toastTimer = null;
let deferredInstallPrompt = null;
let language = getStoredLanguage();
let calendarCursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedCalendarDate = isoDate(new Date());

const translations = {
  en: {
    brandSubtitle: "Class dashboard",
    "nav.main": "Main navigation",
    "nav.dashboard": "Dashboard",
    "nav.schedule": "Schedule",
    "nav.calendar": "Calendar",
    "nav.assignments": "Assignments",
    "nav.settings": "Settings",
    "sidebar.localFirst": "Local-first",
    "sidebar.localCopy": "Your data stays in this browser.",
    "topbar.changeLanguage": "Change language",
    "topbar.openMenu": "Open menu",
    "topbar.closeMenu": "Close menu",
    "topbar.install": "Install KELASIN",
    "topbar.light": "Switch to light mode",
    "topbar.dark": "Switch to dark mode",
    "dashboard.label": "Teknik Informatika 2026 B",
    "dashboard.today": "Today",
    "dashboard.greeting.morning": "Good morning",
    "dashboard.greeting.afternoon": "Good afternoon",
    "dashboard.greeting.evening": "Good evening",
    "dashboard.copy": "Classes, deadlines, and the little things worth remembering.",
    "action.addClass": "Add class",
    "action.addAssignment": "Add assignment",
    "action.today": "Today",
    "action.previous": "Previous month",
    "action.next": "Next month",
    "action.cancel": "Cancel",
    "action.saveChanges": "Save changes",
    "action.saveAssignment": "Save assignment",
    "action.saveClass": "Save class",
    "action.edit": "Edit",
    "action.delete": "Delete",
    "action.viewAll": "View all",
    "action.fullSchedule": "Full schedule",
    "action.goCalendar": "Calendar",
    "action.goSchedule": "Schedule",
    "action.goAssignments": "Assignments",
    "stat.classesToday": "Classes today",
    "stat.classesHint": "based on your saved schedule",
    "stat.pending": "Pending assignments",
    "stat.overdue": "overdue",
    "stat.noneOverdue": "Nothing overdue",
    "stat.nextClass": "Next class",
    "stat.now": "Now",
    "stat.noClass": "No class scheduled",
    "dashboard.todayHeading": "Today",
    "dashboard.upcoming": "Upcoming work",
    "dashboard.keepMoving": "Keep moving",
    "dashboard.caughtUp": "You're all caught up.",
    "dashboard.noPending": "No pending assignments right now.",
    "dashboard.localTitle": "Everything stays on this device.",
    "dashboard.localCopy": "KELASIN saves your workspace locally. There is no account or server behind this version.",
    "dashboard.restore": "Restore sample workspace",
    "dashboard.restoreHint": "Bring back the starter data",
    "schedule.label": "Weekly view",
    "schedule.title": "Schedule.",
    "schedule.copy": "A simple timetable that is easy to change when your week changes.",
    "schedule.emptyTitle": "No classes yet",
    "schedule.emptyCopy": "Add your first class to build your timetable.",
    "schedule.class": "class",
    "schedule.classes": "classes",
    "schedule.today": "Today",
    "calendar.label": "Month view",
    "calendar.title": "Calendar.",
    "calendar.copy": "Your weekly classes mapped onto real dates, with assignments shown where they are due.",
    "calendar.scheduleCount": "weekly classes",
    "calendar.selected": "Selected day",
    "calendar.classes": "Classes",
    "calendar.assignments": "Assignments",
    "calendar.noClasses": "No classes",
    "calendar.noClassesCopy": "Your schedule is clear on this day.",
    "calendar.noAssignments": "No assignments due",
    "calendar.noAssignmentsCopy": "Nothing is due on this date.",
    "calendar.addForDay": "Add class for this day",
    "calendar.noEvent": "No activity",
    "calendar.overdue": "Overdue",
    "calendar.done": "Done",
    "calendar.due": "Due",
    "assignments.label": "Your workload",
    "assignments.title": "Assignments.",
    "assignments.copy": "Keep deadlines visible without making your task list feel heavy.",
    "assignments.search": "Search assignments or subjects...",
    "filter.all": "All",
    "filter.pending": "Pending",
    "filter.done": "Done",
    "filter.overdue": "Overdue",
    "assignments.empty": "No assignments found",
    "assignments.searchEmpty": "Try another search term.",
    "assignments.emptyCopy": "Add an assignment to get started.",
    "schedule.noToday": "No classes today",
    "settings.label": "Preferences",
    "settings.title": "Settings.",
    "settings.copy": "Small controls for how KELASIN looks, behaves, and keeps your data.",
    "settings.appearance": "Appearance",
    "settings.appearanceCopy": "Choose the visual mode used across the app.",
    "settings.theme": "Theme",
    "settings.themeDark": "Dark",
    "settings.themeLight": "Light",
    "settings.language": "Language",
    "settings.languageCopy": "Switch the interface without changing your data.",
    "settings.data": "Your data",
    "settings.dataCopy": "Everything stays in this browser unless you export a backup.",
    "settings.export": "Export backup",
    "settings.import": "Import backup",
    "settings.restore": "Restore sample workspace",
    "settings.restoreCopy": "Replace the current workspace with starter data.",
    "settings.about": "About KELASIN",
    "settings.aboutCopy": "A small local-first class manager built with HTML, CSS, and vanilla JavaScript.",
    "settings.version": "Version",
    "settings.storage": "Storage",
    "settings.local": "Local browser storage",
    "settings.shortcuts": "Keyboard shortcuts",
    "settings.shortcutsCopy": "Use quick keys on desktop when you want to move faster.",
    "settings.shortcutNewClass": "New class",
    "settings.shortcutNewAssignment": "New assignment",
    "settings.shortcutSearch": "Focus search",
    "settings.shortcutEscape": "Close dialogs",
    "modal.new": "NEW",
    "modal.edit": "EDIT",
    "modal.addAssignment": "Add assignment",
    "modal.editAssignment": "Edit assignment",
    "modal.addClass": "Add class",
    "modal.editClass": "Edit class",
    "field.assignment": "Assignment",
    "field.subject": "Subject",
    "field.dueDate": "Due date",
    "field.day": "Day",
    "field.start": "Starts",
    "field.end": "Ends",
    "field.room": "Room",
    "placeholder.assignment": "e.g. C Assignment 02",
    "placeholder.subject": "e.g. Dasar Pemrograman",
    "placeholder.room": "e.g. Lab 2",
    "form.enterAssignment": "Enter an assignment name.",
    "form.enterSubject": "Enter a subject name.",
    "form.enterDue": "Choose a due date.",
    "form.enterDay": "Choose a day.",
    "form.enterStart": "Choose a start time.",
    "form.enterEnd": "Choose an end time.",
    "form.invalidTime": "End time must be later than start time.",
    "form.conflict": "This time overlaps another class on the same day.",
    "form.enterRoom": "Add a room or location.",
    "form.hint": "You can change this later.",
    "toast.saved": "Changes saved.",
    "toast.deleted": "Item deleted.",
    "toast.completed": "Assignment marked done.",
    "toast.reopened": "Assignment moved back to pending.",
    "toast.restored": "Sample workspace restored.",
    "toast.exported": "Backup exported.",
    "toast.imported": "Backup imported.",
    "toast.invalidBackup": "That backup file is not valid KELASIN data.",
    "toast.storageError": "KELASIN could not save changes in this browser.",
    "toast.installHelp": "Use your browser's Install / Add to Dock option.",
    "confirm.restoreEyebrow": "WORKSPACE",
    "confirm.restoreTitle": "Restore sample workspace?",
    "confirm.restoreMessage": "Your current classes and assignments will be replaced with the starter workspace. Export a backup first if you want to keep them.",
    "confirm.deleteTitle": "Delete this item?",
    "confirm.deleteMessage": "This action cannot be undone.",
    "confirm.cancel": "Cancel",
    "confirm.restore": "Restore workspace",
    "confirm.delete": "Delete",
    "common.day": "day",
    "common.days": "days",
    "common.today": "Today",
    "common.tomorrow": "Tomorrow",
    "common.noRoom": "No room set",
    "common.inProgress": "is in progress",
    "common.in": "in",
    "common.on": "on",
    "common.at": "at",
    "common.none": "—",
    "week.Mon": "Mon", "week.Tue": "Tue", "week.Wed": "Wed", "week.Thu": "Thu", "week.Fri": "Fri", "week.Sat": "Sat", "week.Sun": "Sun"
  },
  id: {
    brandSubtitle: "Dashboard kelas",
    "nav.main": "Navigasi utama",
    "nav.dashboard": "Dashboard",
    "nav.schedule": "Jadwal",
    "nav.calendar": "Kalender",
    "nav.assignments": "Tugas",
    "nav.settings": "Pengaturan",
    "sidebar.localFirst": "Local-first",
    "sidebar.localCopy": "Data kamu tersimpan di browser ini.",
    "topbar.changeLanguage": "Ganti bahasa",
    "topbar.openMenu": "Buka menu",
    "topbar.closeMenu": "Tutup menu",
    "topbar.install": "Pasang KELASIN",
    "topbar.light": "Ganti ke mode terang",
    "topbar.dark": "Ganti ke mode gelap",
    "dashboard.label": "Teknik Informatika 2026 B",
    "dashboard.today": "Hari ini",
    "dashboard.greeting.morning": "Selamat pagi",
    "dashboard.greeting.afternoon": "Selamat siang",
    "dashboard.greeting.evening": "Selamat malam",
    "dashboard.copy": "Jadwal, deadline, dan hal-hal kecil yang perlu kamu ingat.",
    "action.addClass": "Tambah kelas",
    "action.addAssignment": "Tambah tugas",
    "action.today": "Hari ini",
    "action.previous": "Bulan sebelumnya",
    "action.next": "Bulan berikutnya",
    "action.cancel": "Batal",
    "action.saveChanges": "Simpan perubahan",
    "action.saveAssignment": "Simpan tugas",
    "action.saveClass": "Simpan kelas",
    "action.edit": "Edit",
    "action.delete": "Hapus",
    "action.viewAll": "Lihat semua",
    "action.fullSchedule": "Jadwal lengkap",
    "action.goCalendar": "Kalender",
    "action.goSchedule": "Jadwal",
    "action.goAssignments": "Tugas",
    "stat.classesToday": "Kelas hari ini",
    "stat.classesHint": "berdasarkan jadwal yang tersimpan",
    "stat.pending": "Tugas tertunda",
    "stat.overdue": "terlewat deadline",
    "stat.noneOverdue": "Tidak ada yang terlambat",
    "stat.nextClass": "Kelas berikutnya",
    "stat.now": "Sekarang",
    "stat.noClass": "Tidak ada kelas",
    "dashboard.todayHeading": "Hari ini",
    "dashboard.upcoming": "Tugas berikutnya",
    "dashboard.keepMoving": "Tetap lanjut",
    "dashboard.caughtUp": "Semua sudah beres.",
    "dashboard.noPending": "Tidak ada tugas yang masih tertunda.",
    "dashboard.localTitle": "Semua tetap di perangkat ini.",
    "dashboard.localCopy": "KELASIN menyimpan workspace kamu secara lokal. Tidak ada akun atau server di versi ini.",
    "dashboard.restore": "Pulihkan workspace contoh",
    "dashboard.restoreHint": "Kembalikan data awal",
    "schedule.label": "Tampilan mingguan",
    "schedule.title": "Jadwal.",
    "schedule.copy": "Jadwal yang sederhana dan mudah diubah saat minggu kamu berubah.",
    "schedule.emptyTitle": "Belum ada kelas",
    "schedule.emptyCopy": "Tambahkan kelas pertama untuk membangun jadwal kamu.",
    "schedule.class": "kelas",
    "schedule.classes": "kelas",
    "schedule.today": "Hari ini",
    "calendar.label": "Tampilan bulan",
    "calendar.title": "Kalender.",
    "calendar.copy": "Jadwal mingguan kamu dipetakan ke tanggal nyata, dengan tugas yang tampil sesuai deadline.",
    "calendar.scheduleCount": "kelas mingguan",
    "calendar.selected": "Hari terpilih",
    "calendar.classes": "Kelas",
    "calendar.assignments": "Tugas",
    "calendar.noClasses": "Tidak ada kelas",
    "calendar.noClassesCopy": "Tidak ada kelas pada hari ini.",
    "calendar.noAssignments": "Tidak ada tugas yang jatuh tempo",
    "calendar.noAssignmentsCopy": "Tidak ada yang deadline di tanggal ini.",
    "calendar.addForDay": "Tambah kelas di hari ini",
    "calendar.noEvent": "Tidak ada aktivitas",
    "calendar.overdue": "Terlambat",
    "calendar.done": "Selesai",
    "calendar.due": "Deadline",
    "assignments.label": "Beban tugas",
    "assignments.title": "Tugas.",
    "assignments.copy": "Jaga semua deadline tetap terlihat tanpa membuat daftar tugas terasa berat.",
    "assignments.search": "Cari tugas atau mata kuliah...",
    "filter.all": "Semua",
    "filter.pending": "Tertunda",
    "filter.done": "Selesai",
    "filter.overdue": "Terlambat",
    "assignments.empty": "Tugas tidak ditemukan",
    "assignments.searchEmpty": "Coba kata pencarian lain.",
    "assignments.emptyCopy": "Tambahkan tugas untuk mulai.",
    "schedule.noToday": "Tidak ada kelas hari ini",
    "settings.label": "Preferensi",
    "settings.title": "Pengaturan.",
    "settings.copy": "Kontrol kecil untuk tampilan, perilaku, dan penyimpanan KELASIN.",
    "settings.appearance": "Tampilan",
    "settings.appearanceCopy": "Pilih mode visual yang digunakan di seluruh aplikasi.",
    "settings.theme": "Tema",
    "settings.themeDark": "Gelap",
    "settings.themeLight": "Terang",
    "settings.language": "Bahasa",
    "settings.languageCopy": "Ganti bahasa antarmuka tanpa mengubah data.",
    "settings.data": "Data kamu",
    "settings.dataCopy": "Semua tetap di browser ini kecuali kamu mengekspor backup.",
    "settings.export": "Ekspor backup",
    "settings.import": "Impor backup",
    "settings.restore": "Pulihkan workspace contoh",
    "settings.restoreCopy": "Ganti workspace saat ini dengan data awal.",
    "settings.about": "Tentang KELASIN",
    "settings.aboutCopy": "Pengelola kelas local-first yang dibuat dengan HTML, CSS, dan vanilla JavaScript.",
    "settings.version": "Versi",
    "settings.storage": "Penyimpanan",
    "settings.local": "Penyimpanan browser lokal",
    "settings.shortcuts": "Shortcut keyboard",
    "settings.shortcutsCopy": "Gunakan tombol cepat di desktop untuk bergerak lebih cepat.",
    "settings.shortcutNewClass": "Kelas baru",
    "settings.shortcutNewAssignment": "Tugas baru",
    "settings.shortcutSearch": "Fokus pencarian",
    "settings.shortcutEscape": "Tutup dialog",
    "modal.new": "BARU",
    "modal.edit": "EDIT",
    "modal.addAssignment": "Tambah tugas",
    "modal.editAssignment": "Edit tugas",
    "modal.addClass": "Tambah kelas",
    "modal.editClass": "Edit kelas",
    "field.assignment": "Tugas",
    "field.subject": "Mata kuliah",
    "field.dueDate": "Deadline",
    "field.day": "Hari",
    "field.start": "Mulai",
    "field.end": "Selesai",
    "field.room": "Ruangan",
    "placeholder.assignment": "contoh: C Assignment 02",
    "placeholder.subject": "contoh: Dasar Pemrograman",
    "placeholder.room": "contoh: Lab 2",
    "form.enterAssignment": "Masukkan nama tugas.",
    "form.enterSubject": "Masukkan nama mata kuliah.",
    "form.enterDue": "Pilih tanggal deadline.",
    "form.enterDay": "Pilih hari.",
    "form.enterStart": "Pilih jam mulai.",
    "form.enterEnd": "Pilih jam selesai.",
    "form.invalidTime": "Jam selesai harus setelah jam mulai.",
    "form.conflict": "Jam ini bertabrakan dengan kelas lain di hari yang sama.",
    "form.enterRoom": "Tambahkan ruangan atau lokasi.",
    "form.hint": "Kamu bisa mengubahnya nanti.",
    "toast.saved": "Perubahan tersimpan.",
    "toast.deleted": "Data dihapus.",
    "toast.completed": "Tugas ditandai selesai.",
    "toast.reopened": "Tugas dikembalikan ke status tertunda.",
    "toast.restored": "Workspace contoh dipulihkan.",
    "toast.exported": "Backup berhasil diekspor.",
    "toast.imported": "Backup berhasil diimpor.",
    "toast.invalidBackup": "File backup tersebut bukan data KELASIN yang valid.",
    "toast.storageError": "KELASIN tidak bisa menyimpan perubahan di browser ini.",
    "toast.installHelp": "Gunakan opsi Install / Tambahkan ke Dock di browser kamu.",
    "confirm.restoreEyebrow": "WORKSPACE",
    "confirm.restoreTitle": "Pulihkan workspace contoh?",
    "confirm.restoreMessage": "Kelas dan tugas saat ini akan diganti dengan workspace awal. Ekspor backup dulu kalau datanya masih ingin disimpan.",
    "confirm.deleteTitle": "Hapus data ini?",
    "confirm.deleteMessage": "Tindakan ini tidak bisa dibatalkan.",
    "confirm.cancel": "Batal",
    "confirm.restore": "Pulihkan workspace",
    "confirm.delete": "Hapus",
    "common.day": "hari",
    "common.days": "hari",
    "common.today": "Hari ini",
    "common.tomorrow": "Besok",
    "common.noRoom": "Ruangan belum diisi",
    "common.inProgress": "sedang berlangsung",
    "common.in": "dalam",
    "common.on": "pada",
    "common.at": "jam",
    "common.none": "—",
    "week.Mon": "Sen", "week.Tue": "Sel", "week.Wed": "Rab", "week.Thu": "Kam", "week.Fri": "Jum", "week.Sat": "Sab", "week.Sun": "Min"
  }
};

function t(key, vars = {}) {
  const template = translations[language]?.[key] ?? translations.en[key] ?? key;
  return Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), template);
}

function getStoredLanguage() {
  try { return localStorage.getItem(LANGUAGE_KEY) === "id" ? "id" : "en"; } catch (_) { return "en"; }
}

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function addDays(date, amount) { const next = new Date(date); next.setDate(next.getDate() + amount); return next; }
function isoDate(date) { const year = date.getFullYear(); const month = String(date.getMonth() + 1).padStart(2, "0"); const day = String(date.getDate()).padStart(2, "0"); return `${year}-${month}-${day}`; }
function makeId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

function buildDefaultData() {
  const today = new Date();
  return {
    version: DATA_VERSION,
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

function isValidAssignment(item) {
  return item && typeof item === "object" && typeof item.id !== "undefined" && typeof item.title === "string" && typeof item.subject === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.dueDate) && typeof item.done === "boolean";
}
function isValidSchedule(item) {
  return item && typeof item === "object" && typeof item.id !== "undefined" && DAYS.includes(item.day) && typeof item.subject === "string" && /^\d{2}:\d{2}$/.test(item.time) && /^\d{2}:\d{2}$/.test(item.end) && typeof item.room === "string";
}
function sanitizeData(raw) {
  if (!raw || typeof raw !== "object") return buildDefaultData();
  const assignments = Array.isArray(raw.assignments) ? raw.assignments.filter(isValidAssignment).map(item => ({ ...item, id: String(item.id) })) : [];
  const schedule = Array.isArray(raw.schedule) ? raw.schedule.filter(isValidSchedule).map(item => ({ ...item, id: String(item.id) })) : [];
  return { version: DATA_VERSION, assignments, schedule };
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, version: DATA_VERSION }));
    return true;
  } catch (error) {
    console.error("KELASIN: could not save data.", error);
    showToast(t("toast.storageError"), "error");
    return false;
  }
}

function setLanguage(nextLanguage) {
  language = nextLanguage === "id" ? "id" : "en";
  try { localStorage.setItem(LANGUAGE_KEY, language); } catch (_) {}
  document.documentElement.lang = language;
  languageCode.textContent = language.toUpperCase();
  languageButton.title = t("topbar.changeLanguage");
  languageButton.setAttribute("aria-label", t("topbar.changeLanguage"));
  applyStaticLanguage();
  render(true);
}

function applyStaticLanguage() {
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(element => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  themeButton.setAttribute("aria-label", currentTheme() === "dark" ? t("topbar.light") : t("topbar.dark"));
  themeButton.title = currentTheme() === "dark" ? t("topbar.light") : t("topbar.dark");
  menuButton.setAttribute("aria-label", sidebar.classList.contains("open") ? t("topbar.closeMenu") : t("topbar.openMenu"));
  menuButton.setAttribute("aria-expanded", String(sidebar.classList.contains("open")));
  modalClose.setAttribute("aria-label", t("action.cancel"));
}

function currentTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}
function toggleTheme(forceTheme = null) {
  const next = forceTheme || (currentTheme() === "dark" ? "light" : "dark");
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
  themeButton.innerHTML = icon(next === "dark" ? "sun" : "moon");
  applyStaticLanguage();
  updateThemeColor();
}
function updateThemeColor() {
  const color = currentTheme() === "dark" ? "#0f1013" : "#f5f6f8";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
}

function formatDate(dateString, options = {}) {
  if (!dateString) return t("common.none");
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return t("common.none");
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", { month: "short", day: "numeric", ...options }).format(date);
}
function formatLongDate(dateString) {
  return formatDate(dateString, { weekday: "short" });
}
function formatFullDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date);
}
function getTodayName() { return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date()); }
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return t("dashboard.greeting.morning");
  if (hour < 18) return t("dashboard.greeting.afternoon");
  return t("dashboard.greeting.evening");
}
function isOverdue(item) { return !item.done && new Date(`${item.dueDate}T23:59:59`) < new Date(); }
function getTodayClasses() { return data.schedule.filter(item => item.day === getTodayName()).sort((a, b) => a.time.localeCompare(b.time)); }
function getNextClass() {
  const now = new Date();
  const today = getTodayName();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const todayUpcoming = getTodayClasses().find(item => item.end > currentTime);
  if (todayUpcoming) return { ...todayUpcoming, isToday: true };
  const todayIndex = DAYS.indexOf(today);
  const upcoming = [];
  for (let offset = 1; offset <= 7; offset += 1) {
    const day = DAYS[(todayIndex + offset) % 7];
    data.schedule.filter(item => item.day === day).forEach(item => upcoming.push({ ...item, isToday: false, offset }));
    if (upcoming.length) break;
  }
  return upcoming.length ? { ...upcoming.sort((a, b) => a.time.localeCompare(b.time))[0] } : null;
}
function getCurrentClass() {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return getTodayClasses().find(item => item.time <= time && item.end > time) || null;
}
function sortAssignments(items) {
  return [...items].sort((a, b) => {
    if (a.done !== b.done) return Number(a.done) - Number(b.done);
    const overdueOrder = Number(isOverdue(a)) - Number(isOverdue(b));
    return overdueOrder || a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title);
  });
}

function render(immediate = false) {
  const update = () => {
    document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.section === currentSection));
    topbarTitle.textContent = sectionTitle(currentSection);
    if (currentSection === "dashboard") renderDashboard();
    if (currentSection === "schedule") renderSchedule();
    if (currentSection === "calendar") renderCalendar();
    if (currentSection === "assignments") renderAssignments();
    if (currentSection === "settings") renderSettings();
    bindRenderedInteractions();
  };
  if (immediate || typeof document.startViewTransition !== "function") update();
  else { try { document.startViewTransition(update); } catch (_) { update(); } }
}
function sectionTitle(section) {
  return { dashboard: "Teknik Informatika 2026 B", schedule: t("nav.schedule"), calendar: t("nav.calendar"), assignments: t("nav.assignments"), settings: t("nav.settings") }[section] || "KELASIN";
}

function renderDashboard() {
  const pending = data.assignments.filter(item => !item.done).length;
  const overdue = data.assignments.filter(isOverdue).length;
  const todayClasses = getTodayClasses();
  const nextClass = getNextClass();
  const currentClass = getCurrentClass();
  const upcoming = sortAssignments(data.assignments.filter(item => !item.done)).slice(0, 4);
  const nextLabel = currentClass ? t("stat.now") : nextClass ? (nextClass.isToday ? nextClass.time : `${nextClass.day.slice(0, 3)} ${nextClass.time}`) : t("stat.noClass");
  const nextHint = currentClass ? `${currentClass.subject} ${t("common.inProgress")}` : nextClass ? `${nextClass.subject} · ${nextClass.room || t("common.noRoom")}` : t("stat.noClass");
  page.innerHTML = `
    <section class="hero">
      <div class="hero-main"><p class="eyebrow">${t("dashboard.label")}</p><h1>${getGreeting()}, Mikael.</h1><p class="hero-copy">${t("dashboard.copy")}</p></div>
      <div class="hero-actions"><button class="secondary-button" type="button" data-action="add-schedule">${icon("calendar-plus")} ${t("action.addClass")}</button><button class="primary-button" type="button" data-action="add-assignment">${icon("plus")} ${t("action.addAssignment")}</button></div>
    </section>
    <section class="grid stats" aria-label="${escapeAttribute(t("dashboard.today"))}">${statCard(t("stat.classesToday"), todayClasses.length, t("stat.classesHint"), "calendar")}${statCard(t("stat.pending"), pending, overdue ? `${overdue} ${t("stat.overdue")}` : t("stat.noneOverdue"), "list")}${statCard(t("stat.nextClass"), nextLabel, nextHint, "arrow")}</section>
    <section class="grid content-grid">
      <article class="card"><div class="section-heading"><div><p class="section-kicker">${t("dashboard.todayHeading")}</p><h2>${todayNameLabel()}</h2></div><button class="link-button" type="button" data-section-link="schedule">${t("action.fullSchedule")} ${icon("arrow-right")}</button></div>${renderTodayList(todayClasses)}</article>
      <article class="card"><div class="section-heading"><div><p class="section-kicker">${t("dashboard.keepMoving")}</p><h2>${t("dashboard.upcoming")}</h2></div><button class="link-button" type="button" data-section-link="assignments">${t("action.viewAll")} ${icon("arrow-right")}</button></div>${upcoming.length ? `<div class="list">${upcoming.map(renderDashboardAssignment).join("")}</div>` : emptyState(t("dashboard.caughtUp"), t("dashboard.noPending"))}</article>
    </section>
    <section class="card quick-note"><div class="quick-note-copy"><span class="soft-icon">${icon("database")}</span><div><strong>${t("dashboard.localTitle")}</strong><p>${t("dashboard.localCopy")}</p></div></div><button class="link-button" type="button" data-action="restore-data">${t("dashboard.restore")} ${icon("arrow-right")}</button></section>
  `;
}
function statCard(label, value, hint, iconName) { return `<article class="card stat-card"><div class="stat-top"><span class="label">${escapeHtml(label)}</span><span class="stat-icon">${icon(iconName)}</span></div><div class="value">${escapeHtml(value)}</div><div class="hint">${escapeHtml(hint)}</div></article>`; }
function todayNameLabel() { return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", { weekday: "long", month: "short", day: "numeric" }).format(new Date()); }
function renderTodayList(items) {
  if (!items.length) return emptyState(t("schedule.noToday"), t("calendar.noClassesCopy"));
  const current = getCurrentClass();
  return `<div class="list">${items.map(item => `<div class="list-item ${current?.id === item.id ? "is-current" : ""}"><div class="time-block"><strong>${escapeHtml(item.time)}</strong><span>${escapeHtml(item.end)}</span></div><div class="body"><strong>${escapeHtml(item.subject)}</strong><span>${escapeHtml(item.room || t("common.noRoom"))}</span></div>${current?.id === item.id ? `<span class="badge accent">${t("stat.now")}</span>` : ""}</div>`).join("")}</div>`;
}
function renderDashboardAssignment(item) {
  const status = isOverdue(item) ? t("calendar.overdue") : formatDueLabel(item.dueDate);
  return `<button class="list-item list-item-button" type="button" data-edit-assignment="${escapeAttribute(item.id)}"><span class="status-dot"></span><div class="body"><strong class="title">${escapeHtml(item.title)}</strong><span>${escapeHtml(item.subject)} · ${formatDate(item.dueDate)}</span></div><span class="badge ${isOverdue(item) ? "warning" : ""}">${escapeHtml(status)}</span></button>`;
}
function formatDueLabel(dateString) {
  const target = new Date(`${dateString}T23:59:59`);
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const targetDay = new Date(target); targetDay.setHours(0, 0, 0, 0);
  const diff = Math.round((targetDay - start) / 86400000);
  if (diff === 0) return t("common.today");
  if (diff === 1) return t("common.tomorrow");
  return formatDate(dateString);
}

function renderSchedule() {
  const grouped = DAYS.map(day => ({ day, classes: data.schedule.filter(item => item.day === day).sort((a, b) => a.time.localeCompare(b.time)) })).filter(group => group.classes.length);
  const today = getTodayName();
  page.innerHTML = `<section class="hero"><div class="hero-main"><p class="eyebrow">${t("schedule.label")}</p><h1>${t("schedule.title")}</h1><p class="hero-copy">${t("schedule.copy")}</p></div><div class="hero-actions"><button class="secondary-button" type="button" data-section-link="calendar">${icon("calendar-days")} ${t("action.goCalendar")}</button><button class="primary-button" type="button" data-action="add-schedule">${icon("plus")} ${t("action.addClass")}</button></div></section><article class="card schedule-card">${grouped.length ? grouped.map(group => `<section class="day-section ${group.day === today ? "is-today" : ""}"><div class="day-heading"><div><span class="day-name">${translateDay(group.day)}</span>${group.day === today ? `<span class="today-chip">${t("schedule.today")}</span>` : ""}</div><span class="day-count">${group.classes.length} ${group.classes.length === 1 ? t("schedule.class") : t("schedule.classes")}</span></div><div class="schedule-list">${group.classes.map(renderScheduleRow).join("")}</div></section>`).join("") : emptyState(t("schedule.emptyTitle"), t("schedule.emptyCopy"))}</article>`;
}
function renderScheduleRow(item) {
  return `<div class="schedule-row"><div class="schedule-time"><strong>${escapeHtml(item.time)}</strong><span>${escapeHtml(item.end)}</span></div><div class="schedule-main"><strong>${escapeHtml(item.subject)}</strong><span>${escapeHtml(item.room || t("common.noRoom"))}</span></div><div class="row-actions"><button class="icon-button small" type="button" title="${t("action.edit")}" aria-label="${escapeAttribute(t("action.edit"))} ${escapeAttribute(item.subject)}" data-edit-schedule="${escapeAttribute(item.id)}">${icon("pencil")}</button><button class="icon-button small danger-hover" type="button" title="${t("action.delete")}" aria-label="${escapeAttribute(t("action.delete"))} ${escapeAttribute(item.subject)}" data-delete-schedule="${escapeAttribute(item.id)}">${icon("trash")}</button></div></div>`;
}

function getDayNameForDate(date) { const sundayBased = date.getDay(); return DAYS[sundayBased === 0 ? 6 : sundayBased - 1]; }
function getScheduleForDate(date) { return data.schedule.filter(item => item.day === getDayNameForDate(date)).sort((a, b) => a.time.localeCompare(b.time)); }
function getAssignmentsForDate(date) { const key = isoDate(date); return sortAssignments(data.assignments.filter(item => item.dueDate === key)); }
function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function monthTitle(date) { return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", { month: "long", year: "numeric" }).format(date); }
function formatSelectedDay(dateString) { return formatFullDate(dateString); }
function translateDay(day) { return language === "en" ? day : ({ Monday: "Senin", Tuesday: "Selasa", Wednesday: "Rabu", Thursday: "Kamis", Friday: "Jumat", Saturday: "Sabtu", Sunday: "Minggu" })[day]; }
function dayAbbrev(day) { const map = { Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun" }; return t(`week.${map[day]}`); }

function renderCalendar() {
  const monthStart = startOfMonth(calendarCursor);
  const offset = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 0).getDate();
  const cellCount = Math.ceil((offset + daysInMonth) / 7) * 7;
  const todayKey = isoDate(new Date());
  const selectedKey = selectedCalendarDate;
  const selectedDate = new Date(`${selectedKey}T00:00:00`);
  const selectedSchedule = getScheduleForDate(selectedDate);
  const selectedAssignments = getAssignmentsForDate(selectedDate);
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(key => t(`week.${key}`));
  const cells = Array.from({ length: cellCount }, (_, index) => {
    const dayNumber = index - offset + 1;
    const date = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth(), dayNumber);
    const inMonth = date.getMonth() === calendarCursor.getMonth();
    const key = isoDate(date);
    const schedule = getScheduleForDate(date);
    const due = getAssignmentsForDate(date);
    const visibleEvents = schedule.slice(0, 2);
    const moreCount = schedule.length - visibleEvents.length;
    return `<article class="calendar-day ${inMonth ? "" : "is-outside"} ${key === todayKey ? "is-today" : ""} ${key === selectedKey ? "is-selected" : ""}"><button class="calendar-date-button" type="button" data-calendar-date="${key}" aria-label="${escapeAttribute(formatSelectedDay(key))}" aria-pressed="${key === selectedKey}"><span>${date.getDate()}</span>${key === todayKey ? '<i class="calendar-today-dot" aria-hidden="true"></i>' : ''}</button><div class="calendar-events">${visibleEvents.map(item => `<button class="calendar-event" type="button" data-calendar-edit-schedule="${escapeAttribute(item.id)}"><span>${escapeHtml(item.time)}</span><strong>${escapeHtml(item.subject)}</strong></button>`).join("")}${moreCount > 0 ? `<button class="calendar-more" type="button" data-calendar-date="${key}">+${moreCount} more</button>` : ""}${due.length ? `<button class="calendar-due" type="button" data-calendar-date="${key}">${due.length} ${t("calendar.due")}</button>` : ""}</div></article>`;
  }).join("");
  page.innerHTML = `<section class="hero calendar-hero"><div class="hero-main"><p class="eyebrow">${t("calendar.label")}</p><h1>${t("calendar.title")}</h1><p class="hero-copy">${t("calendar.copy")}</p></div><div class="hero-actions"><button class="secondary-button" type="button" data-calendar-action="today">${t("action.today")}</button><button class="primary-button" type="button" data-calendar-action="add-class">${icon("plus")} ${t("action.addClass")}</button></div></section><section class="calendar-layout"><article class="card calendar-card"><div class="calendar-toolbar"><div class="calendar-title-wrap"><button class="icon-button small" type="button" data-calendar-action="prev" aria-label="${escapeAttribute(t("action.previous"))}">${icon("chevron-left")}</button><h2>${escapeHtml(monthTitle(calendarCursor))}</h2><button class="icon-button small" type="button" data-calendar-action="next" aria-label="${escapeAttribute(t("action.next"))}">${icon("chevron-right")}</button></div><span class="calendar-hint">${data.schedule.length} ${t("calendar.scheduleCount")}</span></div><div class="calendar-grid calendar-weekdays" aria-hidden="true">${dayLabels.map(label => `<span>${label}</span>`).join("")}</div><div class="calendar-grid calendar-month-grid">${cells}</div></article><article class="card calendar-agenda"><div class="section-heading"><div><p class="section-kicker">${t("calendar.selected")}</p><h2>${escapeHtml(formatSelectedDay(selectedKey))}</h2></div><button class="link-button" type="button" data-calendar-action="add-class">${t("action.addClass")} ${icon("arrow-right")}</button></div>${renderAgendaBlock(t("calendar.classes"), selectedSchedule.length ? selectedSchedule.map(item => `<button class="agenda-item" type="button" data-calendar-edit-schedule="${escapeAttribute(item.id)}"><span class="agenda-time">${escapeHtml(item.time)}</span><span class="agenda-copy"><strong>${escapeHtml(item.subject)}</strong><span>${escapeHtml(item.room || t("common.noRoom"))}</span></span>${icon("chevron-right")}</button>`).join("") : emptyState(t("calendar.noClasses"), t("calendar.noClassesCopy")))}${renderAgendaBlock(t("calendar.assignments"), selectedAssignments.length ? selectedAssignments.map(item => `<button class="agenda-item" type="button" data-calendar-edit-assignment="${escapeAttribute(item.id)}"><span class="agenda-dot ${item.done ? "is-done" : isOverdue(item) ? "is-overdue" : ""}"></span><span class="agenda-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.subject)} · ${escapeHtml(item.done ? t("calendar.done") : isOverdue(item) ? t("calendar.overdue") : t("calendar.due"))}</span></span>${icon("chevron-right")}</button>`).join("") : emptyState(t("calendar.noAssignments"), t("calendar.noAssignmentsCopy")))}</article></section>`;
}
function renderAgendaBlock(label, body) { return `<section class="agenda-block"><div class="agenda-label"><span>${label}</span></div>${body}</section>`; }

function renderAssignments() {
  const filtered = data.assignments.filter(item => {
    const searchMatch = `${item.title} ${item.subject}`.toLowerCase().includes(assignmentQuery.toLowerCase());
    const filterMatch = assignmentFilter === "all" || (assignmentFilter === "pending" && !item.done) || (assignmentFilter === "done" && item.done) || (assignmentFilter === "overdue" && isOverdue(item));
    return searchMatch && filterMatch;
  });
  const counts = { all: data.assignments.length, pending: data.assignments.filter(item => !item.done).length, done: data.assignments.filter(item => item.done).length, overdue: data.assignments.filter(isOverdue).length };
  page.innerHTML = `<section class="hero"><div class="hero-main"><p class="eyebrow">${t("assignments.label")}</p><h1>${t("assignments.title")}</h1><p class="hero-copy">${t("assignments.copy")}</p></div><div class="hero-actions"><button class="primary-button" type="button" data-action="add-assignment">${icon("plus")} ${t("action.addAssignment")}</button></div></section><section class="card"><div class="page-toolbar"><label class="search-wrap"><span class="sr-only">${t("settings.shortcutSearch")}</span>${icon("search")}<input class="input search" id="assignmentSearch" type="search" placeholder="${escapeAttribute(t("assignments.search"))}" value="${escapeAttribute(assignmentQuery)}" autocomplete="off"></label><div class="filter-tabs" role="tablist">${filterTab("all", t("filter.all"), counts.all)}${filterTab("pending", t("filter.pending"), counts.pending)}${filterTab("done", t("filter.done"), counts.done)}${filterTab("overdue", t("filter.overdue"), counts.overdue)}</div></div>${filtered.length ? `<div class="assignment-list">${filtered.map(renderAssignmentRow).join("")}</div>` : emptyState(t("assignments.empty"), assignmentQuery ? t("assignments.searchEmpty") : t("assignments.emptyCopy"))}</section>`;
}
function filterTab(key, label, count) { return `<button class="filter-tab ${assignmentFilter === key ? "active" : ""}" type="button" role="tab" aria-selected="${assignmentFilter === key}" data-assignment-filter="${key}"><span>${label}</span><b>${count}</b></button>`; }
function renderAssignmentRow(item) { return `<div class="assignment-row ${item.done ? "done" : ""}"><label class="check-wrap"><input type="checkbox" ${item.done ? "checked" : ""} data-toggle-assignment="${escapeAttribute(item.id)}"><span class="custom-check"></span><span class="sr-only">${escapeHtml(item.title)}</span></label><div class="assignment-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.subject)}</span></div><div class="assignment-due"><strong>${formatDate(item.dueDate)}</strong><span>${formatLongDate(item.dueDate)}</span></div><span class="badge ${isOverdue(item) ? "warning" : item.done ? "success" : ""}">${escapeHtml(item.done ? t("calendar.done") : isOverdue(item) ? t("calendar.overdue") : formatDueLabel(item.dueDate))}</span><div class="row-actions"><button class="icon-button small" type="button" title="${t("action.edit")}" aria-label="${escapeAttribute(t("action.edit"))} ${escapeAttribute(item.title)}" data-edit-assignment="${escapeAttribute(item.id)}">${icon("pencil")}</button><button class="icon-button small danger-hover" type="button" title="${t("action.delete")}" aria-label="${escapeAttribute(t("action.delete"))} ${escapeAttribute(item.title)}" data-delete-assignment="${escapeAttribute(item.id)}">${icon("trash")}</button></div></div>`; }

function renderSettings() {
  const theme = currentTheme();
  page.innerHTML = `<section class="hero"><div class="hero-main"><p class="eyebrow">${t("settings.label")}</p><h1>${t("settings.title")}</h1><p class="hero-copy">${t("settings.copy")}</p></div></section><section class="settings-grid"><article class="card settings-card"><div class="settings-section-head"><div><p class="section-kicker">${t("settings.appearance")}</p><h2>${t("settings.appearance")}</h2><p>${t("settings.appearanceCopy")}</p></div></div><div class="setting-row"><div><strong>${t("settings.theme")}</strong><span>${theme === "dark" ? t("settings.themeDark") : t("settings.themeLight")}</span></div><div class="segmented-control" role="group" aria-label="${escapeAttribute(t("settings.theme"))}"><button type="button" class="segment-button ${theme === "dark" ? "active" : ""}" data-setting-theme="dark">${icon("moon")} ${t("settings.themeDark")}</button><button type="button" class="segment-button ${theme === "light" ? "active" : ""}" data-setting-theme="light">${icon("sun")} ${t("settings.themeLight")}</button></div></div><div class="setting-row"><div><strong>${t("settings.language")}</strong><span>${t("settings.languageCopy")}</span></div><button class="secondary-button setting-action" type="button" data-action="toggle-language">${language === "en" ? "English" : "Bahasa Indonesia"}</button></div></article><article class="card settings-card"><div class="settings-section-head"><div><p class="section-kicker">${t("settings.data")}</p><h2>${t("settings.data")}</h2><p>${t("settings.dataCopy")}</p></div></div><div class="setting-row"><div><strong>${t("settings.export")}</strong><span>JSON</span></div><button class="secondary-button setting-action" type="button" data-action="export-data">${icon("download")} ${t("settings.export")}</button></div><div class="setting-row"><div><strong>${t("settings.import")}</strong><span>JSON</span></div><button class="secondary-button setting-action" type="button" data-action="import-data">${icon("upload")} ${t("settings.import")}</button></div><div class="setting-row setting-row-danger"><div><strong>${t("settings.restore")}</strong><span>${t("settings.restoreCopy")}</span></div><button class="secondary-button setting-action danger-outline" type="button" data-action="restore-data">${t("settings.restore")}</button></div></article><article class="card settings-card"><div class="settings-section-head"><div><p class="section-kicker">${t("settings.shortcuts")}</p><h2>${t("settings.shortcuts")}</h2><p>${t("settings.shortcutsCopy")}</p></div></div><div class="shortcut-list"><div><kbd>N</kbd><span>${t("settings.shortcutNewClass")}</span></div><div><kbd>A</kbd><span>${t("settings.shortcutNewAssignment")}</span></div><div><kbd>/</kbd><span>${t("settings.shortcutSearch")}</span></div><div><kbd>Esc</kbd><span>${t("settings.shortcutEscape")}</span></div></div></article><article class="card settings-card settings-about"><div class="about-mark"><img src="assets/icon.svg" alt="" aria-hidden="true"></div><div><p class="section-kicker">${t("settings.about")}</p><h2>KELASIN</h2><p>${t("settings.aboutCopy")}</p><dl><div><dt>${t("settings.version")}</dt><dd>${APP_VERSION}</dd></div><div><dt>${t("settings.storage")}</dt><dd>${t("settings.local")}</dd></div></dl></div></article></section>`;
}

function emptyState(title, message) { return `<div class="empty"><div class="empty-icon">${icon("sparkles")}</div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p></div>`; }
function findItem(type, id) { const list = type === "assignment" ? data.assignments : data.schedule; return list.find(item => String(item.id) === String(id)) || null; }

function openModal(type, id = null, options = {}) {
  lastFocusedElement = document.activeElement;
  const item = id ? findItem(type, id) : null;
  modalState = { type, id, prefillDay: options.prefillDay || null };
  document.getElementById("modalEyebrow").textContent = item ? t("modal.edit") : t("modal.new");
  document.getElementById("modalTitle").textContent = type === "assignment" ? (item ? t("modal.editAssignment") : t("modal.addAssignment")) : (item ? t("modal.editClass") : t("modal.addClass"));
  modalForm.innerHTML = type === "assignment" ? assignmentFormMarkup(item) : scheduleFormMarkup(item, modalState.prefillDay);
  modalBackdrop.classList.remove("hidden"); document.body.classList.add("modal-open");
  requestAnimationFrame(() => (modalForm.querySelector("input, select") || modalClose).focus());
}
function assignmentFormMarkup(item) {
  const dueDate = item?.dueDate || isoDate(new Date());
  return `<div class="form-grid"><div class="field"><label for="assignmentTitle">${t("field.assignment")}</label><input class="input" id="assignmentTitle" maxlength="80" required placeholder="${escapeAttribute(t("placeholder.assignment"))}" value="${escapeAttribute(item?.title || "")}"><span class="field-error" data-error-for="assignmentTitle"></span></div><div class="field"><label for="assignmentSubject">${t("field.subject")}</label><input class="input" id="assignmentSubject" maxlength="60" required placeholder="${escapeAttribute(t("placeholder.subject"))}" value="${escapeAttribute(item?.subject || "")}"><span class="field-error" data-error-for="assignmentSubject"></span></div><div class="field"><label for="assignmentDue">${t("field.dueDate")}</label><input class="input" id="assignmentDue" type="date" required value="${escapeAttribute(dueDate)}"><span class="field-error" data-error-for="assignmentDue"></span></div><div class="form-hint">${t("form.hint")}</div><div class="form-actions"><button type="button" class="secondary-button" data-modal-cancel>${t("action.cancel")}</button><button type="submit" class="primary-button">${item ? t("action.saveChanges") : t("action.saveAssignment")}</button></div></div>`;
}
function scheduleFormMarkup(item, prefillDay = null) {
  const day = item?.day || prefillDay || getTodayName();
  return `<div class="form-grid"><div class="field"><label for="scheduleSubject">${t("field.subject")}</label><input class="input" id="scheduleSubject" maxlength="60" required placeholder="${escapeAttribute(t("placeholder.subject"))}" value="${escapeAttribute(item?.subject || "")}"><span class="field-error" data-error-for="scheduleSubject"></span></div><div class="field"><label for="scheduleDay">${t("field.day")}</label><select class="select" id="scheduleDay">${DAYS.map(option => `<option value="${option}" ${option === day ? "selected" : ""}>${translateDay(option)}</option>`).join("")}</select><span class="field-error" data-error-for="scheduleDay"></span></div><div class="form-two"><div class="field"><label for="scheduleStart">${t("field.start")}</label><input class="input" id="scheduleStart" type="time" required value="${escapeAttribute(item?.time || "09:00")}"><span class="field-error" data-error-for="scheduleStart"></span></div><div class="field"><label for="scheduleEnd">${t("field.end")}</label><input class="input" id="scheduleEnd" type="time" required value="${escapeAttribute(item?.end || "10:40")}"><span class="field-error" data-error-for="scheduleEnd"></span></div></div><div class="field"><label for="scheduleRoom">${t("field.room")}</label><input class="input" id="scheduleRoom" maxlength="40" placeholder="${escapeAttribute(t("placeholder.room"))}" value="${escapeAttribute(item?.room || "")}"><span class="field-error" data-error-for="scheduleRoom"></span></div><div class="form-hint">${t("form.hint")}</div><div class="form-actions"><button type="button" class="secondary-button" data-modal-cancel>${t("action.cancel")}</button><button type="submit" class="primary-button">${item ? t("action.saveChanges") : t("action.saveClass")}</button></div></div>`;
}
function setFieldError(input, message) { const error = document.querySelector(`[data-error-for="${CSS.escape(input.id)}"]`); input.classList.toggle("has-error", Boolean(message)); if (error) error.textContent = message || ""; }
function validateAssignmentForm() {
  let valid = true;
  const title = document.getElementById("assignmentTitle"); const subject = document.getElementById("assignmentSubject"); const dueDate = document.getElementById("assignmentDue");
  setFieldError(title, title.value.trim() ? "" : t("form.enterAssignment")); valid &&= Boolean(title.value.trim());
  setFieldError(subject, subject.value.trim() ? "" : t("form.enterSubject")); valid &&= Boolean(subject.value.trim());
  setFieldError(dueDate, dueDate.value ? "" : t("form.enterDue")); valid &&= Boolean(dueDate.value);
  return valid;
}
function validateScheduleForm() {
  let valid = true;
  const subject = document.getElementById("scheduleSubject"); const day = document.getElementById("scheduleDay"); const start = document.getElementById("scheduleStart"); const end = document.getElementById("scheduleEnd"); const room = document.getElementById("scheduleRoom");
  setFieldError(subject, subject.value.trim() ? "" : t("form.enterSubject")); valid &&= Boolean(subject.value.trim());
  setFieldError(day, day.value ? "" : t("form.enterDay")); valid &&= Boolean(day.value);
  setFieldError(start, start.value ? "" : t("form.enterStart")); valid &&= Boolean(start.value);
  setFieldError(end, end.value ? "" : t("form.enterEnd")); valid &&= Boolean(end.value);
  setFieldError(room, room.value.trim() ? "" : t("form.enterRoom")); valid &&= Boolean(room.value.trim());
  if (valid && end.value <= start.value) { setFieldError(end, t("form.invalidTime")); valid = false; }
  if (valid && hasScheduleConflict({ day: day.value, time: start.value, end: end.value, id: modalState.id })) { setFieldError(end, t("form.conflict")); valid = false; }
  return valid;
}
function hasScheduleConflict(candidate) {
  return data.schedule.some(item => String(item.id) !== String(candidate.id || "") && item.day === candidate.day && candidate.time < item.end && candidate.end > item.time);
}
function closeModal() {
  if (modalBackdrop.classList.contains("hidden")) return;
  modalState = null; modalBackdrop.classList.add("hidden"); document.body.classList.remove("modal-open"); modalForm.innerHTML = ""; lastFocusedElement?.focus?.(); lastFocusedElement = null;
}
function handleModalSubmit(event) {
  event.preventDefault();
  if (!modalState) return;
  if (modalState.type === "assignment") {
    if (!validateAssignmentForm()) return;
    const next = { id: modalState.id || makeId(), title: document.getElementById("assignmentTitle").value.trim(), subject: document.getElementById("assignmentSubject").value.trim(), dueDate: document.getElementById("assignmentDue").value, done: modalState.id ? findItem("assignment", modalState.id).done : false };
    const index = data.assignments.findIndex(item => String(item.id) === String(modalState.id));
    if (index >= 0) data.assignments[index] = next; else data.assignments.push(next);
  } else {
    if (!validateScheduleForm()) return;
    const next = { id: modalState.id || makeId(), subject: document.getElementById("scheduleSubject").value.trim(), day: document.getElementById("scheduleDay").value, time: document.getElementById("scheduleStart").value, end: document.getElementById("scheduleEnd").value, room: document.getElementById("scheduleRoom").value.trim() };
    const index = data.schedule.findIndex(item => String(item.id) === String(modalState.id));
    if (index >= 0) data.schedule[index] = next; else data.schedule.push(next);
  }
  const editing = Boolean(modalState.id);
  saveData(); closeModal(); render(); showToast(t("toast.saved"));
  if (!editing) selectedCalendarDate = selectedCalendarDate;
}

function toggleAssignment(id, checked) {
  const item = findItem("assignment", id); if (!item) return;
  item.done = checked; saveData(); render(); showToast(checked ? t("toast.completed") : t("toast.reopened"));
}
function requestDelete(type, id) {
  const item = findItem(type, id); if (!item) return;
  openConfirm({ type: "delete", typeToDelete: type, id, title: item.title || item.subject });
}
function deleteItem(type, id) {
  if (type === "assignment") data.assignments = data.assignments.filter(item => String(item.id) !== String(id));
  else data.schedule = data.schedule.filter(item => String(item.id) !== String(id));
  saveData(); render(); showToast(t("toast.deleted"));
}
function openConfirm(state) {
  lastConfirmFocusedElement = document.activeElement;
  confirmState = state;
  const isRestore = state.type === "restore";
  confirmEyebrow.textContent = isRestore ? t("confirm.restoreEyebrow") : "CONFIRM";
  confirmTitle.textContent = isRestore ? t("confirm.restoreTitle") : t("confirm.deleteTitle");
  confirmMessage.textContent = isRestore ? t("confirm.restoreMessage") : `${state.title ? `“${state.title}” ` : ""}${t("confirm.deleteMessage")}`;
  confirmProceed.textContent = isRestore ? t("confirm.restore") : t("confirm.delete");
  confirmProceed.classList.toggle("danger-button", true);
  confirmIcon.innerHTML = icon(isRestore ? "refresh" : "trash");
  confirmBackdrop.classList.remove("hidden"); document.body.classList.add("modal-open");
  requestAnimationFrame(() => confirmProceed.focus());
}
function closeConfirm() {
  if (confirmBackdrop.classList.contains("hidden")) return;
  confirmState = null; confirmBackdrop.classList.add("hidden"); document.body.classList.remove("modal-open"); lastConfirmFocusedElement?.focus?.(); lastConfirmFocusedElement = null;
}
function handleConfirmProceed() {
  if (!confirmState) return;
  if (confirmState.type === "restore") {
    data = buildDefaultData(); assignmentQuery = ""; assignmentFilter = "all"; selectedCalendarDate = isoDate(new Date()); calendarCursor = startOfMonth(new Date()); saveData(); closeConfirm(); render(true); showToast(t("toast.restored")); return;
  }
  deleteItem(confirmState.typeToDelete, confirmState.id); closeConfirm();
}

function requestRestore() { openConfirm({ type: "restore" }); }
function showToast(message, tone = "success") { clearTimeout(toastTimer); toastRegion.innerHTML = `<div class="toast ${tone}"><span class="toast-icon">${icon(tone === "error" ? "alert" : "check")}</span><span>${escapeHtml(message)}</span></div>`; toastTimer = setTimeout(() => { toastRegion.innerHTML = ""; }, 2600); }

function exportData() {
  const payload = { app: "KELASIN", version: DATA_VERSION, exportedAt: new Date().toISOString(), data: clone(data) };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `kelasin-backup-${isoDate(new Date())}.json`; link.click(); URL.revokeObjectURL(url); showToast(t("toast.exported"));
}
async function importData(file) {
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const candidate = parsed?.app === "KELASIN" ? parsed.data : parsed;
    if (!candidate || !Array.isArray(candidate.assignments) || !Array.isArray(candidate.schedule)) throw new Error("invalid");
    const sanitized = sanitizeData(candidate);
    if (!sanitized.assignments.every(isValidAssignment) || !sanitized.schedule.every(isValidSchedule)) throw new Error("invalid");
    data = sanitized; saveData(); assignmentQuery = ""; assignmentFilter = "all"; render(true); showToast(t("toast.imported"));
  } catch (error) { console.error("KELASIN: import failed.", error); showToast(t("toast.invalidBackup"), "error"); }
  importFileInput.value = "";
}

function setSidebarOpen(open) {
  sidebar.classList.toggle("open", open); mobileScrim.classList.toggle("visible", open); document.body.classList.toggle("menu-open", open); menuButton.setAttribute("aria-expanded", String(open)); menuButton.setAttribute("aria-label", open ? t("topbar.closeMenu") : t("topbar.openMenu"));
}
function navigate(section) { currentSection = section; setSidebarOpen(false); render(); }
function bindRenderedInteractions() {
  const search = document.getElementById("assignmentSearch");
  if (search) {
    search.addEventListener("input", event => { assignmentQuery = event.target.value; const cursor = event.target.selectionStart; render(true); const next = document.getElementById("assignmentSearch"); next?.focus(); next?.setSelectionRange(cursor, cursor); });
  }
}

function icon(name) {
  const icons = {
    grid: '<svg viewBox="0 0 24 24" class="svg-icon"><rect x="4" y="4" width="6" height="6" rx="1.5"></rect><rect x="14" y="4" width="6" height="6" rx="1.5"></rect><rect x="4" y="14" width="6" height="6" rx="1.5"></rect><rect x="14" y="14" width="6" height="6" rx="1.5"></rect></svg>',
    calendar: '<svg viewBox="0 0 24 24" class="svg-icon"><rect x="3" y="4.5" width="18" height="17" rx="2.5"></rect><line x1="16" y1="2.5" x2="16" y2="6.5"></line><line x1="8" y1="2.5" x2="8" y2="6.5"></line><line x1="3" y1="9" x2="21" y2="9"></line></svg>',
    "calendar-days": '<svg viewBox="0 0 24 24" class="svg-icon"><rect x="3" y="4.5" width="18" height="17" rx="2.5"></rect><line x1="16" y1="2.5" x2="16" y2="6.5"></line><line x1="8" y1="2.5" x2="8" y2="6.5"></line><line x1="3" y1="9" x2="21" y2="9"></line><path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01"></path></svg>',
    "calendar-plus": '<svg viewBox="0 0 24 24" class="svg-icon"><rect x="3" y="4.5" width="18" height="17" rx="2.5"></rect><line x1="16" y1="2.5" x2="16" y2="6.5"></line><line x1="8" y1="2.5" x2="8" y2="6.5"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="12" y1="13" x2="12" y2="18"></line><line x1="9.5" y1="15.5" x2="14.5" y2="15.5"></line></svg>',
    list: '<svg viewBox="0 0 24 24" class="svg-icon"><line x1="9" y1="6.5" x2="20" y2="6.5"></line><line x1="9" y1="12" x2="20" y2="12"></line><line x1="9" y1="17.5" x2="20" y2="17.5"></line><path d="M4 6.5h.01M4 12h.01M4 17.5h.01"></path></svg>',
    settings: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"></path><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06-1.63 1.63-.06-.06a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.66v.09h-2.3v-.09a1.8 1.8 0 0 0-1.1-1.66 1.8 1.8 0 0 0-1.98.36l-.06.06-1.63-1.63.06-.06A1.8 1.8 0 0 0 8.4 15a1.8 1.8 0 0 0-1.66-1.1h-.09v-2.3h.09A1.8 1.8 0 0 0 8.4 10.5a1.8 1.8 0 0 0-.36-1.98l-.06-.06 1.63-1.63.06.06a1.8 1.8 0 0 0 1.98.36A1.8 1.8 0 0 0 12.75 5.6v-.09h2.3v.09a1.8 1.8 0 0 0 1.1 1.66 1.8 1.8 0 0 0 1.98-.36l.06-.06 1.63 1.63-.06.06a1.8 1.8 0 0 0-.36 1.98 1.8 1.8 0 0 0 1.66 1.1h.09v2.3h-.09A1.8 1.8 0 0 0 19.4 15Z"></path></svg>',
    plus: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 5v14M5 12h14"></path></svg>',
    "arrow-right": '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>',
    arrow: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M5 12h12M13 6l6 6-6 6"></path></svg>',
    pencil: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="m4 16 9.9-9.9a2.1 2.1 0 0 1 3 0l1 1a2.1 2.1 0 0 1 0 3L8 20l-4 1 1-5Z"></path></svg>',
    trash: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M5 7h14M9 7V4h6v3M8 7l.7 13h6.6L16 7M10 10v7M14 10v7"></path></svg>',
    check: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="m5 12 4 4L19 6"></path></svg>',
    alert: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 8v5M12 17h.01"></path><path d="M10.3 4.8 3.9 16a2 2 0 0 0 1.75 3h12.7a2 2 0 0 0 1.75-3L13.7 4.8a2 2 0 0 0-3.4 0Z"></path></svg>',
    database: '<svg viewBox="0 0 24 24" class="svg-icon"><ellipse cx="12" cy="6.5" rx="7" ry="3"></ellipse><path d="M5 6.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6M5 12.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"></path></svg>',
    sun: '<svg viewBox="0 0 24 24" class="svg-icon"><circle cx="12" cy="12" r="3.5"></circle><path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>',
    moon: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M20 15.1A8.2 8.2 0 0 1 8.9 4a8.9 8.9 0 1 0 11.1 11.1Z"></path></svg>',
    "chevron-left": '<svg viewBox="0 0 24 24" class="svg-icon"><path d="m15 5-7 7 7 7"></path></svg>',
    "chevron-right": '<svg viewBox="0 0 24 24" class="svg-icon"><path d="m9 5 7 7-7 7"></path></svg>',
    menu: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>',
    x: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="m6 6 12 12M18 6 6 18"></path></svg>',
    download: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 4v10M8 10l4 4 4-4M5 19h14"></path></svg>',
    upload: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 20V10M8 14l4-4 4 4M5 5h14"></path></svg>',
    refresh: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M20 11a8 8 0 1 0 1 4M20 5v6h-6"></path></svg>',
    search: '<svg viewBox="0 0 24 24" class="svg-icon"><circle cx="10.8" cy="10.8" r="5.8"></circle><path d="m16 16 4.5 4.5"></path></svg>',
    sparkles: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="m12 3 1.4 4.1L17 8.5l-3.6 1.4L12 14l-1.4-4.1L7 8.5l3.6-1.4L12 3ZM18 13l.8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13Z"></path></svg>'
  };
  return icons[name] || "";
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]); }
function escapeAttribute(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }

// Global interactions
applyStaticLanguage();
languageCode.textContent = language.toUpperCase();
themeButton.innerHTML = icon(currentTheme() === "dark" ? "sun" : "moon");
installButton.innerHTML = icon("download");
menuButton.innerHTML = icon("menu");
modalClose.innerHTML = icon("x");

document.querySelectorAll(".nav-icon[data-icon]").forEach(element => { element.innerHTML = icon(element.dataset.icon); });

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-section]");
  if (nav) { navigate(nav.dataset.section); return; }
  const link = event.target.closest("[data-section-link]");
  if (link) { navigate(link.dataset.sectionLink); return; }
  const action = event.target.closest("[data-action]");
  if (action) {
    const name = action.dataset.action;
    if (name === "add-assignment") openModal("assignment");
    if (name === "add-schedule") openModal("schedule");
    if (name === "restore-data") requestRestore();
    if (name === "export-data") exportData();
    if (name === "import-data") importFileInput.click();
    if (name === "toggle-language") setLanguage(language === "en" ? "id" : "en");
    return;
  }
  const calendarAction = event.target.closest("[data-calendar-action]");
  if (calendarAction) {
    const actionName = calendarAction.dataset.calendarAction;
    if (actionName === "prev") calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1);
    if (actionName === "next") calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1);
    if (actionName === "today") { const today = new Date(); calendarCursor = startOfMonth(today); selectedCalendarDate = isoDate(today); }
    if (actionName === "add-class") { const target = new Date(`${selectedCalendarDate}T00:00:00`); openModal("schedule", null, { prefillDay: getDayNameForDate(target) }); }
    render(); return;
  }
  const dateButton = event.target.closest("[data-calendar-date]");
  if (dateButton) { selectedCalendarDate = dateButton.dataset.calendarDate; render(); return; }
  const calendarSchedule = event.target.closest("[data-calendar-edit-schedule]");
  if (calendarSchedule) { openModal("schedule", calendarSchedule.dataset.calendarEditSchedule); return; }
  const calendarAssignment = event.target.closest("[data-calendar-edit-assignment]");
  if (calendarAssignment) { openModal("assignment", calendarAssignment.dataset.calendarEditAssignment); return; }
  const filterTarget = event.target.closest("[data-assignment-filter]");
  if (filterTarget) { assignmentFilter = filterTarget.dataset.assignmentFilter; render(); return; }
  const toggle = event.target.closest("[data-toggle-assignment]");
  if (toggle) { toggleAssignment(toggle.dataset.toggleAssignment, toggle.checked); return; }
  const editAssignment = event.target.closest("[data-edit-assignment]");
  if (editAssignment) { openModal("assignment", editAssignment.dataset.editAssignment); return; }
  const deleteAssignmentButton = event.target.closest("[data-delete-assignment]");
  if (deleteAssignmentButton) { requestDelete("assignment", deleteAssignmentButton.dataset.deleteAssignment); return; }
  const editSchedule = event.target.closest("[data-edit-schedule]");
  if (editSchedule) { openModal("schedule", editSchedule.dataset.editSchedule); return; }
  const deleteScheduleButton = event.target.closest("[data-delete-schedule]");
  if (deleteScheduleButton) { requestDelete("schedule", deleteScheduleButton.dataset.deleteSchedule); return; }
  const settingTheme = event.target.closest("[data-setting-theme]");
  if (settingTheme) { toggleTheme(settingTheme.dataset.settingTheme); render(true); return; }
});

themeButton.addEventListener("click", () => toggleTheme());
languageButton.addEventListener("click", () => setLanguage(language === "en" ? "id" : "en"));
menuButton.addEventListener("click", () => setSidebarOpen(!sidebar.classList.contains("open")));
mobileScrim.addEventListener("click", () => setSidebarOpen(false));
modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", event => { if (event.target === modalBackdrop) closeModal(); });
modalForm.addEventListener("submit", handleModalSubmit);
modalForm.addEventListener("click", event => { if (event.target.closest("[data-modal-cancel]")) closeModal(); });
confirmCancel.addEventListener("click", closeConfirm);
confirmProceed.addEventListener("click", handleConfirmProceed);
confirmBackdrop.addEventListener("click", event => { if (event.target === confirmBackdrop) closeConfirm(); });
importFileInput.addEventListener("change", event => importData(event.target.files?.[0]));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") { if (!confirmBackdrop.classList.contains("hidden")) { closeConfirm(); return; } if (!modalBackdrop.classList.contains("hidden")) { closeModal(); return; } if (sidebar.classList.contains("open")) { setSidebarOpen(false); return; } }
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const target = event.target;
  const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target.isContentEditable;
  if (typing) return;
  if (event.key.toLowerCase() === "n") { event.preventDefault(); openModal("schedule"); }
  if (event.key.toLowerCase() === "a") { event.preventDefault(); openModal("assignment"); }
  if (event.key === "/") { event.preventDefault(); navigate("assignments"); requestAnimationFrame(() => document.getElementById("assignmentSearch")?.focus()); }
});

window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); deferredInstallPrompt = event; installButton.hidden = false; });
window.addEventListener("appinstalled", () => { deferredInstallPrompt = null; installButton.hidden = true; showToast(language === "id" ? "KELASIN berhasil dipasang." : "KELASIN was installed."); });
installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) { showToast(t("toast.installHelp"), "error"); return; }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null; installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(error => console.warn("KELASIN: service worker registration failed.", error));
  });
}

updateThemeColor();
try {
  const requestedSection = new URLSearchParams(window.location.search).get("section");
  if (["dashboard", "schedule", "calendar", "assignments", "settings"].includes(requestedSection)) currentSection = requestedSection;
} catch (_) {}
render(true);
