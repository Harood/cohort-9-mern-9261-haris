# SyncNote

A full-stack note-taking web app built with the MERN-adjacent stack (MySQL instead of MongoDB) — think a simplified, personal version of Notion. Built as part of the 10Pearls Shine Internship Program 2025, Cohort 9.

**Live demo:** _(add your deployed link here if/when available)_

![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=Harood_cohort-9-mern-9261-haris&metric=alert_status)

---

## Features

- **Authentication** — signup/login with JWT, bcrypt password hashing, protected routes
- **Notes CRUD** — create, view, edit, delete notes, scoped to the logged-in user
- **Rich text editor** (Tiptap) — bold, italic, headings, lists, quotes, code blocks, text color, highlight
- **Image support** — paste, drag-and-drop, or upload images directly into notes (stored as base64)
- **Markdown paste** — pasting markdown-formatted text (e.g. from ChatGPT/Claude) auto-converts to rich formatting
- **Search** — live filter notes by title/content
- **User Profile** page
- **Dark mode**
- **Responsive, animated UI** — Tailwind CSS + Framer Motion

---

## Tech Stack

**Backend**
- Node.js, Express
- MySQL (via `mysql2`)
- JWT authentication, bcrypt password hashing
- Pino (structured logging)
- Mocha, Chai, Supertest (testing)
- express-rate-limit (auth throttling)

**Frontend**
- React (Vite)
- Tailwind CSS
- Tiptap (rich text editor)
- Framer Motion (animations)
- Axios, React Router

**Tooling / Quality**
- CodeRabbit (automated PR code review)
- SonarCloud (static code analysis, quality gate)
- GitHub Actions (CI)

---

## Project Structure
cohort-9-mern-9261-haris/
├── backend/
│ ├── config/ # DB connection
│ ├── controllers/ # Request handlers
│ ├── middleware/ # Auth + error handling
│ ├── models/ # DB queries
│ ├── routes/ # API routes
│ ├── services/ # Business logic
│ ├── tests/ # Mocha/Chai/Supertest tests
│ ├── utils/ # Logger config
│ ├── app.js # Express app setup
│ └── server.js # Entry point
├── frontend/
│ └── src/
│ ├── api/ # Axios instance
│ ├── components/ # Reusable UI components
│ ├── context/ # Auth context
│ ├── pages/ # Route-level pages
│ └── utils/ # Sanitization helper
├── docs/
│ └── sonarqube/ # SonarQube analysis screenshots
└── .github/workflows/ # CI (SonarCloud analysis)


---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server + MySQL Workbench (or CLI)

### 1. Clone the repo
```bash
git clone https://github.com/Harood/cohort-9-mern-9261-haris.git
cd cohort-9-mern-9261-haris
```

### 2. Set up the database
Open MySQL Workbench (or CLI) and run:
```sql
CREATE DATABASE notes_app;

USE notes_app;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=notes_app
DB_PORT=3306
PORT=5000
JWT_SECRET=a_long_random_string_at_least_32_characters
FRONTEND_URL=http://localhost:5173


Run the backend:
```bash
npm run dev
```
Server runs on `http://localhost:5000`.

### 4. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`.

### 5. Run backend tests
```bash
cd backend
npm test
```

---

## API Overview

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Log in, get JWT | No |
| GET | `/api/notes` | List logged-in user's notes | Yes |
| POST | `/api/notes` | Create a note | Yes |
| GET | `/api/notes/:id` | Get a single note | Yes |
| PUT | `/api/notes/:id` | Update a note | Yes |
| DELETE | `/api/notes/:id` | Delete a note | Yes |

---

## Code Quality

- **CodeRabbit** automatically reviews every pull request
- **SonarCloud** runs static analysis on every push to `main` — see [`docs/sonarqube/`](./docs/sonarqube/) for the latest report and [live dashboard](https://sonarcloud.io/project/overview?id=Harood_cohort-9-mern-9261-haris)
- Backend covered by 18 Mocha/Chai/Supertest integration tests

---

## Branching Strategy

- `main` — production-ready
- `develop` — integration branch
- `feature/backend/*`, `feature/frontend/*` — feature branches
- `bugfix/backend/*`, `bugfix/frontend/*` — bugfix branches

---

## Author

**Haris Masood** — Software Engineering student, NED University of Engineering & Technology
10Pearls Shine Internship Program 2025, Cohort 9