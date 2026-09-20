const STORAGE_KEY = "kelasin-data-v1";
const THEME_KEY = "kelasin-theme";
const LANGUAGE_KEY = "kelasin-language";
const USER_KEY = "kelasin-user";
const KELASIN_STORAGE_KEYS = [STORAGE_KEY, THEME_KEY, LANGUAGE_KEY, USER_KEY];
const DATA_VERSION = 1;
const APP_VERSION = "1.0";
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
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
const welcomeScreen = document.getElementById("welcomeScreen");
const welcomeName = document.getElementById("welcomeName");
const welcomeClass = document.getElementById("welcomeClass");
const welcomeContinue = document.getElementById("welcomeContinue");
const welcomeBack = document.getElementById("welcomeBack");
const welcomeFooter = document.getElementById("welcomeFooter");
const welcomeError = document.getElementById("welcomeError");
const welcomeClassError = document.getElementById("welcomeClassError");
const welcomeLanguageButton = document.getElementById("welcomeLanguageButton");
const welcomeLanguageCode = document.getElementById("welcomeLanguageCode");
const welcomeProgressLabel = document.getElementById("welcomeProgressLabel");
const welcomeProgressFill = document.getElementById("welcomeProgressFill");
const welcomeStepName = document.getElementById("welcomeStepName");
const welcomeStepClass = document.getElementById("welcomeStepClass");
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
let pendingImportData = null;
let welcomeStep = 1;
let toastTimer = null;
let deferredInstallPrompt = null;
let language = getStoredLanguage();
let calendarCursor = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  1,
);
let selectedCalendarDate = isoDate(new Date());

const translations = {
  en: {
    brandSubtitle: "Class dashboard",
    "welcome.step1.eyebrow": "YOUR CLASS SPACE",
    "welcome.step1.title": "Welcome to KELASIN",
    "welcome.step1.copy": "Let's make your class space feel like yours.",
    "welcome.step2.eyebrow": "CLASS DETAILS",
    "welcome.step2.title": "What are you working with?",
    "welcome.step2.copy":
      "Add your class or group name. You can change it later.",
    "welcome.nameLabel": "Your name",
    "welcome.placeholder": "Enter your name",
    "welcome.classLabel": "Class or group",
    "welcome.classPlaceholder": "Enter your class or group",
    "welcome.classHint": "This name appears in the app header.",
    "welcome.back": "Back",
    "welcome.continue": "Continue",
    "welcome.finish": "Open KELASIN",
    "welcome.error": "Please enter your name.",
    "welcome.errorLong": "Keep your name under 40 characters.",
    "welcome.classError": "Please enter your class or group name.",
    "welcome.classErrorLong":
      "Keep the class or group name under 60 characters.",
    "nav.main": "Main navigation",
    "nav.dashboard": "Dashboard",
    "nav.schedule": "Schedule",
    "nav.calendar": "Calendar",
    "nav.assignments": "Assignments",
    "nav.settings": "Settings",
    "topbar.changeLanguage": "Change language",
    "topbar.openMenu": "Open menu",
    "topbar.closeMenu": "Close menu",
    "topbar.install": "Install KELASIN",
    "topbar.light": "Switch to light mode",
    "topbar.dark": "Switch to dark mode",
    "dashboard.classFallback": "My class space",
    "dashboard.studentFallback": "Student",
    "dashboard.label": "Class space",
    "dashboard.today": "Today",
    "dashboard.greeting.morning": "Good morning",
    "dashboard.greeting.afternoon": "Good afternoon",
    "dashboard.greeting.evening": "Good evening",
    "dashboard.copy":
      "Classes, deadlines, and the little things worth remembering.",
    "action.addClass": "Add class",
    "action.addAssignment": "Add assignment",
    "action.addHoliday": "Add holiday",
    "action.saveHoliday": "Save holiday",
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
    "dashboard.caughtUp": "No upcoming assignments",
    "dashboard.noPending": "Add an assignment to see it here.",
    "dashboard.holiday": "Holiday",
    "dashboard.noClassesHoliday": "No classes today.",
    "schedule.label": "Weekly view",
    "schedule.title": "Schedule.",
    "schedule.copy":
      "A simple timetable that is easy to change when your week changes.",
    "schedule.emptyTitle": "No classes yet",
    "schedule.emptyCopy": "Add your first class to build your timetable.",
    "schedule.class": "class",
    "schedule.classes": "classes",
    "schedule.today": "Today",
    "calendar.label": "Month view",
    "calendar.title": "Calendar.",
    "calendar.copy":
      "Your weekly classes mapped onto real dates, with assignments shown where they are due.",
    "calendar.scheduleCount": "weekly classes",
    "calendar.selected": "Selected day",
    "calendar.classes": "Classes",
    "calendar.assignments": "Assignments",
    "calendar.noClasses": "No classes scheduled",
    "calendar.noClassesCopy": "Your schedule is clear on this day.",
    "calendar.holiday": "Holiday",
    "calendar.noClassesHoliday": "No classes today.",
    "calendar.noAssignments": "No assignments due",
    "calendar.noAssignmentsCopy": "Nothing is due on this date.",
    "calendar.addForDay": "Add class for this day",
    "calendar.noEvent": "No activity",
    "calendar.overdue": "Overdue",
    "calendar.done": "Done",
    "calendar.due": "Due",
    "calendar.more": "+{count} more",
    "assignments.label": "Your workload",
    "assignments.title": "Assignments.",
    "assignments.copy":
      "Keep deadlines visible without making your task list feel heavy.",
    "assignments.search": "Search assignments or subjects...",
    "filter.all": "All",
    "filter.pending": "Pending",
    "filter.done": "Done",
    "filter.overdue": "Overdue",
    "assignments.empty": "No assignments yet",
    "assignments.searchEmpty": "Try another search term.",
    "assignments.emptyCopy": "Add an assignment to get started.",
    "schedule.noToday": "No classes today",
    "holiday.title": "Holidays",
    "holiday.copy": "Set dates when classes do not take place.",
    "holiday.empty": "No holidays yet",
    "holiday.emptyCopy": "Add a holiday to skip recurring classes on a date.",
    "settings.label": "Preferences",
    "settings.title": "Settings.",
    "settings.copy":
      "Small controls for how KELASIN looks, behaves, and keeps your data.",
    "settings.profile": "Personalization",
    "settings.profileCopy": "Personalize your name and class or group name.",
    "settings.name": "Your name",
    "settings.nameCopy": "This is saved only in your browser.",
    "settings.namePlaceholder": "e.g. Mikael",
    "settings.className": "Class or group",
    "settings.classNameCopy": "Shown in the app header and your dashboard.",
    "settings.classNamePlaceholder": "Enter your class or group",
    "settings.saveProfile": "Save profile",
    "settings.appearance": "Appearance",
    "settings.appearanceCopy": "Choose the visual mode used across the app.",
    "settings.theme": "Theme",
    "settings.themeDark": "Dark",
    "settings.themeLight": "Light",
    "settings.language": "Language",
    "settings.languageCopy": "Switch the interface without changing your data.",
    "settings.data": "Your data",
    "settings.dataCopy":
      "Your classes and assignments are saved in this browser. Export a backup when you need a copy.",
    "settings.export": "Export backup",
    "settings.import": "Import backup",
    "settings.deleteData": "Delete all data",
    "settings.deleteDataCopy":
      "This will permanently remove your profile, classes, assignments, schedule, and saved preferences from this browser.",
    "settings.about": "About KELASIN",
    "settings.aboutCopy":
      "A small class manager built with HTML, CSS, and vanilla JavaScript.",
    "settings.version": "Version",
    "settings.storage": "Storage",
    "settings.local": "Local browser storage",
    "settings.json": "JSON",
    "settings.shortcuts": "Keyboard shortcuts",
    "settings.holidays": "Holidays",
    "settings.holidaysCopy": "Set dates when classes do not take place.",
    "settings.shortcutsCopy":
      "Use quick keys on desktop when you want to move faster.",
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
    "modal.addHoliday": "Add holiday",
    "modal.editHoliday": "Edit holiday",
    "field.assignment": "Assignment",
    "field.subject": "Subject",
    "field.dueDate": "Due date",
    "field.day": "Day",
    "field.start": "Starts",
    "field.end": "Ends",
    "field.room": "Room",
    "field.holidayName": "Holiday name",
    "field.date": "Date",
    "field.lecturer": "Lecturer",
    "placeholder.assignment": "e.g. C Assignment 02",
    "placeholder.subject": "e.g. Introduction to Programming",
    "placeholder.room": "e.g. Lab 2",
    "placeholder.holidayName": "e.g. Independence Day",
    "placeholder.lecturer": "e.g. Dr. John Doe, S.Kom., M.T.",
    "autocomplete.noResults": "No results",
    "form.enterAssignment": "Enter an assignment name.",
    "form.enterSubject": "Enter a subject name.",
    "form.enterDue": "Choose a due date.",
    "form.enterDay": "Choose a day.",
    "form.enterStart": "Choose a start time.",
    "form.enterEnd": "Choose an end time.",
    "form.invalidTime": "End time must be later than start time.",
    "form.conflict": "This time overlaps another class on the same day.",
    "form.enterRoom": "Add a room or location.",
    "form.enterHolidayName": "Enter a holiday name.",
    "form.enterHolidayDate": "Choose a date.",
    "form.duplicateHoliday": "A holiday already exists on this date.",
    "form.hint": "You can change this later.",
    "toast.saved": "Changes saved.",
    "toast.profileSaved": "Your profile was updated.",
    "toast.deleted": "Item deleted.",
    "toast.completed": "Assignment marked done.",
    "toast.reopened": "Assignment moved back to pending.",
    "toast.deletedAll": "All KELASIN data was deleted.",
    "toast.deleteError": "KELASIN could not delete all data from this browser.",
    "toast.exported": "Backup exported.",
    "toast.imported": "Backup imported.",
    "toast.invalidBackup": "That backup file is not valid KELASIN data.",
    "toast.storageError": "KELASIN could not save changes in this browser.",
    "toast.installHelp": "Use your browser's Install / Add to Dock option.",
    "toast.installed": "KELASIN was installed.",
    "confirm.label": "CONFIRM",
    "confirm.deleteDataEyebrow": "DATA",
    "confirm.importEyebrow": "BACKUP",
    "confirm.importTitle": "Import this backup?",
    "confirm.importMessage":
      "Your current classes and assignments will be replaced by the data in this backup file.",
    "confirm.import": "Import backup",
    "confirm.deleteDataTitle": "Delete all data?",
    "confirm.deleteDataMessage":
      "This cannot be undone. Your KELASIN data will be removed from this browser and the app will return to first launch.",
    "confirm.deleteTitle": "Delete this item?",
    "confirm.deleteMessage": "This action cannot be undone.",
    "confirm.cancel": "Cancel",
    "confirm.deleteAllData": "Delete all data",
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
    "week.Mon": "Mon",
    "week.Tue": "Tue",
    "week.Wed": "Wed",
    "week.Thu": "Thu",
    "week.Fri": "Fri",
    "week.Sat": "Sat",
    "week.Sun": "Sun",
  },
  id: {
    brandSubtitle: "Dashboard kelas",
    "welcome.step1.eyebrow": "RUANG KELAS KAMU",
    "welcome.step1.title": "Selamat datang di KELASIN",
    "welcome.step1.copy": "Yuk buat ruang kelas ini terasa seperti milik kamu.",
    "welcome.step2.eyebrow": "DETAIL KELAS",
    "welcome.step2.title": "Kamu dari kelas mana?",
    "welcome.step2.copy":
      "Masukkan Nama Prodi atau Kelas. Nanti bisa diubah lagi.",
    "welcome.nameLabel": "Nama kamu",
    "welcome.placeholder": "Masukkan nama kamu",
    "welcome.classLabel": "Prodi atau Kelas",
    "welcome.classPlaceholder": "Masukkan Prodi atau Kelas kamu",
    "welcome.classHint": "Nama ini akan tampil di header aplikasi.",
    "welcome.back": "Kembali",
    "welcome.continue": "Lanjutkan",
    "welcome.finish": "Buka KELASIN",
    "welcome.error": "Masukkan nama kamu terlebih dahulu.",
    "welcome.errorLong": "Nama maksimal 40 karakter.",
    "welcome.classError": "Masukkan nama Prodi atau kelas.",
    "welcome.classErrorLong": "Nama Prodi atau Kelas maksimal 60 karakter.",
    "nav.main": "Navigasi utama",
    "nav.dashboard": "Dashboard",
    "nav.schedule": "Jadwal",
    "nav.calendar": "Kalender",
    "nav.assignments": "Tugas",
    "nav.settings": "Pengaturan",
    "topbar.changeLanguage": "Ganti bahasa",
    "topbar.openMenu": "Buka menu",
    "topbar.closeMenu": "Tutup menu",
    "topbar.install": "Pasang KELASIN",
    "topbar.light": "Ganti ke mode terang",
    "topbar.dark": "Ganti ke mode gelap",
    "dashboard.classFallback": "Ruang kelas saya",
    "dashboard.studentFallback": "Mahasiswa",
    "dashboard.label": "Ruang kelas",
    "dashboard.today": "Hari ini",
    "dashboard.greeting.morning": "Selamat pagi",
    "dashboard.greeting.afternoon": "Selamat siang",
    "dashboard.greeting.evening": "Selamat malam",
    "dashboard.copy":
      "Jadwal, deadline, dan hal-hal kecil yang perlu kamu ingat.",
    "action.addClass": "Tambah kelas",
    "action.addAssignment": "Tambah tugas",
    "action.addHoliday": "Tambah hari libur",
    "action.saveHoliday": "Simpan",
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
    "dashboard.caughtUp": "Belum ada tugas berikutnya",
    "dashboard.noPending": "Tambahkan tugas agar tampil di sini.",
    "dashboard.holiday": "Hari Libur",
    "dashboard.noClassesHoliday": "Tidak ada kelas hari ini.",
    "schedule.label": "Tampilan mingguan",
    "schedule.title": "Jadwal.",
    "schedule.copy":
      "Jadwal yang sederhana dan mudah diubah saat minggu kamu berubah.",
    "schedule.emptyTitle": "Belum ada kelas",
    "schedule.emptyCopy":
      "Tambahkan kelas pertama untuk membangun jadwal kamu.",
    "schedule.class": "Kelas",
    "schedule.classes": "Kelas",
    "schedule.today": "Hari ini",
    "calendar.label": "Tampilan bulan",
    "calendar.title": "Kalender.",
    "calendar.copy":
      "Jadwal mingguan kamu, dengan tugas yang tampil sesuai deadline.",
    "calendar.scheduleCount": "Kelas mingguan",
    "calendar.selected": "Hari terpilih",
    "calendar.classes": "Kelas",
    "calendar.assignments": "Tugas",
    "calendar.noClasses": "Tidak ada kelas terjadwal",
    "calendar.noClassesCopy": "Tidak ada kelas pada hari ini.",
    "calendar.holiday": "Hari Libur",
    "calendar.noClassesHoliday": "Tidak ada kelas hari ini.",
    "calendar.noAssignments": "Tidak ada tugas yang jatuh tempo",
    "calendar.noAssignmentsCopy": "Tidak ada yang deadline di tanggal ini.",
    "calendar.addForDay": "Tambah kelas di hari ini",
    "calendar.noEvent": "Tidak ada aktivitas",
    "calendar.overdue": "Terlambat",
    "calendar.done": "Selesai",
    "calendar.due": "Deadline",
    "calendar.more": "+{count} lainnya",
    "assignments.label": "Beban tugas",
    "assignments.title": "Tugas.",
    "assignments.copy":
      "Jaga semua deadline tetap terlihat tanpa membuat daftar tugas terasa berat.",
    "assignments.search": "Cari tugas atau mata kuliah...",
    "filter.all": "Semua",
    "filter.pending": "Tertunda",
    "filter.done": "Selesai",
    "filter.overdue": "Terlambat",
    "assignments.empty": "Belum ada tugas",
    "assignments.searchEmpty": "Coba kata pencarian lain.",
    "assignments.emptyCopy": "Tambahkan tugas untuk mulai.",
    "schedule.noToday": "Tidak ada kelas hari ini",
    "holiday.title": "Hari Libur",
    "holiday.copy": "Atur tanggal ketika kelas tidak berlangsung.",
    "holiday.empty": "Belum ada hari libur",
    "holiday.emptyCopy":
      "Tambahkan hari libur untuk melewati kelas berulang pada tanggal tertentu.",
    "settings.label": "Preferensi",
    "settings.title": "Pengaturan.",
    "settings.copy":
      "Kontrol kecil untuk tampilan, perilaku, dan penyimpanan KELASIN.",
    "settings.profile": "Personalisasi",
    "settings.profileCopy": "Atur nama dan nama Prodi atau Kelas kamu.",
    "settings.name": "Nama kamu",
    "settings.nameCopy": "Nama ini hanya disimpan di browser kamu.",
    "settings.namePlaceholder": "mis. Mikael",
    "settings.className": "Prodi atau Kelompok",
    "settings.classNameCopy": "Tampil di header aplikasi dan dashboard kamu.",
    "settings.classNamePlaceholder": "Masukkan Prodi atau Kelas kamu",
    "settings.saveProfile": "Simpan profil",
    "settings.appearance": "Tampilan",
    "settings.appearanceCopy":
      "Pilih mode visual yang digunakan di seluruh aplikasi.",
    "settings.theme": "Tema",
    "settings.themeDark": "Gelap",
    "settings.themeLight": "Terang",
    "settings.language": "Bahasa",
    "settings.languageCopy": "Ganti bahasa antarmuka tanpa mengubah data.",
    "settings.data": "Data kamu",
    "settings.dataCopy":
      "Kelas dan tugas tersimpan di browser ini. Ekspor backup jika kamu perlu salinannya.",
    "settings.export": "Ekspor backup",
    "settings.import": "Impor backup",
    "settings.deleteData": "Hapus semua data",
    "settings.deleteDataCopy":
      "Tindakan ini akan menghapus profil, kelas, tugas, jadwal, dan preferensi yang tersimpan di browser ini.",
    "settings.about": "Tentang KELASIN",
    "settings.aboutCopy":
      "Pengelola kelas kecil yang dibuat dengan HTML, CSS, dan vanilla JavaScript.",
    "settings.version": "Versi",
    "settings.storage": "Penyimpanan",
    "settings.local": "Penyimpanan browser lokal",
    "settings.json": "JSON",
    "settings.shortcuts": "Shortcut keyboard",
    "settings.holidays": "Hari Libur",
    "settings.holidaysCopy": "Atur tanggal ketika kelas tidak berlangsung.",
    "settings.shortcutsCopy":
      "Gunakan tombol cepat di desktop untuk bergerak lebih cepat.",
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
    "modal.addHoliday": "Tambah hari libur",
    "modal.editHoliday": "Edit hari libur",
    "field.assignment": "Tugas",
    "field.subject": "Mata kuliah",
    "field.dueDate": "Deadline",
    "field.day": "Hari",
    "field.start": "Mulai",
    "field.end": "Selesai",
    "field.room": "Ruangan",
    "field.holidayName": "Nama hari libur",
    "field.date": "Tanggal",
    "field.lecturer": "Dosen",
    "placeholder.assignment": "contoh: C Assignment 02",
    "placeholder.subject": "contoh: Dasar Pemrograman",
    "placeholder.room": "contoh: Lab 2",
    "placeholder.holidayName": "contoh: Hari Kemerdekaan",
    "placeholder.lecturer": "contoh: Dr. John Doe, S.Kom., M.T.",
    "autocomplete.noResults": "Tidak ada hasil",
    "form.enterAssignment": "Masukkan nama tugas.",
    "form.enterSubject": "Masukkan nama mata kuliah.",
    "form.enterDue": "Pilih tanggal deadline.",
    "form.enterDay": "Pilih hari.",
    "form.enterStart": "Pilih jam mulai.",
    "form.enterEnd": "Pilih jam selesai.",
    "form.invalidTime": "Jam selesai harus setelah jam mulai.",
    "form.conflict": "Jam ini bertabrakan dengan kelas lain di hari yang sama.",
    "form.enterRoom": "Tambahkan ruangan atau lokasi.",
    "form.enterHolidayName": "Masukkan nama hari libur.",
    "form.enterHolidayDate": "Pilih tanggal.",
    "form.duplicateHoliday": "Sudah ada hari libur pada tanggal ini.",
    "form.hint": "Kamu bisa mengubahnya nanti.",
    "toast.saved": "Perubahan tersimpan.",
    "toast.profileSaved": "Profil kamu diperbarui.",
    "toast.deleted": "Data dihapus.",
    "toast.completed": "Tugas ditandai selesai.",
    "toast.reopened": "Tugas dikembalikan ke status tertunda.",
    "toast.deletedAll": "Semua data KELASIN telah dihapus.",
    "toast.deleteError":
      "KELASIN tidak dapat menghapus semua data dari browser ini.",
    "toast.exported": "Backup berhasil diekspor.",
    "toast.imported": "Backup berhasil diimpor.",
    "toast.invalidBackup":
      "File backup tersebut bukan data KELASIN yang valid.",
    "toast.storageError":
      "KELASIN tidak bisa menyimpan perubahan di browser ini.",
    "toast.installHelp":
      "Gunakan opsi Install / Tambahkan ke Dock di browser kamu.",
    "toast.installed": "KELASIN berhasil dipasang.",
    "confirm.label": "KONFIRMASI",
    "confirm.deleteDataEyebrow": "DATA",
    "confirm.importEyebrow": "BACKUP",
    "confirm.importTitle": "Impor backup ini?",
    "confirm.importMessage":
      "Kelas dan tugas saat ini akan diganti dengan data dari file backup ini.",
    "confirm.import": "Impor backup",
    "confirm.deleteDataTitle": "Hapus semua data?",
    "confirm.deleteDataMessage":
      "Tindakan ini tidak dapat dibatalkan. Data KELASIN akan dihapus dari browser ini dan aplikasi akan kembali ke tampilan pertama.",
    "confirm.deleteTitle": "Hapus data ini?",
    "confirm.deleteMessage": "Tindakan ini tidak bisa dibatalkan.",
    "confirm.cancel": "Batal",
    "confirm.deleteAllData": "Hapus semua data",
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
    "week.Mon": "Sen",
    "week.Tue": "Sel",
    "week.Wed": "Rab",
    "week.Thu": "Kam",
    "week.Fri": "Jum",
    "week.Sat": "Sab",
    "week.Sun": "Min",
  },
};

