# Moringa Pair

Moringa Pair is a React-based front-end application for managing student mentoring and pairing workflows. The application supports both student and admin experiences, making it useful for tracking progress, pairing learners, and managing cohorts and mentorship data.

## Features

### Student experience
- Login and sign-up flows
- Student dashboard
- Profile management
- Pairing recommendations and history
- Assessment access

### Admin experience
- Admin dashboard overview
- Cohort management
- Mentor management
- Student management
- Settings page

## Tech stack
- React 19
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS
- Jest + Testing Library

## Project structure

```text
moringa-pair/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
├── README.md
└── .gitignore
```

## Getting started

From the project root:

```bash
cd frontend
npm install
npm run dev
```

The app will start in development mode with Vite, typically at:

```text
http://localhost:5173
```

## Available scripts

Inside the frontend directory, you can run:

```bash
npm run dev
npm run build
npm run test
npm run lint
npm run preview
```

## Notes

This repository currently contains the front-end application and uses mock or sample data for the dashboard, student, mentor, and cohort views. It is structured to be extended with a backend API in the future.
