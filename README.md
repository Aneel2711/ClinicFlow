# ClinicFlow — Doctor Appointment Management

A responsive clinic dashboard built with React, TypeScript and Vite. It includes an overview, daily schedule, appointment creation and status management, patient directory, and doctor/team directory.

## Requirements
- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```
The production files are generated in `dist/`.

## Deploy to GitHub
1. Create a new empty repository on GitHub.
2. Extract this project and upload the project files (keep the `src` folder).
3. In your terminal, run `npm install` and `npm run build` to verify the project.
4. For the simplest live deployment, import the GitHub repository into Vercel and accept the detected Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Every push to the connected branch will trigger a new deployment.

## Features
- Dashboard cards for today's appointments, upcoming confirmed visits, pending confirmation, and patient count.
- Daily appointment timeline sorted by start time.
- Create appointment with patient, doctor, date, time, duration, clinic/room, reason and status.
- Update appointment status from the appointment table.
- Search and filter appointments; patient and doctor directories.
- Responsive layout for desktop, tablet and mobile.
- Demo data is preloaded on first run.

## Important: demo storage vs production
This starter stores records in the browser's `localStorage`. It is suitable for a prototype and local demonstration, but it is **not** a secure multi-user medical records system:
- Data is limited to the browser/device and is not shared across staff devices.
- There is no login, role-based access, server database, backups, audit trail, or encrypted medical-record storage.
- Do not enter real patient health information into this demo.

Before using this with real patients, connect a secure backend (for example, Supabase or a properly configured API + PostgreSQL), add authentication and staff roles, enforce server-side appointment conflict checks, configure backups and audit logs, and obtain legal/privacy review for the jurisdictions where the clinic operates. Avoid storing sensitive clinical notes in browser storage.

## Suggested production data model
- `users`: staff identity, role, clinic membership
- `doctors`: specialty, room, working hours, clinic
- `patients`: minimum necessary contact and demographic details
- `appointments`: patient, doctor, start/end time, location, reason, status
- `audit_logs`: actor, action, record, timestamp

## Project structure
```text
clinicflow-doctor-appointments/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── data.ts
    ├── storage.ts
    ├── types.ts
    ├── utils.ts
    ├── styles.css
    └── components/
        ├── AppointmentForm.tsx
        └── Modal.tsx
```
