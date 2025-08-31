import { Router } from 'express';
import Subject from '../models/Subject.js';
import Teacher from '../models/Teacher.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { subjects } = req.body;
    if (!Array.isArray(subjects)) return res.status(400).json({ error: 'subjects must be array' });

    const ops = [];
    for (const s of subjects) {
      if (!s.name || s.lectures == null || !s.teacher) {
        return res.status(400).json({ error: 'Each subject needs name, lectures, teacher' });
      }
      const teacher = await Teacher.findOne({ name: s.teacher });
      if (!teacher) return res.status(400).json({ error: `Teacher ${s.teacher} not found` });

      ops.push({
        updateOne: {
          filter: { name: s.name },
          update: { $set: { name: s.name, totalLectures: Number(s.lectures), teacher: teacher._id } },
          upsert: true
        }
      });
    }

    if (ops.length) await Subject.bulkWrite(ops);
    const all = await Subject.find().populate('teacher');
    res.json(all);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save subjects' });
  }
});

router.get('/', async (_req, res) => {
  const subs = await Subject.find().populate('teacher');
  res.json(subs);
});

export default router;
