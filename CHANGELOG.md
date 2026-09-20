# Changelog

All notable changes to KELASIN are documented here.

The changelog follows the version history currently present in the repository.

---

## [1.4.0] — 2026-09-20

**Pre-release : Local-first class manager + PWA**

### Added

* English / Bahasa Indonesia interface switch.
* Persistent language and theme preferences.
* Dedicated Settings section.
* JSON workspace export and import.
* Confirmation flow for restoring the starter workspace.
* Desktop keyboard shortcuts:

  * `N` — create a new item.
  * `A` — open assignments.
  * `/` — focus search.
  * `Esc` — close active dialogs.
* Local-first status messaging.
* PWA shortcuts for Dashboard, Calendar, and Assignments.
* Additional application metadata for installation and sharing.
* Reduced-motion support.
* Improved mobile interaction handling.

### Changed

* Refined the overall application shell and navigation.
* Refined the dashboard layout and information hierarchy.
* Improved Schedule, Calendar, Assignments, and Settings interfaces.
* Improved responsive behavior across desktop, tablet, and mobile.
* Refined dialogs and confirmation flows.
* Added smoother page transitions and micro-interactions.
* Improved button, focus, hover, and touch states.
* Improved PWA manifest configuration.
* Updated the service-worker cache to `v1.4.0`.
* Improved theme and language restoration during initial page load.
* Updated README documentation and release information.

### Fixed

* Removed duplicate favicon declarations.
* Improved initial theme restoration.
* Improved language preference restoration.
* Refined confirmation behavior for destructive actions.
* Corrected the v1.4.0 version label in the README.
* Removed the author section from the README during final pre-release cleanup.

---

## [1.3.0] — 2026-09-20

### Added

* New month-based Calendar view.
* Previous month, next month, and Today controls.
* Selected-day agenda.
* Classes displayed automatically according to their recurring weekly schedule.
* Assignment deadlines displayed on their actual calendar dates.
* Quick class creation from a selected calendar date.
* Mobile-friendly calendar layout with a compact agenda.

### Changed

* Added Calendar as a dedicated section alongside:

  * Dashboard
  * Schedule
  * Assignments
* Calendar uses the existing `localStorage` schedule instead of introducing a separate data source.
* Updated the service-worker cache to `v1.3.0`.

---

## [1.2.0] — 2026-09-19

### Added

* Progressive Web App (PWA) support.
* Offline application-shell caching through a service worker.
* Web App Manifest.
* Custom KELASIN favicon.
* Custom PWA application icons.
* Apple Touch Icon.
* Mobile PWA metadata.
* Apple-like micro-interactions.
* Restrained page transitions.
* Improved component interactions and responsive behavior.

### Changed

* Refined the overall visual design.
* Improved cards, buttons, navigation, and application surfaces.
* Added PWA assets and configuration.
* Updated the README with PWA setup instructions.
* Added local development-server requirements for PWA functionality.

### Notes

Service workers and PWA installation require the application to be served through a local or hosted web server. Opening the application directly through `file://` does not provide the complete PWA experience.

---

## [1.0.0] — 2026-09-19

### Added

* Initial KELASIN class-management dashboard.
* Dashboard showing today's classes.
* Pending assignment overview.
* Next-class information.
* Weekly class schedule.
* Add-class functionality.
* Assignment management.
* Add assignments.
* Search assignments.
* Mark assignments as completed.
* Delete assignments.
* Browser persistence using `localStorage`.
* Light mode.
* Dark mode.
* Responsive desktop and smaller-screen layouts.
* Form validation.
* Basic error handling.
* Local-first data storage.

### Project Foundation

* Built with plain HTML5, CSS3, and vanilla JavaScript.
* No frontend framework.
* No backend.
* No authentication.
* No database server.
* No AI API.
* Initial project structure:

  * `index.html`
  * `css/style.css`
  * `js/app.js`
  * `assets/`
  * `README.md`
* Added `.gitignore`.
* Established the initial KELASIN visual identity and class-dashboard concept.

---

## Repository History

The current repository history contains the following documented stages:

| Version    | Date       | Stage                      |
| ---------- | ---------- | -------------------------- |
| **v1.0.0** | 2026-09-19 | Initial class dashboard    |
| **v1.2.0** | 2026-09-19 | UI polish + PWA            |
| **v1.3.0** | 2026-09-20 | Calendar                   |
| **v1.4.0** | 2026-09-20 | Pre-release product polish |

There are currently no versioned `v1.5` or `v1.6` commits represented in the repository history used for this changelog.

Future releases should be added above `v1.4.0` when the corresponding changes are committed or tagged.
