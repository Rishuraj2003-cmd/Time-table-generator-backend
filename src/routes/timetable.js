import { Router } from 'express';
import Timetable from '../models/Timetable.js';
import { generateTimetable } from '../utils/generate.js';

const router = Router();

// POST /generate - create a new timetable
router.post('/generate', async (_req, res) => {
  try {
    const { grid, days, periodsPerDay } = await generateTimetable();

    const doc = new Timetable({
      grid,
      meta: { days, periodsPerDay, generatedAt: new Date() },
    });

    await doc.save(); // Save new timetable without touching old ones

    // Populate subject & teacher for frontend
    const saved = await Timetable.findById(doc._id).populate({
      path: 'grid.subject grid.teacher',
    });

    res.json(formatTimetable(saved));
  } catch (e) {
    console.error(e);

    // Friendly message for missing subjects/teachers
    if (e.message.includes('No subjects') || e.message.includes('No teachers')) {
      return res.status(400).json({ error: 'Please configure subjects and teachers first.' });
    }

    res.status(400).json({ error: e.message || 'Failed to generate timetable' });
  }
});

// GET / - get all timetables, newest first
router.get('/', async (_req, res) => {
  try {
    const tts = await Timetable.find()
      .sort({ 'meta.generatedAt': -1 })
      .populate({ path: 'grid.subject grid.teacher' });

    if (!tts.length) return res.json([]);

    const out = tts.map(tt => ({
      _id: tt._id.toString(),
      meta: tt.meta,
      grid: tt.grid.map(row =>
        row.map(cell => ({
          day: cell.day,
          period: cell.period,
          subject: cell.subject?.name || '',
          teacher: cell.teacher?.name || '',
        }))
      ),
    }));

    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch timetables' });
  }
});

// DELETE /:id - delete a specific timetable by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Timetable.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Timetable not found' });
    res.json({ message: 'Timetable deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete timetable' });
  }
});

// Helper: convert DB timetable to client-friendly object
function formatTimetable(tt) {
  const { grid, meta } = tt;
  return {
    meta,
    grid: grid.map(row =>
      row.map(cell => ({
        day: cell.day,
        period: cell.period,
        subject: cell.subject?.name || '',
        teacher: cell.teacher?.name || '',
      }))
    ),
  };
}

export default router;
