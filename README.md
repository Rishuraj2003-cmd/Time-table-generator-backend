# Timetable Backend (Node + Express + MongoDB)

## Quick Start
1) Create `.env` from `.env.example` and set values.
2) Install deps: `npm install`
3) Run locally: `npm run dev`
4) Endpoints base: `/api`

## Deploy
- **MongoDB Atlas**: create a free cluster and get connection string.
- **Render/Railway/Heroku**: create a web service, set environment variables `MONGODB_URI`, `CLIENT_ORIGIN`, `PORT` (optional), and set start command `node src/server.js` (already the default).

## API Overview
- `POST /api/subjects` { subjects:[{name, totalLectures, teacherName}] }
- `POST /api/teachers` { teachers:[{name, maxLecturesPerWeek}] }
- `POST /api/settings` { days:["Mon","Tue","Wed","Thu","Fri"], periodsPerDay:6 }
- `POST /api/timetable/generate` -> generates and persists a new timetable
- `GET  /api/timetable` -> returns the latest timetable grid
- `DELETE /api/reset` -> clears subjects, teachers, timetable (use carefully)

## Notes
- Generator enforces:
  * teacher not double-booked in same slot
  * subject gets exactly `totalLectures` per week
  * teacher weekly max is not exceeded
  * avoids consecutive same subject in the same day when possible
# Time-table-generator-backend
