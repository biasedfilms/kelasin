# KELASIN

A small class management web app made for **Teknik Informatika 2026 B**.

KELASIN is intentionally simple. It is a semester-1 style project built with plain HTML, CSS, and JavaScript instead of a framework or backend.

## What it can do

### Dashboard
- Shows today's classes
- Shows pending and overdue assignments
- Shows the next class
- Quick actions for adding a class or assignment

### Schedule
- Add a class
- Edit a class
- Delete a class
- Sorts classes by day and start time
- Highlights the current day
- Prevents overlapping classes

### Assignments
- Add an assignment
- Edit an assignment
- Delete an assignment
- Mark work as done / pending
- Search by assignment or subject
- Filter by all, pending, done, or overdue

### General
- Data is stored locally with `localStorage`
- Dark mode is the default
- Light mode is available and remembered
- Responsive layout for desktop, tablet, and phone
- No account, backend, or AI service required
- Built-in form validation and simple error handling

## Run locally

### Windows

1. Install [VS Code](https://code.visualstudio.com/).
2. Open this folder in VS Code.
3. Install the **Live Server** extension.
4. Right-click `index.html` and choose **Open with Live Server**.

### macOS

1. Open this folder in VS Code.
2. Install **Live Server** if you do not already have it.
3. Right-click `index.html` and choose **Open with Live Server**.

### Linux

The same Live Server steps work on Linux. You can also open `index.html` directly in a browser for the basic app because there is no backend.

## Project structure

```text
kelasin-v1/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/
├── README.md
└── .gitignore
```

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- localStorage
- Git / GitHub

No framework is used on purpose. The goal is to keep the project easy to read and understand while learning the fundamentals.

## Notes

KELASIN is a local browser app in its current version. Clearing browser site data will also clear saved KELASIN data. The dashboard includes a **Reset demo data** action for quickly returning to the starter state.

## Author

Mikael — Informatics Engineering student