function t(key, vars = {}) {
  const template = translations[language]?.[key] ?? translations.en[key] ?? key;
  return Object.entries(vars).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  );
}

function getStoredLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY) === "id" ? "id" : "en";
  } catch (_) {
    return "en";
  }
}

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
function dateFromISO(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildDefaultData() {
  return {
    version: DATA_VERSION,
    assignments: [],
    schedule: [],
    holidays: [],
  };
}

function isValidISODate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
function isValidTime(value) {
  if (typeof value !== "string" || !/^\d{2}:\d{2}$/.test(value)) return false;
  const [hour, minute] = value.split(":").map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}
function isValidAssignment(item) {
  return (
    item &&
    typeof item === "object" &&
    (typeof item.id === "string" || typeof item.id === "number") &&
    String(item.id).trim().length > 0 &&
    typeof item.title === "string" &&
    item.title.trim().length > 0 &&
    item.title.length <= 120 &&
    typeof item.subject === "string" &&
    item.subject.trim().length > 0 &&
    item.subject.length <= 80 &&
    isValidISODate(item.dueDate) &&
    typeof item.done === "boolean"
  );
}
function isValidSchedule(item) {
  return (
    item &&
    typeof item === "object" &&
    (typeof item.id === "string" || typeof item.id === "number") &&
    String(item.id).trim().length > 0 &&
    DAYS.includes(item.day) &&
    typeof item.subject === "string" &&
    item.subject.trim().length > 0 &&
    item.subject.length <= 80 &&
    isValidTime(item.time) &&
    isValidTime(item.end) &&
    item.end > item.time &&
    typeof item.room === "string" &&
    item.room.length <= 60
  );
}
function isValidHoliday(item) {
  return (
    item &&
    typeof item === "object" &&
    (typeof item.id === "string" || typeof item.id === "number") &&
    String(item.id).trim().length > 0 &&
    isValidISODate(item.date) &&
    typeof item.name === "string" &&
    item.name.trim().length > 0 &&
    item.name.length <= 100
  );
}
function sanitizeData(raw) {
  if (!raw || typeof raw !== "object") return buildDefaultData();
  const seenAssignments = new Set();
  const seenSchedule = new Set();
  const seenHolidayIds = new Set();
  const seenHolidayDates = new Set();
  const assignments = Array.isArray(raw.assignments)
    ? raw.assignments.filter(isValidAssignment).map((item) => {
        const id = String(item.id);
        const safeId = seenAssignments.has(id) ? makeId() : id;
        seenAssignments.add(safeId);
        return {
          id: safeId,
          title: item.title.trim().replace(/\s+/g, " "),
          subject: item.subject.trim().replace(/\s+/g, " "),
          dueDate: item.dueDate,
          done: Boolean(item.done),
        };
      })
    : [];
  const schedule = Array.isArray(raw.schedule)
    ? raw.schedule.filter(isValidSchedule).map((item) => {
        const id = String(item.id);
        const safeId = seenSchedule.has(id) ? makeId() : id;
        seenSchedule.add(safeId);
        return {
          id: safeId,
          day: item.day,
          subject: item.subject.trim().replace(/\s+/g, " "),
          lecturer:
            typeof item.lecturer === "string"
              ? item.lecturer.trim().replace(/\s+/g, " ")
              : "",
          time: item.time,
          end: item.end,
          room: item.room.trim().replace(/\s+/g, " "),
        };
      })
    : [];
  const holidays = Array.isArray(raw.holidays)
    ? raw.holidays
        .filter(isValidHoliday)
        .map((item) => {
          const id = String(item.id);
          const safeId = seenHolidayIds.has(id) ? makeId() : id;
          seenHolidayIds.add(safeId);
          return {
            id: safeId,
            date: item.date,
            name: item.name.trim().replace(/\s+/g, " "),
          };
        })
        .filter((item) => {
          if (seenHolidayDates.has(item.date)) return false;
          seenHolidayDates.add(item.date);
          return true;
        })
    : [];
  return { version: DATA_VERSION, assignments, schedule, holidays };
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

function isValidData(raw) {
  if (
    !raw ||
    typeof raw !== "object" ||
    !Array.isArray(raw.assignments) ||
    !Array.isArray(raw.schedule) ||
    (raw.holidays !== undefined && !Array.isArray(raw.holidays))
  )
    return false;
  const assignmentIds = new Set();
  const scheduleIds = new Set();
  if (
    !raw.assignments.every(
      (item) =>
        isValidAssignment(item) &&
        !assignmentIds.has(String(item.id)) &&
        assignmentIds.add(String(item.id)),
    )
  )
    return false;
  if (
    !raw.schedule.every(
      (item) =>
        isValidSchedule(item) &&
        !scheduleIds.has(String(item.id)) &&
        scheduleIds.add(String(item.id)),
    )
  )
    return false;
  return true;
}

function saveData() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...data, version: DATA_VERSION }),
    );
    return true;
  } catch (error) {
    console.error("KELASIN: could not save data.", error);
    showToast(t("toast.storageError"), "error");
    return false;
  }
}

