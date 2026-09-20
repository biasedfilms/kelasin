# KELASIN

**v1.4.0 pre-release : local-first class manager + PWA**

KELASIN is a small class management web app made for **Teknik Informatika 2026 B**.

The project stays intentionally lightweight: plain HTML, CSS, and vanilla JavaScript, with browser storage instead of a backend. The goal is to build something useful while still keeping the code understandable for a semester-1 Informatics Engineering student.

## What it can do

### Dashboard
- Shows today's classes, pending work, overdue work, and the next class.
- Quick actions for adding a class or assignment.
- Local-first status so it is clear that data stays in the browser.
- Restore the starter workspace through a proper confirmation flow.

### Schedule
- Add, edit, and delete classes.
- Sorts classes by weekday and start time.
- Highlights the current day.
- Prevents overlapping classes on the same weekday.
- Supports quick creation from the calendar.

### Calendar
- Month view mapped to the saved weekly schedule.
- Classes repeat automatically on their matching weekday.
- Assignment deadlines appear on their actual dates.
- Selected-day agenda shows classes and due work together.
- Previous / next month and Today controls.
- Mobile-friendly calendar with a compact agenda below it.

### Assignments
- Add, edit, and delete assignments.
- Mark work as done or move it back to pending.
- Search by title or subject.
- Filter by all, pending, done, or overdue.
- Automatic deadline labels such as Today, Tomorrow, and Overdue.

### Settings & data
- English / Bahasa Indonesia interface switch.
- Dark mode by default, with Light mode available.
- Language and theme choices are remembered locally.
- Export a JSON backup of the current workspace.
- Import a previously exported backup.
- Restore the sample workspace with a clear confirmation dialog.
- Small keyboard shortcuts for desktop: `N`, `A`, `/`, and `Esc`.

### App / PWA
- Installable as a PWA on supported browsers.
- Offline app-shell caching through a service worker.
- Custom favicon, PWA icons, and Apple touch icon.
- Responsive desktop, tablet, and mobile layouts.
- Reduced-motion support for accessibility.
- No account, backend, or AI service required.

## Run locally

Use a local development server for the full experience. Service workers and PWA installation do not work from `file://`.

### Windows

1. Install [VS Code](https://code.visualstudio.com/).
2. Open the KELASIN folder.
3. Install the **Live Server** extension.
4. Right-click `index.html` and choose **Open with Live Server**.

### macOS

1. Open the KELASIN folder in VS Code.
2. Install **Live Server** if it is not already installed.
3. Right-click `index.html` and choose **Open with Live Server**.

### Linux

The same Live Server steps work on Linux. A simple static server also works, for example:

```bash
python3 -m http.server 5500
```

Then open `http://localhost:5500`.

## Project structure

```text
kelasin/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/
│   ├── icon.svg
│   ├── favicon.svg
│   ├── favicon-32.png
│   ├── favicon.ico
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
├── manifest.webmanifest
├── sw.js
├── README.md
└── .gitignore
```

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- `localStorage`
- Web App Manifest + Service Worker (PWA)
- Git / GitHub

No framework is used on purpose. The app is small enough to understand from the source and strong enough to behave like a real installable web app.

## Data & privacy

KELASIN is local-first in this version. Class and assignment data is stored in the browser using `localStorage`. There is no login or application server behind the project.

Clearing the browser's site data will also clear the saved workspace. Use **Settings → Export backup** before moving browsers or devices if you want to keep a copy.

The **Restore sample workspace** action intentionally replaces the current local workspace with the starter data and asks for confirmation first.

## Pre-release notes

This pre-release focuses on the final product feel rather than adding a large number of new modules: smoother motion, clearer states, responsive behavior, bilingual UI, backup/restore tools, keyboard shortcuts, and more consistent PWA behavior.

The project has been statically checked for JavaScript/service-worker syntax and core asset references. Browser-specific PWA behavior still depends on the browser and hosting environment.

