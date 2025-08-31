import { Router } from 'express';
import Settings from '../models/Settings.js';
const router = Router();

router.post('/', async (req, res) => {
  const { days, periodsPerDay } = req.body;
  const doc = await Settings.findOne() || new Settings();
  if (days?.length) doc.days = days;
  if (periodsPerDay) doc.periodsPerDay = periodsPerDay;
  await doc.save();
  res.json(doc);
});

router.get('/', async (_req, res) => {
  const s = await Settings.findOne() || new Settings();
  res.json(s);
});

export default router;