function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_) {
    return null;
  }
}
function getUserName() {
  const name = getUser()?.name;
  return typeof name === "string" && name.trim() ? name.trim() : "";
}
function getClassName() {
  const className = getUser()?.className;
  return typeof className === "string" ? className.trim() : "";
}
function saveUserProfile(name, className) {
  try {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        name: name.trim(),
        className: className.trim(),
        setupComplete: true,
      }),
    );
    return true;
  } catch (error) {
    console.error("KELASIN: could not save user profile.", error);
    showToast(t("toast.storageError"), "error");
    return false;
  }
}
function setWelcomeStep(nextStep, direction = 1) {
  const next = nextStep === 2 ? 2 : 1;
  if (next === welcomeStep) return;
  const currentElement = welcomeStep === 1 ? welcomeStepName : welcomeStepClass;
  const nextElement = next === 1 ? welcomeStepName : welcomeStepClass;
  currentElement.classList.add(
    direction > 0 ? "is-leaving-left" : "is-leaving-right",
  );
  setTimeout(() => {
    currentElement.hidden = true;
    currentElement.classList.remove(
      "is-active",
      "is-leaving-left",
      "is-leaving-right",
    );
    nextElement.hidden = false;
    requestAnimationFrame(() => {
      nextElement.classList.add("is-active");
      (next === 1 ? welcomeName : welcomeClass)?.focus();
    });
  }, 150);
  welcomeStep = next;
  welcomeProgressLabel.textContent = `${next} / 2`;
  welcomeProgressFill.style.transform = `scaleX(${next === 2 ? 1 : 0.5})`;
  welcomeBack.hidden = next === 1;
  welcomeFooter.classList.toggle("has-back", next === 2);
  const label = next === 2 ? t("welcome.finish") : t("welcome.continue");
  welcomeContinue.querySelector("[data-i18n]")?.replaceChildren(label);
}
function showWelcome(initialStep = 1) {
  welcomeScreen.classList.remove("hidden");
  document.body.classList.add("welcome-open");
  welcomeStep = initialStep === 2 ? 2 : 1;
  welcomeName.value = getUserName();
  welcomeClass.value = getClassName();
  welcomeError.textContent = "";
  welcomeClassError.textContent = "";
  welcomeName.classList.remove("has-error");
  welcomeClass.classList.remove("has-error");
  welcomeStepName.hidden = welcomeStep !== 1;
  welcomeStepClass.hidden = welcomeStep !== 2;
  welcomeStepName.classList.toggle("is-active", welcomeStep === 1);
  welcomeStepClass.classList.toggle("is-active", welcomeStep === 2);
  welcomeProgressLabel.textContent = `${welcomeStep} / 2`;
  welcomeProgressFill.style.transform = `scaleX(${welcomeStep === 2 ? 1 : 0.5})`;
  welcomeBack.hidden = welcomeStep === 1;
  welcomeFooter.classList.toggle("has-back", welcomeStep === 2);
  welcomeContinue
    .querySelector("[data-i18n]")
    ?.replaceChildren(
      t(welcomeStep === 2 ? "welcome.finish" : "welcome.continue"),
    );
  requestAnimationFrame(() =>
    setTimeout(
      () => (welcomeStep === 1 ? welcomeName : welcomeClass).focus(),
      140,
    ),
  );
}
function hideWelcome() {
  welcomeScreen.classList.add("hidden");
  document.body.classList.remove("welcome-open");
}
function completeWelcome() {
  if (welcomeStep === 1) {
    const name = welcomeName.value.trim().replace(/\s+/g, " ");
    if (!name) {
      welcomeError.textContent = t("welcome.error");
      welcomeName.classList.add("has-error");
      welcomeName.focus();
      return;
    }
    if (name.length > 40) {
      welcomeError.textContent = t("welcome.errorLong");
      welcomeName.classList.add("has-error");
      welcomeName.focus();
      return;
    }
    welcomeName.classList.remove("has-error");
    welcomeError.textContent = "";
    setWelcomeStep(2, 1);
    return;
  }
  const name = welcomeName.value.trim().replace(/\s+/g, " ");
  const className = welcomeClass.value.trim().replace(/\s+/g, " ");
  if (!className) {
    welcomeClassError.textContent = t("welcome.classError");
    welcomeClass.classList.add("has-error");
    welcomeClass.focus();
    return;
  }
  if (className.length > 60) {
    welcomeClassError.textContent = t("welcome.classErrorLong");
    welcomeClass.classList.add("has-error");
    welcomeClass.focus();
    return;
  }
  if (!name || !saveUserProfile(name, className)) return;
  welcomeClass.classList.remove("has-error");
  welcomeClassError.textContent = "";
  hideWelcome();
  render(true);
}
function saveProfile() {
  const nameInput = document.getElementById("profileName");
  const classInput = document.getElementById("profileClass");
  const name = nameInput?.value.trim().replace(/\s+/g, " ") || "";
  const className = classInput?.value.trim().replace(/\s+/g, " ") || "";
  if (!name) {
    showToast(t("welcome.error"), "error");
    nameInput?.focus();
    return;
  }
  if (name.length > 40) {
    showToast(t("welcome.errorLong"), "error");
    nameInput?.focus();
    return;
  }
  if (className.length > 60) {
    showToast(t("welcome.classErrorLong"), "error");
    classInput?.focus();
    return;
  }
  if (!saveUserProfile(name, className)) return;
  render(true);
  showToast(t("toast.profileSaved"));
}

function setLanguage(nextLanguage) {
  language = nextLanguage === "id" ? "id" : "en";
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch (_) {}
  document.documentElement.lang = language;
  languageCode.textContent = language.toUpperCase();
  languageButton.title = t("topbar.changeLanguage");
  languageButton.setAttribute("aria-label", t("topbar.changeLanguage"));
  applyStaticLanguage();
  updateModalLanguage();
  render(true);
}

function applyStaticLanguage() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  themeButton.setAttribute(
    "aria-label",
    currentTheme() === "dark" ? t("topbar.light") : t("topbar.dark"),
  );
  themeButton.title =
    currentTheme() === "dark" ? t("topbar.light") : t("topbar.dark");
  menuButton.setAttribute(
    "aria-label",
    sidebar.classList.contains("open")
      ? t("topbar.closeMenu")
      : t("topbar.openMenu"),
  );
  menuButton.setAttribute(
    "aria-expanded",
    String(sidebar.classList.contains("open")),
  );
  modalClose.setAttribute("aria-label", t("action.cancel"));
  if (welcomeLanguageCode)
    welcomeLanguageCode.textContent = language.toUpperCase();
  if (welcomeLanguageButton)
    welcomeLanguageButton.setAttribute(
      "aria-label",
      t("topbar.changeLanguage"),
    );
  if (welcomeStepName && welcomeStepClass && welcomeContinue) {
    welcomeProgressLabel.textContent = `${welcomeStep} / 2`;
    welcomeProgressFill.style.transform = `scaleX(${welcomeStep === 2 ? 1 : 0.5})`;
    welcomeBack.hidden = welcomeStep === 1;
    welcomeContinue
      .querySelector("[data-i18n]")
      ?.replaceChildren(
        t(welcomeStep === 2 ? "welcome.finish" : "welcome.continue"),
      );
  }
}

function currentTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}
function toggleTheme(forceTheme = null) {
  const next = forceTheme || (currentTheme() === "dark" ? "light" : "dark");
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (_) {}
  themeButton.innerHTML = icon(next === "dark" ? "sun" : "moon");
  themeButton.classList.remove("is-switching");
  requestAnimationFrame(() => themeButton.classList.add("is-switching"));
  setTimeout(() => themeButton.classList.remove("is-switching"), 360);
  applyStaticLanguage();
  updateThemeColor();
}
function updateThemeColor() {
  const color = currentTheme() === "dark" ? "#0f1013" : "#f5f6f8";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", color);
}

function formatDate(dateString, options = {}) {
  if (!dateString) return t("common.none");
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return t("common.none");
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    month: "short",
    day: "numeric",
    ...options,
  }).format(date);
}
function formatLongDate(dateString) {
  return formatDate(dateString, { weekday: "short" });
}
function formatFullDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
function getTodayName() {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
    new Date(),
  );
}
function getHolidayForDate(date) {
  const key = isoDate(date);
  return data.holidays.find((item) => item.date === key) || null;
}
function isHolidayDate(date) {
  return Boolean(getHolidayForDate(date));
}
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return t("dashboard.greeting.morning");
  if (hour < 18) return t("dashboard.greeting.afternoon");
  return t("dashboard.greeting.evening");
}
function isOverdue(item) {
  return !item.done && new Date(`${item.dueDate}T23:59:59`) < new Date();
}
function getTodayClasses() {
  return getScheduleForDate(new Date());
}
function getNextClass() {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const todayUpcoming = getTodayClasses().find(
    (item) => item.end > currentTime,
  );
  if (todayUpcoming) return { ...todayUpcoming, isToday: true };
  for (let offset = 1; offset <= 7; offset += 1) {
    const date = addDays(now, offset);
    const upcoming = getScheduleForDate(date);
    if (upcoming.length) {
      return {
        ...upcoming[0],
        isToday: false,
        date: isoDate(date),
        offset,
      };
    }
  }
  return null;
}
function getCurrentClass() {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return (
    getTodayClasses().find((item) => item.time <= time && item.end > time) ||
    null
  );
}
function sortAssignments(items) {
  return [...items].sort((a, b) => {
    if (a.done !== b.done) return Number(a.done) - Number(b.done);
    const overdueOrder = Number(isOverdue(a)) - Number(isOverdue(b));
    return (
      overdueOrder ||
      a.dueDate.localeCompare(b.dueDate) ||
      a.title.localeCompare(b.title)
    );
  });
}

function render(immediate = false) {
  const update = () => {
    document
      .querySelectorAll(".nav-item")
      .forEach((item) =>
        item.classList.toggle(
          "active",
          item.dataset.section === currentSection,
        ),
      );
    topbarTitle.textContent = sectionTitle(currentSection);
    if (currentSection === "dashboard") renderDashboard();
    if (currentSection === "schedule") renderSchedule();
    if (currentSection === "calendar") renderCalendar();
    if (currentSection === "assignments") renderAssignments();
    if (currentSection === "settings") renderSettings();
    bindRenderedInteractions();
  };
  if (immediate || typeof document.startViewTransition !== "function") update();
  else {
    try {
      document.startViewTransition(update);
    } catch (_) {
      update();
    }
  }
}
function sectionTitle(section) {
  return (
    {
      dashboard: getClassName() || "KELASIN",
      schedule: t("nav.schedule"),
      calendar: t("nav.calendar"),
      assignments: t("nav.assignments"),
      settings: t("nav.settings"),
    }[section] || "KELASIN"
  );
}

