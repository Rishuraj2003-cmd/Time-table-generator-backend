import { Router } from 'express';
import Subject from '../models/Subject.js';
import Teacher from '../models/Teacher.js';
import Timetable from '../models/Timetable.js';

const router = Router();

router.delete('/', async (_req, res) => {
  await Promise.all([Subject.deleteMany({}), Teacher.deleteMany({}), Timetable.deleteMany({})]);
  res.json({ ok: true });
});

export default router;
