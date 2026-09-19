# KELASIN

KELASIN is a small class-management dashboard made for university students. The idea is simple: keep a student's weekly schedule and class assignments in one place without turning it into another complicated academic system.

This is **version 1.0**, built as a semester 1 Informatics Engineering project. The focus is on learning the basics of web development: HTML structure, CSS layout, JavaScript DOM manipulation, simple CRUD, and browser storage.

## What it can do

- View a class dashboard
- See today's classes
- Add classes to a weekly schedule
- Add, search, complete, and delete assignments
- Save data with `localStorage`, so it stays after refreshing the page
- Toggle between light and dark mode
- Responsive layout for desktop and smaller screens

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`
- Lucide icons
- Git + GitHub

There is no framework, backend, database server, authentication, or AI API in v1.0. Keeping the project small is intentional.

## Run locally

### Windows / macOS / Linux

1. Download or clone the repository.
2. Open the folder in VS Code.
3. Open `index.html` with Live Server.
4. The app should open in your browser.

You can also open `index.html` directly in a modern browser, but Live Server is recommended while developing.

### With Git

```bash
git clone https://github.com/your-username/kelasin.git
cd kelasin
```

Then open the folder in VS Code and run `index.html` with Live Server.

## Project structure

```text
kelasin/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/
└── README.md
```

## Notes

KELASIN is intentionally local-first for the first release. Class and assignment data are stored only in the browser using `localStorage`.

That means:

- data is not uploaded to a server;
- clearing browser site data can remove saved entries;
- the data is tied to the browser/device where it was entered.

## Roadmap

### v1.0 — Current
- Dashboard
- Schedule CRUD (add)
- Assignment CRUD
- Search assignments
- Light/dark theme
- Local storage
- Responsive layout

### Possible v1.1
- Edit schedule entries
- Edit assignments
- Attendance tracker
- Notes per subject
- Weekly calendar view
- Export/import local data

## Why this project exists

I wanted a project that was useful for an actual student but still small enough to understand from top to bottom. KELASIN is a practice project for learning web fundamentals before moving on to larger applications and frameworks.

---

Made by a first-semester Informatics Engineering student.