function renderDashboard() {
  const pending = data.assignments.filter((item) => !item.done).length;
  const overdue = data.assignments.filter(isOverdue).length;
  const todayClasses = getTodayClasses();
  const todayHoliday = getHolidayForDate(new Date());
  const nextClass = getNextClass();
  const currentClass = getCurrentClass();
  const upcoming = sortAssignments(
    data.assignments.filter((item) => !item.done),
  ).slice(0, 4);
  const nextLabel = currentClass
    ? t("stat.now")
    : nextClass
      ? nextClass.isToday
        ? nextClass.time
        : `${dayAbbrev(nextClass.day)} ${nextClass.time}`
      : t("stat.noClass");
  const nextHint = currentClass
    ? `${currentClass.subject} ${t("common.inProgress")}`
    : nextClass
      ? `${nextClass.subject} · ${nextClass.room || t("common.noRoom")}`
      : t("stat.noClass");
  page.innerHTML = `
    <section class="hero">
      <div class="hero-main"><p class="eyebrow">${escapeHtml(getClassName() || t("dashboard.classFallback"))}</p><h1>${getGreeting()}, ${escapeHtml(getUserName() || t("dashboard.studentFallback"))}.</h1><p class="hero-copy">${t("dashboard.copy")}</p></div>
      <div class="hero-actions"><button class="secondary-button" type="button" data-action="add-schedule">${icon("calendar-plus")} ${t("action.addClass")}</button><button class="primary-button" type="button" data-action="add-assignment">${icon("plus")} ${t("action.addAssignment")}</button></div>
    </section>
    <section class="grid stats" aria-label="${escapeAttribute(t("dashboard.today"))}">${statCard(t("stat.classesToday"), todayClasses.length, t("stat.classesHint"), "calendar")}${statCard(t("stat.pending"), pending, overdue ? `${overdue} ${t("stat.overdue")}` : t("stat.noneOverdue"), "list")}${statCard(t("stat.nextClass"), nextLabel, nextHint, "arrow")}</section>
    <section class="grid content-grid">
      <article class="card"><div class="section-heading"><div><p class="section-kicker">${t("dashboard.todayHeading")}</p><h2>${todayNameLabel()}</h2></div><button class="link-button" type="button" data-section-link="schedule">${t("action.fullSchedule")} ${icon("arrow-right")}</button></div>${todayHoliday ? holidayEmptyState(todayHoliday) : renderTodayList(todayClasses)}</article>
      <article class="card"><div class="section-heading"><div><p class="section-kicker">${t("dashboard.keepMoving")}</p><h2>${t("dashboard.upcoming")}</h2></div><button class="link-button" type="button" data-section-link="assignments">${t("action.viewAll")} ${icon("arrow-right")}</button></div>${upcoming.length ? `<div class="list">${upcoming.map(renderDashboardAssignment).join("")}</div>` : emptyState(t("dashboard.caughtUp"), t("dashboard.noPending"))}</article>
    </section>
  `;
}
function statCard(label, value, hint, iconName) {
  return `<article class="card stat-card"><div class="stat-top"><span class="label">${escapeHtml(label)}</span><span class="stat-icon">${icon(iconName)}</span></div><div class="value">${escapeHtml(value)}</div><div class="hint">${escapeHtml(hint)}</div></article>`;
}
function todayNameLabel() {
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());
}
function renderTodayList(items) {
  if (!items.length)
    return emptyState(t("schedule.noToday"), t("calendar.noClassesCopy"));
  const current = getCurrentClass();
  return `<div class="list">${items.map((item) => `<div class="list-item ${current?.id === item.id ? "is-current" : ""}"><div class="time-block"><strong>${escapeHtml(item.time)}</strong><span>${escapeHtml(item.end)}</span></div><div class="body"><strong>${escapeHtml(item.subject)}</strong>${item.lecturer ? `<span>${escapeHtml(item.lecturer)}</span>` : ""}<span>${escapeHtml(item.room || t("common.noRoom"))}</span></div>${current?.id === item.id ? `<span class="badge accent">${t("stat.now")}</span>` : ""}</div>`).join("")}</div>`;
}
function holidayEmptyState(holiday) {
  return `<div class="empty holiday-empty"><div class="empty-icon">${icon("sparkles")}</div><strong>${escapeHtml(t("dashboard.holiday"))}</strong><p>${escapeHtml(holiday.name)}</p><span>${escapeHtml(t("dashboard.noClassesHoliday"))}</span></div>`;
}
function renderDashboardAssignment(item) {
  const status = isOverdue(item)
    ? t("calendar.overdue")
    : formatDueLabel(item.dueDate);
  return `<button class="list-item list-item-button" type="button" data-edit-assignment="${escapeAttribute(item.id)}"><span class="status-dot"></span><div class="body"><strong class="title">${escapeHtml(item.title)}</strong><span>${escapeHtml(item.subject)} · ${formatDate(item.dueDate)}</span></div><span class="badge ${isOverdue(item) ? "warning" : ""}">${escapeHtml(status)}</span></button>`;
}
function formatDueLabel(dateString) {
  const target = new Date(`${dateString}T23:59:59`);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const targetDay = new Date(target);
  targetDay.setHours(0, 0, 0, 0);
  const diff = Math.round((targetDay - start) / 86400000);
  if (diff === 0) return t("common.today");
  if (diff === 1) return t("common.tomorrow");
  return formatDate(dateString);
}

function renderSchedule() {
  const grouped = DAYS.map((day) => ({
    day,
    classes: data.schedule
      .filter((item) => item.day === day)
      .sort((a, b) => a.time.localeCompare(b.time)),
  })).filter((group) => group.classes.length);
  const today = getTodayName();
  page.innerHTML = `<section class="hero"><div class="hero-main"><p class="eyebrow">${t("schedule.label")}</p><h1>${t("schedule.title")}</h1><p class="hero-copy">${t("schedule.copy")}</p></div><div class="hero-actions"><button class="secondary-button" type="button" data-section-link="calendar">${icon("calendar-days")} ${t("action.goCalendar")}</button><button class="primary-button" type="button" data-action="add-schedule">${icon("plus")} ${t("action.addClass")}</button></div></section><article class="card schedule-card">${grouped.length ? grouped.map((group) => `<section class="day-section ${group.day === today ? "is-today" : ""}"><div class="day-heading"><div><span class="day-name">${translateDay(group.day)}</span>${group.day === today ? `<span class="today-chip">${t("schedule.today")}</span>` : ""}</div><span class="day-count">${group.classes.length} ${group.classes.length === 1 ? t("schedule.class") : t("schedule.classes")}</span></div><div class="schedule-list">${group.classes.map(renderScheduleRow).join("")}</div></section>`).join("") : emptyState(t("schedule.emptyTitle"), t("schedule.emptyCopy"))}</article>`;
}
function renderScheduleRow(item) {
  return `<div class="schedule-row"><div class="schedule-time"><strong>${escapeHtml(item.time)}</strong><span>${escapeHtml(item.end)}</span></div><div class="schedule-main"><strong>${escapeHtml(item.subject)}</strong>${item.lecturer ? `<span>${escapeHtml(item.lecturer)}</span>` : ""}<span>${escapeHtml(item.room || t("common.noRoom"))}</span></div><div class="row-actions"><button class="icon-button small" type="button" title="${t("action.edit")}" aria-label="${escapeAttribute(t("action.edit"))} ${escapeAttribute(item.subject)}" data-edit-schedule="${escapeAttribute(item.id)}">${icon("pencil")}</button><button class="icon-button small danger-hover" type="button" title="${t("action.delete")}" aria-label="${escapeAttribute(t("action.delete"))} ${escapeAttribute(item.subject)}" data-delete-schedule="${escapeAttribute(item.id)}">${icon("trash")}</button></div></div>`;
}

function getDayNameForDate(date) {
  const sundayBased = date.getDay();
  return DAYS[sundayBased === 0 ? 6 : sundayBased - 1];
}
function getScheduleForDate(date) {
  if (isHolidayDate(date)) return [];
  return data.schedule
    .filter((item) => item.day === getDayNameForDate(date))
    .sort((a, b) => a.time.localeCompare(b.time));
}
function getAssignmentsForDate(date) {
  const key = isoDate(date);
  return sortAssignments(
    data.assignments.filter((item) => item.dueDate === key),
  );
}
function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function monthTitle(date) {
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}
function formatSelectedDay(dateString) {
  return formatFullDate(dateString);
}
function translateDay(day) {
  return language === "en"
    ? day
    : {
        Monday: "Senin",
        Tuesday: "Selasa",
        Wednesday: "Rabu",
        Thursday: "Kamis",
        Friday: "Jumat",
        Saturday: "Sabtu",
        Sunday: "Minggu",
      }[day];
}
function dayAbbrev(day) {
  const map = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };
  return t(`week.${map[day]}`);
}

function renderCalendar() {
  const monthStart = startOfMonth(calendarCursor);
  const offset = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(
    calendarCursor.getFullYear(),
    calendarCursor.getMonth() + 1,
    0,
  ).getDate();
  const cellCount = Math.ceil((offset + daysInMonth) / 7) * 7;
  const todayKey = isoDate(new Date());
  const selectedKey = selectedCalendarDate;
  const selectedDate = new Date(`${selectedKey}T00:00:00`);
  const selectedHoliday = getHolidayForDate(selectedDate);
  const selectedSchedule = getScheduleForDate(selectedDate);
  const selectedAssignments = getAssignmentsForDate(selectedDate);
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (key) => t(`week.${key}`),
  );
  const cells = Array.from({ length: cellCount }, (_, index) => {
    const dayNumber = index - offset + 1;
    const date = new Date(
      calendarCursor.getFullYear(),
      calendarCursor.getMonth(),
      dayNumber,
    );
    const inMonth = date.getMonth() === calendarCursor.getMonth();
    const key = isoDate(date);
    const holiday = getHolidayForDate(date);
    const schedule = getScheduleForDate(date);
    const due = getAssignmentsForDate(date);
    const visibleEvents = schedule.slice(0, 2);
    const moreCount = schedule.length - visibleEvents.length;
    return `<article class="calendar-day ${inMonth ? "" : "is-outside"} ${key === todayKey ? "is-today" : ""} ${key === selectedKey ? "is-selected" : ""} ${holiday ? "is-holiday" : ""}"><button class="calendar-date-button" type="button" data-calendar-date="${key}" aria-label="${escapeAttribute(`${formatSelectedDay(key)}${holiday ? `, ${holiday.name}` : ""}`)}" aria-pressed="${key === selectedKey}"><span>${date.getDate()}</span>${key === todayKey ? '<i class="calendar-today-dot" aria-hidden="true"></i>' : ""}</button><div class="calendar-events">${holiday ? `<button class="calendar-holiday-event" type="button" data-calendar-date="${key}"><span>${escapeHtml(t("calendar.holiday"))}</span><strong>${escapeHtml(holiday.name)}</strong></button>` : visibleEvents.map((item) => `<button class="calendar-event" type="button" data-calendar-edit-schedule="${escapeAttribute(item.id)}"><span>${escapeHtml(item.time)}</span><strong>${escapeHtml(item.subject)}</strong></button>`).join("")}${moreCount > 0 ? `<button class="calendar-more" type="button" data-calendar-date="${key}">${escapeHtml(t("calendar.more", { count: moreCount }))}</button>` : ""}${due.length ? `<button class="calendar-due" type="button" data-calendar-date="${key}">${due.length} ${t("calendar.due")}</button>` : ""}</div></article>`;
  }).join("");
  page.innerHTML = `<section class="hero calendar-hero"><div class="hero-main"><p class="eyebrow">${t("calendar.label")}</p><h1>${t("calendar.title")}</h1><p class="hero-copy">${t("calendar.copy")}</p></div><div class="hero-actions"><button class="secondary-button" type="button" data-calendar-action="today">${t("action.today")}</button><button class="primary-button" type="button" data-calendar-action="add-class">${icon("plus")} ${t("action.addClass")}</button></div></section><section class="calendar-layout"><article class="card calendar-card"><div class="calendar-toolbar"><div class="calendar-title-wrap"><button class="icon-button small" type="button" data-calendar-action="prev" aria-label="${escapeAttribute(t("action.previous"))}">${icon("chevron-left")}</button><h2>${escapeHtml(monthTitle(calendarCursor))}</h2><button class="icon-button small" type="button" data-calendar-action="next" aria-label="${escapeAttribute(t("action.next"))}">${icon("chevron-right")}</button></div><span class="calendar-hint">${data.schedule.length} ${t("calendar.scheduleCount")}</span></div><div class="calendar-grid calendar-weekdays" aria-hidden="true">${dayLabels.map((label) => `<span>${label}</span>`).join("")}</div><div class="calendar-grid calendar-month-grid">${cells}</div></article><article class="card calendar-agenda"><div class="section-heading"><div><p class="section-kicker">${t("calendar.selected")}</p><h2>${escapeHtml(formatSelectedDay(selectedKey))}</h2></div><button class="link-button" type="button" data-calendar-action="add-class">${t("action.addClass")} ${icon("arrow-right")}</button></div>${selectedHoliday ? `<div class="holiday-agenda"><strong>${escapeHtml(t("calendar.holiday"))}</strong><span>${escapeHtml(selectedHoliday.name)}</span><p>${escapeHtml(t("calendar.noClassesHoliday"))}</p></div>` : ""}${renderAgendaBlock(t("calendar.classes"), selectedSchedule.length ? selectedSchedule.map((item) => `<button class="agenda-item" type="button" data-calendar-edit-schedule="${escapeAttribute(item.id)}"><span class="agenda-time">${escapeHtml(item.time)}</span><span class="agenda-copy"><strong>${escapeHtml(item.subject)}</strong>${item.lecturer ? `<span>${escapeHtml(item.lecturer)}</span>` : ""}<span>${escapeHtml(item.room || t("common.noRoom"))}</span></span>${icon("chevron-right")}</button>`).join("") : emptyState(t("calendar.noClasses"), selectedHoliday ? t("calendar.noClassesHoliday") : t("calendar.noClassesCopy")))}${renderAgendaBlock(t("calendar.assignments"), selectedAssignments.length ? selectedAssignments.map((item) => `<button class="agenda-item" type="button" data-calendar-edit-assignment="${escapeAttribute(item.id)}"><span class="agenda-dot ${item.done ? "is-done" : isOverdue(item) ? "is-overdue" : ""}"></span><span class="agenda-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.subject)} · ${escapeHtml(item.done ? t("calendar.done") : isOverdue(item) ? t("calendar.overdue") : t("calendar.due"))}</span></span>${icon("chevron-right")}</button>`).join("") : emptyState(t("calendar.noAssignments"), t("calendar.noAssignmentsCopy")))}</article></section>`;
}
function renderAgendaBlock(label, body) {
  return `<section class="agenda-block"><div class="agenda-label"><span>${label}</span></div>${body}</section>`;
}

