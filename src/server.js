import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import './db.js';
import subjectsRouter from './routes/subjects.js';
import teachersRouter from './routes/teachers.js';
import settingsRouter from './routes/settings.js';
import timetableRouter from './routes/timetable.js';
import resetRouter from './routes/reset.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',') || ['http://localhost:5173'];

// Proper CORS for preflight + credentials
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman / mobile
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options('*', cors()); // preflight for all routes

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/subjects', subjectsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/timetable', timetableRouter);
app.use('/api/reset', resetRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
