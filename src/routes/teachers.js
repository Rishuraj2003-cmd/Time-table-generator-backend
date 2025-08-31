import { Router } from 'express';
import Teacher from '../models/Teacher.js';
const router = Router();

router.post('/', async (req, res) => {
  try {
    const { teachers } = req.body;
    if (!Array.isArray(teachers)) return res.status(400).json({ error: 'teachers must be array' });

    const ops = teachers.map(t => ({
      updateOne: {
        filter: { name: t.name },
        update: { $set: { name: t.name, maxLecturesPerWeek: Number(t.maxLectures) } }, // match frontend
        upsert: true
      }
    }));

    if (ops.length) await Teacher.bulkWrite(ops);
    res.json(await Teacher.find());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save teachers' });
  }
});

router.get('/', async (_req, res) => {
  res.json(await Teacher.find());
});

export default router;