function renderAssignments() {
  const filtered = data.assignments.filter((item) => {
    const searchMatch = `${item.title} ${item.subject}`
      .toLowerCase()
      .includes(assignmentQuery.toLowerCase());
    const filterMatch =
      assignmentFilter === "all" ||
      (assignmentFilter === "pending" && !item.done) ||
      (assignmentFilter === "done" && item.done) ||
      (assignmentFilter === "overdue" && isOverdue(item));
    return searchMatch && filterMatch;
  });
  const counts = {
    all: data.assignments.length,
    pending: data.assignments.filter((item) => !item.done).length,
    done: data.assignments.filter((item) => item.done).length,
    overdue: data.assignments.filter(isOverdue).length,
  };
  page.innerHTML = `<section class="hero"><div class="hero-main"><p class="eyebrow">${t("assignments.label")}</p><h1>${t("assignments.title")}</h1><p class="hero-copy">${t("assignments.copy")}</p></div><div class="hero-actions"><button class="primary-button" type="button" data-action="add-assignment">${icon("plus")} ${t("action.addAssignment")}</button></div></section><section class="card"><div class="page-toolbar"><label class="search-wrap"><span class="sr-only">${t("settings.shortcutSearch")}</span>${icon("search")}<input class="input search" id="assignmentSearch" type="search" placeholder="${escapeAttribute(t("assignments.search"))}" value="${escapeAttribute(assignmentQuery)}" autocomplete="off"></label><div class="filter-tabs" role="tablist">${filterTab("all", t("filter.all"), counts.all)}${filterTab("pending", t("filter.pending"), counts.pending)}${filterTab("done", t("filter.done"), counts.done)}${filterTab("overdue", t("filter.overdue"), counts.overdue)}</div></div>${filtered.length ? `<div class="assignment-list">${filtered.map(renderAssignmentRow).join("")}</div>` : emptyState(t("assignments.empty"), assignmentQuery ? t("assignments.searchEmpty") : t("assignments.emptyCopy"))}</section>`;
}
function filterTab(key, label, count) {
  return `<button class="filter-tab ${assignmentFilter === key ? "active" : ""}" type="button" role="tab" aria-selected="${assignmentFilter === key}" data-assignment-filter="${key}"><span>${label}</span><b>${count}</b></button>`;
}
function renderAssignmentRow(item) {
  return `<div class="assignment-row ${item.done ? "done" : ""}"><label class="check-wrap"><input type="checkbox" ${item.done ? "checked" : ""} data-toggle-assignment="${escapeAttribute(item.id)}"><span class="custom-check"></span><span class="sr-only">${escapeHtml(item.title)}</span></label><div class="assignment-copy"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.subject)}</span></div><div class="assignment-due"><strong>${formatDate(item.dueDate)}</strong><span>${formatLongDate(item.dueDate)}</span></div><span class="badge ${isOverdue(item) ? "warning" : item.done ? "success" : ""}">${escapeHtml(item.done ? t("calendar.done") : isOverdue(item) ? t("calendar.overdue") : formatDueLabel(item.dueDate))}</span><div class="row-actions"><button class="icon-button small" type="button" title="${t("action.edit")}" aria-label="${escapeAttribute(t("action.edit"))} ${escapeAttribute(item.title)}" data-edit-assignment="${escapeAttribute(item.id)}">${icon("pencil")}</button><button class="icon-button small danger-hover" type="button" title="${t("action.delete")}" aria-label="${escapeAttribute(t("action.delete"))} ${escapeAttribute(item.title)}" data-delete-assignment="${escapeAttribute(item.id)}">${icon("trash")}</button></div></div>`;
}

function renderSettings() {
  const theme = currentTheme();
  const userName = getUserName();
  const className = getClassName();
  page.innerHTML = `<section class="hero"><div class="hero-main"><p class="eyebrow">${t("settings.label")}</p><h1>${t("settings.title")}</h1><p class="hero-copy">${t("settings.copy")}</p></div></section><section class="settings-grid"><article class="card settings-card"><div class="settings-section-head"><div><p class="section-kicker">${t("settings.profile")}</p><h2>${t("settings.profile")}</h2><p>${t("settings.profileCopy")}</p></div></div><div class="profile-grid"><div class="profile-field"><label for="profileName">${t("settings.name")}</label><span>${t("settings.nameCopy")}</span><input class="input" id="profileName" type="text" maxlength="40" autocomplete="name" placeholder="${escapeAttribute(t("settings.namePlaceholder"))}" value="${escapeAttribute(userName)}"></div><div class="profile-field"><label for="profileClass">${t("settings.className")}</label><span>${t("settings.classNameCopy")}</span><input class="input" id="profileClass" type="text" maxlength="60" autocomplete="organization" placeholder="${escapeAttribute(t("settings.classNamePlaceholder"))}" value="${escapeAttribute(className)}"></div><button class="secondary-button setting-action profile-save" type="button" data-action="save-profile">${t("settings.saveProfile")}</button></div></article><article class="card settings-card"><div class="settings-section-head"><div><p class="section-kicker">${t("settings.appearance")}</p><h2>${t("settings.appearance")}</h2><p>${t("settings.appearanceCopy")}</p></div></div><div class="setting-row"><div><strong>${t("settings.theme")}</strong><span>${theme === "dark" ? t("settings.themeDark") : t("settings.themeLight")}</span></div><div class="segmented-control" role="group" aria-label="${escapeAttribute(t("settings.theme"))}"><button type="button" class="segment-button ${theme === "dark" ? "active" : ""}" data-setting-theme="dark">${icon("moon")} ${t("settings.themeDark")}</button><button type="button" class="segment-button ${theme === "light" ? "active" : ""}" data-setting-theme="light">${icon("sun")} ${t("settings.themeLight")}</button></div></div><div class="setting-row"><div><strong>${t("settings.language")}</strong><span>${t("settings.languageCopy")}</span></div><button class="secondary-button setting-action" type="button" data-action="toggle-language">${language === "en" ? "English" : "Bahasa Indonesia"}</button></div></article><article class="card settings-card"><div class="settings-section-head"><div><p class="section-kicker">${t("settings.data")}</p><h2>${t("settings.data")}</h2><p>${t("settings.dataCopy")}</p></div></div><div class="setting-row"><div><strong>${t("settings.export")}</strong><span>${t("settings.json")}</span></div><button class="secondary-button setting-action" type="button" data-action="export-data">${icon("download")} ${t("settings.export")}</button></div><div class="setting-row"><div><strong>${t("settings.import")}</strong><span>${t("settings.json")}</span></div><button class="secondary-button setting-action" type="button" data-action="import-data">${icon("upload")} ${t("settings.import")}</button></div><div class="setting-row setting-row-danger"><div><strong>${t("settings.deleteData")}</strong><span>${t("settings.deleteDataCopy")}</span></div><button class="secondary-button setting-action danger-outline" type="button" data-action="delete-data">${icon("trash")} ${t("settings.deleteData")}</button></div></article><article class="card settings-card"><div class="settings-section-head"><div><p class="section-kicker">${t("settings.shortcuts")}</p><h2>${t("settings.shortcuts")}</h2><p>${t("settings.shortcutsCopy")}</p></div></div><div class="shortcut-list"><div><kbd>N</kbd><span>${t("settings.shortcutNewClass")}</span></div><div><kbd>A</kbd><span>${t("settings.shortcutNewAssignment")}</span></div><div><kbd>/</kbd><span>${t("settings.shortcutSearch")}</span></div><div><kbd>Esc</kbd><span>${t("settings.shortcutEscape")}</span></div></div></article><article class="card settings-card settings-about"><div class="about-mark"><img src="assets/icons/icon.svg" alt="" aria-hidden="true"></div><div><p class="section-kicker">${t("settings.about")}</p><h2>KELASIN</h2><p>${t("settings.aboutCopy")}</p><dl><div><dt>${t("settings.version")}</dt><dd>${APP_VERSION}</dd></div><div><dt>${t("settings.storage")}</dt><dd>${t("settings.local")}</dd></div></dl></div></article></section>`;
}

function emptyState(title, message) {
  return `<div class="empty"><div class="empty-icon">${icon("sparkles")}</div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p></div>`;
}
function renderHolidaySettings() {
  const rows = [...data.holidays]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(
      (item) =>
        `<div class="holiday-setting-row"><div><strong>${escapeHtml(formatDate(item.date, { day: "numeric", month: "long", year: "numeric" }))}</strong><span>${escapeHtml(item.name)}</span></div><div class="row-actions"><button class="icon-button small" type="button" title="${escapeAttribute(t("action.edit"))}" aria-label="${escapeAttribute(t("action.edit"))} ${escapeAttribute(item.name)}" data-edit-holiday="${escapeAttribute(item.id)}">${icon("pencil")}</button><button class="icon-button small danger-hover" type="button" title="${escapeAttribute(t("action.delete"))}" aria-label="${escapeAttribute(t("action.delete"))} ${escapeAttribute(item.name)}" data-delete-holiday="${escapeAttribute(item.id)}">${icon("trash")}</button></div></div>`,
    )
    .join("");
  return `<article class="card settings-card holiday-settings" id="holidaySettings"><div class="settings-section-head"><div><p class="section-kicker">${t("settings.holidays")}</p><h2>${t("settings.holidays")}</h2><p>${t("settings.holidaysCopy")}</p></div><button class="secondary-button setting-action" type="button" data-action="add-holiday">${icon("plus")} ${t("action.addHoliday")}</button></div>${rows ? `<div class="holiday-setting-list">${rows}</div>` : emptyState(t("holiday.empty"), t("holiday.emptyCopy"))}</article>`;
}
function findItem(type, id) {
  const list =
    type === "assignment"
      ? data.assignments
      : type === "schedule"
        ? data.schedule
        : data.holidays;
  return list.find((item) => String(item.id) === String(id)) || null;
}

function openModal(type, id = null, options = {}) {
  lastFocusedElement = document.activeElement;
  const item = id ? findItem(type, id) : null;
  modalState = { type, id, prefillDay: options.prefillDay || null };
  document.getElementById("modalEyebrow").textContent = item
    ? t("modal.edit")
    : t("modal.new");
  document.getElementById("modalTitle").textContent =
    type === "assignment"
      ? item
        ? t("modal.editAssignment")
        : t("modal.addAssignment")
      : type === "holiday"
        ? item
          ? t("modal.editHoliday")
          : t("modal.addHoliday")
        : item
          ? t("modal.editClass")
          : t("modal.addClass");
  modalForm.innerHTML =
    type === "assignment"
      ? assignmentFormMarkup(item)
      : type === "holiday"
        ? holidayFormMarkup(item)
        : scheduleFormMarkup(item, modalState.prefillDay);
  modalBackdrop.classList.remove("hidden");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() =>
    (modalForm.querySelector("input, select") || modalClose).focus(),
  );
}
function updateModalLanguage() {
  if (!modalState || modalBackdrop.classList.contains("hidden")) return;
  const item = modalState.id ? findItem(modalState.type, modalState.id) : null;
  document.getElementById("modalEyebrow").textContent = item
    ? t("modal.edit")
    : t("modal.new");
  document.getElementById("modalTitle").textContent =
    modalState.type === "assignment"
      ? item
        ? t("modal.editAssignment")
        : t("modal.addAssignment")
      : item
        ? t("modal.editClass")
        : t("modal.addClass");
  if (modalState.type === "holiday")
    document.getElementById("modalTitle").textContent = item
      ? t("modal.editHoliday")
      : t("modal.addHoliday");
  modalForm.querySelectorAll("#scheduleDay option").forEach((option) => {
    option.textContent = translateDay(option.value);
  });
  modalForm.querySelectorAll("[data-autocomplete]").forEach((input) => {
    if (input.getAttribute("aria-expanded") === "true")
      renderAutocompleteSuggestions(input);
  });
}
function assignmentFormMarkup(item) {
  const dueDate = item?.dueDate || isoDate(new Date());
  return `<div class="form-grid"><div class="field"><label for="assignmentTitle">${t("field.assignment")}</label><input class="input" id="assignmentTitle" maxlength="80" required placeholder="${escapeAttribute(t("placeholder.assignment"))}" value="${escapeAttribute(item?.title || "")}"><span class="field-error" data-error-for="assignmentTitle"></span></div><div class="field"><label for="assignmentSubject">${t("field.subject")}</label><input class="input" id="assignmentSubject" maxlength="60" required placeholder="${escapeAttribute(t("placeholder.subject"))}" value="${escapeAttribute(item?.subject || "")}"><span class="field-error" data-error-for="assignmentSubject"></span></div><div class="field"><label for="assignmentDue">${t("field.dueDate")}</label><input class="input" id="assignmentDue" type="date" required value="${escapeAttribute(dueDate)}"><span class="field-error" data-error-for="assignmentDue"></span></div><div class="form-hint">${t("form.hint")}</div><div class="form-actions"><button type="button" class="secondary-button" data-modal-cancel>${t("action.cancel")}</button><button type="submit" class="primary-button">${item ? t("action.saveChanges") : t("action.saveAssignment")}</button></div></div>`;
}
function autocompleteFieldMarkup({
  id,
  type,
  labelKey,
  placeholderKey,
  value,
}) {
  const listId = `${id}Suggestions`;
  return `<div class="field autocomplete-field"><label for="${id}" data-i18n="${labelKey}">${t(labelKey)}</label><div class="autocomplete-control"><input class="input" id="${id}" maxlength="${type === "lecturer" ? 100 : 60}" ${type === "subject" ? "required" : ""} placeholder="${escapeAttribute(t(placeholderKey))}" value="${escapeAttribute(value || "")}" data-i18n-placeholder="${placeholderKey}" data-autocomplete="${type}" role="combobox" aria-autocomplete="list" aria-controls="${listId}" aria-expanded="false"><div class="autocomplete-list" id="${listId}" role="listbox"></div></div><span class="field-error" data-error-for="${id}"></span></div>`;
}
function scheduleFormMarkup(item, prefillDay = null) {
  const day = item?.day || prefillDay || getTodayName();
  return `<div class="form-grid">${autocompleteFieldMarkup({ id: "scheduleSubject", type: "subject", labelKey: "field.subject", placeholderKey: "placeholder.subject", value: item?.subject })}${autocompleteFieldMarkup({ id: "scheduleLecturer", type: "lecturer", labelKey: "field.lecturer", placeholderKey: "placeholder.lecturer", value: item?.lecturer })}<div class="field"><label for="scheduleDay" data-i18n="field.day">${t("field.day")}</label><select class="select" id="scheduleDay">${DAYS.map((option) => `<option value="${option}" ${option === day ? "selected" : ""}>${translateDay(option)}</option>`).join("")}</select><span class="field-error" data-error-for="scheduleDay"></span></div><div class="form-two"><div class="field"><label for="scheduleStart" data-i18n="field.start">${t("field.start")}</label><input class="input" id="scheduleStart" type="time" required value="${escapeAttribute(item?.time || "09:00")}"><span class="field-error" data-error-for="scheduleStart"></span></div><div class="field"><label for="scheduleEnd" data-i18n="field.end">${t("field.end")}</label><input class="input" id="scheduleEnd" type="time" required value="${escapeAttribute(item?.end || "10:40")}"><span class="field-error" data-error-for="scheduleEnd"></span></div></div><div class="field"><label for="scheduleRoom" data-i18n="field.room">${t("field.room")}</label><input class="input" id="scheduleRoom" maxlength="40" placeholder="${escapeAttribute(t("placeholder.room"))}" value="${escapeAttribute(item?.room || "")}" data-i18n-placeholder="placeholder.room"><span class="field-error" data-error-for="scheduleRoom"></span></div><div class="form-hint">${t("form.hint")}</div><div class="form-actions"><button type="button" class="secondary-button" data-modal-cancel data-i18n="action.cancel">${t("action.cancel")}</button><button type="submit" class="primary-button" data-i18n="${item ? "action.saveChanges" : "action.saveClass"}">${item ? t("action.saveChanges") : t("action.saveClass")}</button></div></div>`;
}
function holidayFormMarkup(item) {
  return `<div class="form-grid"><div class="field"><label for="holidayName" data-i18n="field.holidayName">${t("field.holidayName")}</label><input class="input" id="holidayName" maxlength="100" required placeholder="${escapeAttribute(t("placeholder.holidayName"))}" data-i18n-placeholder="placeholder.holidayName" value="${escapeAttribute(item?.name || "")}"><span class="field-error" data-error-for="holidayName"></span></div><div class="field"><label for="holidayDate" data-i18n="field.date">${t("field.date")}</label><input class="input" id="holidayDate" type="date" required value="${escapeAttribute(item?.date || isoDate(new Date()))}"><span class="field-error" data-error-for="holidayDate"></span></div><div class="form-actions"><button type="button" class="secondary-button" data-modal-cancel data-i18n="action.cancel">${t("action.cancel")}</button><button type="submit" class="primary-button" data-i18n="${item ? "action.saveChanges" : "action.saveHoliday"}">${item ? t("action.saveChanges") : t("action.saveHoliday")}</button></div></div>`;
}
function normalizeAutocompleteValue(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
}
function getAutocompleteValues(type) {
  const values = data.schedule.map((item) => item[type]).filter(Boolean);
  const seen = new Set();
  return values
    .map((value) => String(value).trim().replace(/\s+/g, " "))
    .filter((value) => {
      const key = normalizeAutocompleteValue(value);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
function autocompleteMatches(value, query) {
  const normalizedValue = normalizeAutocompleteValue(value);
  const normalizedQuery = normalizeAutocompleteValue(query);
  if (!normalizedQuery || normalizedValue.includes(normalizedQuery))
    return true;
  let queryIndex = 0;
  for (const character of normalizedValue) {
    if (character === normalizedQuery[queryIndex]) queryIndex += 1;
    if (queryIndex === normalizedQuery.length) return true;
  }
  return false;
}
function closeAutocomplete(input = null) {
  const lists = input
    ? [
        input
          .closest(".autocomplete-field")
          ?.querySelector(".autocomplete-list"),
      ]
    : [...modalForm.querySelectorAll(".autocomplete-list")];
  lists.filter(Boolean).forEach((list) => {
    list.classList.remove("is-open");
    list.previousElementSibling?.setAttribute("aria-expanded", "false");
    list.dataset.activeIndex = "-1";
  });
}
function updateAutocompleteActive(list, index) {
  const options = [...list.querySelectorAll("[role=option]")];
  if (!options.length) return;
  const nextIndex = (index + options.length) % options.length;
  options.forEach((option, optionIndex) =>
    option.classList.toggle("is-active", optionIndex === nextIndex),
  );
  list.dataset.activeIndex = String(nextIndex);
  list.previousElementSibling?.setAttribute(
    "aria-activedescendant",
    options[nextIndex].id,
  );
}
function renderAutocompleteSuggestions(input) {
  const list = input
    .closest(".autocomplete-field")
    ?.querySelector(".autocomplete-list");
  if (!list) return;
  const query = normalizeAutocompleteValue(input.value);
  const suggestions = getAutocompleteValues(input.dataset.autocomplete).filter(
    (value) => autocompleteMatches(value, query),
  );
  list.innerHTML = suggestions.length
    ? suggestions
        .map(
          (value, index) =>
            `<button type="button" role="option" id="${list.id}-${index}" class="autocomplete-option" data-autocomplete-value="${escapeAttribute(value)}">${escapeHtml(value)}</button>`,
        )
        .join("")
    : `<div class="autocomplete-empty">${escapeHtml(t("autocomplete.noResults"))}</div>`;
  list.dataset.activeIndex = "-1";
  list.classList.add("is-open");
  input.setAttribute("aria-expanded", "true");
  input.removeAttribute("aria-activedescendant");
}
function selectAutocompleteSuggestion(input, value) {
  input.value = value;
  input.classList.remove("has-error");
  closeAutocomplete(input);
}
function setFieldError(input, message) {
  const error = document.querySelector(
    `[data-error-for="${CSS.escape(input.id)}"]`,
  );
  input.classList.toggle("has-error", Boolean(message));
  if (error) error.textContent = message || "";
}
function validateAssignmentForm() {
  let valid = true;
  const title = document.getElementById("assignmentTitle");
  const subject = document.getElementById("assignmentSubject");
  const dueDate = document.getElementById("assignmentDue");
  setFieldError(title, title.value.trim() ? "" : t("form.enterAssignment"));
  valid &&= Boolean(title.value.trim());
  setFieldError(subject, subject.value.trim() ? "" : t("form.enterSubject"));
  valid &&= Boolean(subject.value.trim());
  setFieldError(dueDate, dueDate.value ? "" : t("form.enterDue"));
  valid &&= Boolean(dueDate.value);
  return valid;
}
function validateScheduleForm() {
  let valid = true;
  const subject = document.getElementById("scheduleSubject");
  const day = document.getElementById("scheduleDay");
  const start = document.getElementById("scheduleStart");
  const end = document.getElementById("scheduleEnd");
  const room = document.getElementById("scheduleRoom");
  setFieldError(subject, subject.value.trim() ? "" : t("form.enterSubject"));
  valid &&= Boolean(subject.value.trim());
  setFieldError(day, day.value ? "" : t("form.enterDay"));
  valid &&= Boolean(day.value);
  setFieldError(start, start.value ? "" : t("form.enterStart"));
  valid &&= Boolean(start.value);
  setFieldError(end, end.value ? "" : t("form.enterEnd"));
  valid &&= Boolean(end.value);
  setFieldError(room, room.value.trim() ? "" : t("form.enterRoom"));
  valid &&= Boolean(room.value.trim());
  if (valid && end.value <= start.value) {
    setFieldError(end, t("form.invalidTime"));
    valid = false;
  }
  if (
    valid &&
    hasScheduleConflict({
      day: day.value,
      time: start.value,
      end: end.value,
      id: modalState.id,
    })
  ) {
    setFieldError(end, t("form.conflict"));
    valid = false;
  }
  return valid;
}
function validateHolidayForm() {
  const name = document.getElementById("holidayName");
  const date = document.getElementById("holidayDate");
  let valid = true;
  setFieldError(name, name.value.trim() ? "" : t("form.enterHolidayName"));
  valid &&= Boolean(name.value.trim());
  setFieldError(
    date,
    isValidISODate(date.value) ? "" : t("form.enterHolidayDate"),
  );
  valid &&= isValidISODate(date.value);
  const duplicate = data.holidays.some(
    (item) =>
      item.date === date.value &&
      String(item.id) !== String(modalState.id || ""),
  );
  if (valid && duplicate) {
    setFieldError(date, t("form.duplicateHoliday"));
    valid = false;
  }
  return valid;
}
function hasScheduleConflict(candidate) {
  return data.schedule.some(
    (item) =>
      String(item.id) !== String(candidate.id || "") &&
      item.day === candidate.day &&
      candidate.time < item.end &&
      candidate.end > item.time,
  );
}
function closeModal() {
  if (modalBackdrop.classList.contains("hidden")) return;
  modalState = null;
  modalBackdrop.classList.add("hidden");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    finishModalClose();
}
function finishModalClose() {
  if (!modalBackdrop.classList.contains("hidden")) return;
  modalForm.replaceChildren();
  if (confirmBackdrop.classList.contains("hidden"))
    document.body.classList.remove("modal-open");
  lastFocusedElement?.focus?.();
  lastFocusedElement = null;
}
function handleModalSubmit(event) {
  event.preventDefault();
  if (!modalState) return;
  const previousData = clone(data);
  if (modalState.type === "assignment") {
    if (!validateAssignmentForm()) return;
    const next = {
      id: modalState.id || makeId(),
      title: document.getElementById("assignmentTitle").value.trim(),
      subject: document.getElementById("assignmentSubject").value.trim(),
      dueDate: document.getElementById("assignmentDue").value,
      done: modalState.id ? findItem("assignment", modalState.id).done : false,
    };
    const index = data.assignments.findIndex(
      (item) => String(item.id) === String(modalState.id),
    );
    if (index >= 0) data.assignments[index] = next;
    else data.assignments.push(next);
  } else if (modalState.type === "holiday") {
    if (!validateHolidayForm()) return;
    const next = {
      id: modalState.id || makeId(),
      name: document
        .getElementById("holidayName")
        .value.trim()
        .replace(/\s+/g, " "),
      date: document.getElementById("holidayDate").value,
    };
    const index = data.holidays.findIndex(
      (item) => String(item.id) === String(modalState.id),
    );
    if (index >= 0) data.holidays[index] = next;
    else data.holidays.push(next);
  } else {
    if (!validateScheduleForm()) return;
    const next = {
      id: modalState.id || makeId(),
      subject: document.getElementById("scheduleSubject").value.trim(),
      lecturer: document.getElementById("scheduleLecturer").value.trim(),
      day: document.getElementById("scheduleDay").value,
      time: document.getElementById("scheduleStart").value,
      end: document.getElementById("scheduleEnd").value,
      room: document.getElementById("scheduleRoom").value.trim(),
    };
    const index = data.schedule.findIndex(
      (item) => String(item.id) === String(modalState.id),
    );
    if (index >= 0) data.schedule[index] = next;
    else data.schedule.push(next);
  }
  const editing = Boolean(modalState.id);
  if (!saveData()) {
    data = previousData;
    render(true);
    return;
  }
  closeModal();
  render();
  showToast(t("toast.saved"));
  if (!editing) selectedCalendarDate = selectedCalendarDate;
}

function toggleAssignment(id, checked) {
  const item = findItem("assignment", id);
  if (!item) return;
  const previousDone = item.done;
  item.done = checked;
  if (!saveData()) {
    item.done = previousDone;
    render(true);
    return;
  }
  render();
  showToast(checked ? t("toast.completed") : t("toast.reopened"));
}
function requestDelete(type, id) {
  const item = findItem(type, id);
  if (!item) return;
  openConfirm({
    type: "delete",
    typeToDelete: type,
    id,
    title: item.title || item.subject || item.name,
  });
}
function deleteItem(type, id) {
  const previousData = clone(data);
  if (type === "assignment")
    data.assignments = data.assignments.filter(
      (item) => String(item.id) !== String(id),
    );
  else if (type === "schedule")
    data.schedule = data.schedule.filter(
      (item) => String(item.id) !== String(id),
    );
  else
    data.holidays = data.holidays.filter(
      (item) => String(item.id) !== String(id),
    );
  if (!saveData()) {
    data = previousData;
    render(true);
    return false;
  }
  render();
  showToast(t("toast.deleted"));
  return true;
}
function openConfirm(state) {
  lastConfirmFocusedElement = document.activeElement;
  confirmState = state;
  const isDeleteData = state.type === "delete-data";
  const isImport = state.type === "import";
  confirmEyebrow.textContent = isDeleteData
    ? t("confirm.deleteDataEyebrow")
    : isImport
      ? t("confirm.importEyebrow")
      : t("confirm.label");
  confirmTitle.textContent = isDeleteData
    ? t("confirm.deleteDataTitle")
    : isImport
      ? t("confirm.importTitle")
      : t("confirm.deleteTitle");
  confirmMessage.textContent = isDeleteData
    ? t("confirm.deleteDataMessage")
    : isImport
      ? t("confirm.importMessage")
      : `${state.title ? `“${state.title}” ` : ""}${t("confirm.deleteMessage")}`;
  confirmProceed.textContent = isDeleteData
    ? t("confirm.deleteAllData")
    : isImport
      ? t("confirm.import")
      : t("confirm.delete");
  confirmProceed.classList.toggle("danger-button", !isImport);
  confirmIcon.innerHTML = icon(isImport ? "upload" : "trash");
  confirmBackdrop.classList.remove("hidden");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => confirmProceed.focus());
}
function closeConfirm() {
  if (confirmBackdrop.classList.contains("hidden")) return;
  const wasImport = confirmState?.type === "import";
  confirmState = null;
  confirmBackdrop.classList.add("hidden");
  if (wasImport) pendingImportData = null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    finishConfirmClose();
}
function finishConfirmClose() {
  if (!confirmBackdrop.classList.contains("hidden")) return;
  if (modalBackdrop.classList.contains("hidden"))
    document.body.classList.remove("modal-open");
  lastConfirmFocusedElement?.focus?.();
  lastConfirmFocusedElement = null;
}
function deleteAllData() {
  let previousValues;
  try {
    previousValues = Object.fromEntries(
      KELASIN_STORAGE_KEYS.map((key) => [key, localStorage.getItem(key)]),
    );
  } catch (error) {
    console.error("KELASIN: could not read data before deletion.", error);
    showToast(t("toast.deleteError"), "error");
    return false;
  }

  try {
    KELASIN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    if (
      KELASIN_STORAGE_KEYS.some((key) => localStorage.getItem(key) !== null)
    ) {
      throw new Error("storage removal could not be verified");
    }
  } catch (error) {
    try {
      KELASIN_STORAGE_KEYS.forEach((key) => {
        if (previousValues[key] === null) localStorage.removeItem(key);
        else localStorage.setItem(key, previousValues[key]);
      });
    } catch (restoreError) {
      console.error(
        "KELASIN: could not restore data after delete failure.",
        restoreError,
      );
    }
    console.error("KELASIN: could not delete all data.", error);
    showToast(t("toast.deleteError"), "error");
    return false;
  }

  data = { version: DATA_VERSION, assignments: [], schedule: [], holidays: [] };
  currentSection = "dashboard";
  assignmentQuery = "";
  assignmentFilter = "all";
  selectedCalendarDate = isoDate(new Date());
  calendarCursor = startOfMonth(new Date());
  pendingImportData = null;
  language = "en";
  document.documentElement.lang = language;
  document.documentElement.dataset.theme = "dark";
  themeButton.innerHTML = icon("sun");
  setSidebarOpen(false);
  closeModal();
  applyStaticLanguage();
  updateThemeColor();
  render(true);
  showWelcome();
  return true;
}
function handleConfirmProceed() {
  if (!confirmState) return;
  if (confirmState.type === "delete-data") {
    closeConfirm();
    const deleted = deleteAllData();
    if (!deleted) render(true);
    return;
  }
  if (confirmState.type === "import") {
    const payload = pendingImportData;
    pendingImportData = null;
    if (!payload) {
      closeConfirm();
      return;
    }
    const previousData = data;
    let previousUser = null;
    try {
      previousUser = localStorage.getItem(USER_KEY);
    } catch (_) {}
    data = payload.data;
    if (!saveData()) {
      data = previousData;
      closeConfirm();
      render(true);
      return;
    }
    if (
      payload.profile &&
      !saveUserProfile(payload.profile.name, payload.profile.className)
    ) {
      data = previousData;
      saveData();
      try {
        if (previousUser === null) localStorage.removeItem(USER_KEY);
        else localStorage.setItem(USER_KEY, previousUser);
      } catch (_) {}
      closeConfirm();
      render(true);
      return;
    }
    assignmentQuery = "";
    assignmentFilter = "all";
    closeConfirm();
    render(true);
    showToast(t("toast.imported"));
    return;
  }
  deleteItem(confirmState.typeToDelete, confirmState.id);
  closeConfirm();
}

function requestDeleteAllData() {
  openConfirm({ type: "delete-data" });
}
function showToast(message, tone = "success") {
  clearTimeout(toastTimer);
  toastRegion.innerHTML = `<div class="toast ${tone}"><span class="toast-icon">${icon(tone === "error" ? "alert" : "check")}</span><span>${escapeHtml(message)}</span></div>`;
  toastTimer = setTimeout(() => {
    toastRegion.innerHTML = "";
  }, 2600);
}

function getFocusableElements(container) {
  return [
    ...container.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((element) => !element.hidden && element.offsetParent !== null);
}
function trapFocus(container, event) {
  const elements = getFocusableElements(container);
  if (!elements.length) return;
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function exportData() {
  const payload = {
    app: "KELASIN",
    version: DATA_VERSION,
    exportedAt: new Date().toISOString(),
    profile: clone(
      getUser() || {
        name: getUserName(),
        className: getClassName(),
        setupComplete: true,
      },
    ),
    data: clone(data),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `kelasin-backup-${isoDate(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast(t("toast.exported"));
}
async function importData(file) {
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const candidate = parsed?.app === "KELASIN" ? parsed.data : parsed;
    if (!isValidData(candidate)) throw new Error("invalid");
    const sanitized = sanitizeData(candidate);
    const profile =
      parsed?.app === "KELASIN" && parsed.profile ? parsed.profile : null;
    if (
      profile &&
      (typeof profile !== "object" ||
        typeof profile.name !== "string" ||
        !profile.name.trim() ||
        profile.name.trim().length > 40 ||
        typeof profile.className !== "string" ||
        profile.className.trim().length > 60)
    )
      throw new Error("invalid");
    pendingImportData = {
      data: sanitized,
      profile: profile
        ? { name: profile.name.trim(), className: profile.className.trim() }
        : null,
    };
    openConfirm({ type: "import" });
  } catch (error) {
    console.error("KELASIN: import failed.", error);
    showToast(t("toast.invalidBackup"), "error");
  }
  importFileInput.value = "";
}

function setSidebarOpen(open) {
  sidebar.classList.toggle("open", open);
  mobileScrim.classList.toggle("visible", open);
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? t("topbar.closeMenu") : t("topbar.openMenu"),
  );
}
function navigate(section) {
  currentSection = section;
  setSidebarOpen(false);
  render();
}
function bindRenderedInteractions() {
  if (
    currentSection === "settings" &&
    !document.getElementById("holidaySettings")
  )
    document
      .querySelector(".settings-grid")
      ?.insertAdjacentHTML("beforeend", renderHolidaySettings());
  const search = document.getElementById("assignmentSearch");
  if (search) {
    search.addEventListener("input", (event) => {
      assignmentQuery = event.target.value;
      const cursor = event.target.selectionStart;
      render(true);
      const next = document.getElementById("assignmentSearch");
      next?.focus();
      next?.setSelectionRange(cursor, cursor);
    });
  }
}

function icon(name) {
  const icons = {
    grid: '<svg viewBox="0 0 24 24" class="svg-icon"><rect x="4" y="4" width="6" height="6" rx="1.5"></rect><rect x="14" y="4" width="6" height="6" rx="1.5"></rect><rect x="4" y="14" width="6" height="6" rx="1.5"></rect><rect x="14" y="14" width="6" height="6" rx="1.5"></rect></svg>',
    calendar:
      '<svg viewBox="0 0 24 24" class="svg-icon"><rect x="3" y="4.5" width="18" height="17" rx="2.5"></rect><line x1="16" y1="2.5" x2="16" y2="6.5"></line><line x1="8" y1="2.5" x2="8" y2="6.5"></line><line x1="3" y1="9" x2="21" y2="9"></line></svg>',
    "calendar-days":
      '<svg viewBox="0 0 24 24" class="svg-icon"><rect x="3" y="4.5" width="18" height="17" rx="2.5"></rect><line x1="16" y1="2.5" x2="16" y2="6.5"></line><line x1="8" y1="2.5" x2="8" y2="6.5"></line><line x1="3" y1="9" x2="21" y2="9"></line><path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01"></path></svg>',
    "calendar-plus":
      '<svg viewBox="0 0 24 24" class="svg-icon"><rect x="3" y="4.5" width="18" height="17" rx="2.5"></rect><line x1="16" y1="2.5" x2="16" y2="6.5"></line><line x1="8" y1="2.5" x2="8" y2="6.5"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="12" y1="13" x2="12" y2="18"></line><line x1="9.5" y1="15.5" x2="14.5" y2="15.5"></line></svg>',
    list: '<svg viewBox="0 0 24 24" class="svg-icon"><line x1="9" y1="6.5" x2="20" y2="6.5"></line><line x1="9" y1="12" x2="20" y2="12"></line><line x1="9" y1="17.5" x2="20" y2="17.5"></line><path d="M4 6.5h.01M4 12h.01M4 17.5h.01"></path></svg>',
    settings:
      '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"></path><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06-1.63 1.63-.06-.06a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.66v.09h-2.3v-.09a1.8 1.8 0 0 0-1.1-1.66 1.8 1.8 0 0 0-1.98.36l-.06.06-1.63-1.63.06-.06A1.8 1.8 0 0 0 8.4 15a1.8 1.8 0 0 0-1.66-1.1h-.09v-2.3h.09A1.8 1.8 0 0 0 8.4 10.5a1.8 1.8 0 0 0-.36-1.98l-.06-.06 1.63-1.63.06.06a1.8 1.8 0 0 0 1.98.36A1.8 1.8 0 0 0 12.75 5.6v-.09h2.3v.09a1.8 1.8 0 0 0 1.1 1.66 1.8 1.8 0 0 0 1.98-.36l.06-.06 1.63 1.63-.06.06a1.8 1.8 0 0 0-.36 1.98 1.8 1.8 0 0 0 1.66 1.1h.09v2.3h-.09A1.8 1.8 0 0 0 19.4 15Z"></path></svg>',
    plus: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 5v14M5 12h14"></path></svg>',
    "arrow-right":
      '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>',
    arrow:
      '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M5 12h12M13 6l6 6-6 6"></path></svg>',
    pencil:
      '<svg viewBox="0 0 24 24" class="svg-icon"><path d="m4 16 9.9-9.9a2.1 2.1 0 0 1 3 0l1 1a2.1 2.1 0 0 1 0 3L8 20l-4 1 1-5Z"></path></svg>',
    trash:
      '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M5 7h14M9 7V4h6v3M8 7l.7 13h6.6L16 7M10 10v7M14 10v7"></path></svg>',
    check:
      '<svg viewBox="0 0 24 24" class="svg-icon"><path d="m5 12 4 4L19 6"></path></svg>',
    alert:
      '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 8v5M12 17h.01"></path><path d="M10.3 4.8 3.9 16a2 2 0 0 0 1.75 3h12.7a2 2 0 0 0 1.75-3L13.7 4.8a2 2 0 0 0-3.4 0Z"></path></svg>',
    database:
      '<svg viewBox="0 0 24 24" class="svg-icon"><ellipse cx="12" cy="6.5" rx="7" ry="3"></ellipse><path d="M5 6.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6M5 12.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"></path></svg>',
    sun: '<svg viewBox="0 0 24 24" class="svg-icon"><circle cx="12" cy="12" r="3.5"></circle><path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>',
    moon: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M20 15.1A8.2 8.2 0 0 1 8.9 4a8.9 8.9 0 1 0 11.1 11.1Z"></path></svg>',
    "chevron-left":
      '<svg viewBox="0 0 24 24" class="svg-icon"><path d="m15 5-7 7 7 7"></path></svg>',
    "chevron-right":
      '<svg viewBox="0 0 24 24" class="svg-icon"><path d="m9 5 7 7-7 7"></path></svg>',
    menu: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>',
    x: '<svg viewBox="0 0 24 24" class="svg-icon"><path d="m6 6 12 12M18 6 6 18"></path></svg>',
    download:
      '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 4v10M8 10l4 4 4-4M5 19h14"></path></svg>',
    upload:
      '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 20V10M8 14l4-4 4 4M5 5h14"></path></svg>',
    refresh:
      '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M20 11a8 8 0 1 0 1 4M20 5v6h-6"></path></svg>',
    search:
      '<svg viewBox="0 0 24 24" class="svg-icon"><circle cx="10.8" cy="10.8" r="5.8"></circle><path d="m16 16 4.5 4.5"></path></svg>',
    sparkles:
      '<svg viewBox="0 0 24 24" class="svg-icon"><path d="m12 3 1.4 4.1L17 8.5l-3.6 1.4L12 14l-1.4-4.1L7 8.5l3.6-1.4L12 3ZM18 13l.8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13Z"></path></svg>',
  };
  return icons[name] || "";
}
function escapeHtml(value) {
  return String(value).replace(
    /[&<>'"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        char
      ],
  );
}
function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

// Global interactions
applyStaticLanguage();
languageCode.textContent = language.toUpperCase();
themeButton.innerHTML = icon(currentTheme() === "dark" ? "sun" : "moon");
installButton.innerHTML = icon("download");
menuButton.innerHTML = icon("menu");
modalClose.innerHTML = icon("x");

document.querySelectorAll(".nav-icon[data-icon]").forEach((element) => {
  element.innerHTML = icon(element.dataset.icon);
});

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-section]");
  if (nav) {
    navigate(nav.dataset.section);
    return;
  }
  const link = event.target.closest("[data-section-link]");
  if (link) {
    navigate(link.dataset.sectionLink);
    return;
  }
  const action = event.target.closest("[data-action]");
  if (action) {
    const name = action.dataset.action;
    if (name === "add-assignment") openModal("assignment");
    if (name === "add-schedule") openModal("schedule");
    if (name === "add-holiday") openModal("holiday");
    if (name === "delete-data") requestDeleteAllData();
    if (name === "export-data") exportData();
    if (name === "import-data") importFileInput.click();
    if (name === "toggle-language")
      setLanguage(language === "en" ? "id" : "en");
    if (name === "save-name" || name === "save-profile") saveProfile();
    return;
  }
  const calendarAction = event.target.closest("[data-calendar-action]");
  if (calendarAction) {
    const actionName = calendarAction.dataset.calendarAction;
    if (actionName === "prev")
      calendarCursor = new Date(
        calendarCursor.getFullYear(),
        calendarCursor.getMonth() - 1,
        1,
      );
    if (actionName === "next")
      calendarCursor = new Date(
        calendarCursor.getFullYear(),
        calendarCursor.getMonth() + 1,
        1,
      );
    if (actionName === "today") {
      const today = new Date();
      calendarCursor = startOfMonth(today);
      selectedCalendarDate = isoDate(today);
    }
    if (actionName === "add-class") {
      const target = new Date(`${selectedCalendarDate}T00:00:00`);
      openModal("schedule", null, { prefillDay: getDayNameForDate(target) });
      return;
    }
    render();
    return;
  }
  const dateButton = event.target.closest("[data-calendar-date]");
  if (dateButton) {
    selectedCalendarDate = dateButton.dataset.calendarDate;
    render();
    return;
  }
  const calendarSchedule = event.target.closest(
    "[data-calendar-edit-schedule]",
  );
  if (calendarSchedule) {
    openModal("schedule", calendarSchedule.dataset.calendarEditSchedule);
    return;
  }
  const calendarAssignment = event.target.closest(
    "[data-calendar-edit-assignment]",
  );
  if (calendarAssignment) {
    openModal("assignment", calendarAssignment.dataset.calendarEditAssignment);
    return;
  }
  const filterTarget = event.target.closest("[data-assignment-filter]");
  if (filterTarget) {
    assignmentFilter = filterTarget.dataset.assignmentFilter;
    render();
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
  const deleteAssignmentButton = event.target.closest(
    "[data-delete-assignment]",
  );
  if (deleteAssignmentButton) {
    requestDelete(
      "assignment",
      deleteAssignmentButton.dataset.deleteAssignment,
    );
    return;
  }
  const editSchedule = event.target.closest("[data-edit-schedule]");
  if (editSchedule) {
    openModal("schedule", editSchedule.dataset.editSchedule);
    return;
  }
  const deleteScheduleButton = event.target.closest("[data-delete-schedule]");
  if (deleteScheduleButton) {
    requestDelete("schedule", deleteScheduleButton.dataset.deleteSchedule);
    return;
  }
  const editHoliday = event.target.closest("[data-edit-holiday]");
  if (editHoliday) {
    openModal("holiday", editHoliday.dataset.editHoliday);
    return;
  }
  const deleteHolidayButton = event.target.closest("[data-delete-holiday]");
  if (deleteHolidayButton) {
    requestDelete("holiday", deleteHolidayButton.dataset.deleteHoliday);
    return;
  }
  const settingTheme = event.target.closest("[data-setting-theme]");
  if (settingTheme) {
    toggleTheme(settingTheme.dataset.settingTheme);
    render(true);
    return;
  }
});

welcomeContinue.addEventListener("click", completeWelcome);
welcomeBack.addEventListener("click", () => setWelcomeStep(1, -1));
welcomeName.addEventListener("input", () => {
  welcomeName.classList.remove("has-error");
  welcomeError.textContent = "";
});
welcomeClass.addEventListener("input", () => {
  welcomeClass.classList.remove("has-error");
  welcomeClassError.textContent = "";
});
welcomeName.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    completeWelcome();
  }
});
welcomeClass.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    completeWelcome();
  }
});
welcomeLanguageButton.addEventListener("click", () =>
  setLanguage(language === "en" ? "id" : "en"),
);

themeButton.addEventListener("click", () => toggleTheme());
languageButton.addEventListener("click", () =>
  setLanguage(language === "en" ? "id" : "en"),
);
menuButton.addEventListener("click", () =>
  setSidebarOpen(!sidebar.classList.contains("open")),
);
mobileScrim.addEventListener("click", () => setSidebarOpen(false));
modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});
modalBackdrop.addEventListener("transitionend", (event) => {
  if (event.target === modalBackdrop && event.propertyName === "opacity")
    finishModalClose();
});
modalForm.addEventListener("submit", handleModalSubmit);
modalForm.addEventListener("input", (event) => {
  const input = event.target.closest("[data-autocomplete]");
  if (!input) return;
  input.classList.remove("has-error");
  renderAutocompleteSuggestions(input);
});
modalForm.addEventListener("focusin", (event) => {
  const input = event.target.closest("[data-autocomplete]");
  if (input) renderAutocompleteSuggestions(input);
});
modalForm.addEventListener("keydown", (event) => {
  const input = event.target.closest("[data-autocomplete]");
  if (!input) return;
  const list = input
    .closest(".autocomplete-field")
    ?.querySelector(".autocomplete-list");
  if (!list?.classList.contains("is-open")) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      renderAutocompleteSuggestions(input);
      updateAutocompleteActive(list, 0);
    }
    return;
  }
  const options = [...list.querySelectorAll("[role=option]")];
  const activeIndex = Number(list.dataset.activeIndex || -1);
  if (event.key === "ArrowDown" && options.length) {
    event.preventDefault();
    updateAutocompleteActive(list, activeIndex + 1);
  } else if (event.key === "ArrowUp" && options.length) {
    event.preventDefault();
    updateAutocompleteActive(list, activeIndex - 1);
  } else if (event.key === "Enter" && activeIndex >= 0) {
    event.preventDefault();
    selectAutocompleteSuggestion(
      input,
      options[activeIndex].dataset.autocompleteValue,
    );
  } else if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    closeAutocomplete(input);
  }
});
modalForm.addEventListener("click", (event) => {
  if (event.target.closest("[data-modal-cancel]")) closeModal();
  const option = event.target.closest("[data-autocomplete-value]");
  const input = option
    ?.closest(".autocomplete-field")
    ?.querySelector("[data-autocomplete]");
  if (option && input)
    selectAutocompleteSuggestion(input, option.dataset.autocompleteValue);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".autocomplete-field")) closeAutocomplete();
});
confirmCancel.addEventListener("click", closeConfirm);
confirmProceed.addEventListener("click", handleConfirmProceed);
confirmBackdrop.addEventListener("click", (event) => {
  if (event.target === confirmBackdrop) closeConfirm();
});
confirmBackdrop.addEventListener("transitionend", (event) => {
  if (event.target === confirmBackdrop && event.propertyName === "opacity")
    finishConfirmClose();
});
importFileInput.addEventListener("change", (event) =>
  importData(event.target.files?.[0]),
);

document.addEventListener("keydown", (event) => {
  if (!welcomeScreen.classList.contains("hidden")) {
    if (event.key === "Escape") {
      event.preventDefault();
      return;
    }
    if (event.key === "Tab") trapFocus(welcomeScreen, event);
    return;
  }
  if (!confirmBackdrop.classList.contains("hidden")) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeConfirm();
      return;
    }
    if (event.key === "Tab") trapFocus(confirmBackdrop, event);
    return;
  }
  if (!modalBackdrop.classList.contains("hidden")) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (event.key === "Tab") trapFocus(modalBackdrop, event);
    return;
  }
  if (event.key === "Escape" && sidebar.classList.contains("open")) {
    setSidebarOpen(false);
    return;
  }
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const target = event.target;
  const typing =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable;
  if (typing) return;
  if (event.key.toLowerCase() === "n") {
    event.preventDefault();
    openModal("schedule");
  }
  if (event.key.toLowerCase() === "a") {
    event.preventDefault();
    openModal("assignment");
  }
  if (event.key === "/") {
    event.preventDefault();
    navigate("assignments");
    requestAnimationFrame(() =>
      document.getElementById("assignmentSearch")?.focus(),
    );
  }
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});
window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  installButton.hidden = true;
  showToast(t("toast.installed"));
});
installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    showToast(t("toast.installHelp"), "error");
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .catch((error) =>
        console.warn("KELASIN: service worker registration failed.", error),
      );
  });
}

updateThemeColor();
applyStaticLanguage();
try {
  const requestedSection = new URLSearchParams(window.location.search).get(
    "section",
  );
  if (
    ["dashboard", "schedule", "calendar", "assignments", "settings"].includes(
      requestedSection,
    )
  )
    currentSection = requestedSection;
} catch (_) {}
render(true);
const existingUser = getUser();
if (!existingUser?.setupComplete || !getUserName()) showWelcome();

setInterval(() => {
  if (currentSection === "dashboard" && document.visibilityState !== "hidden")
    render(true);
}, 30000);
