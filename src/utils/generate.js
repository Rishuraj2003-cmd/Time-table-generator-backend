// src/utils/generate.js
import Subject from '../models/Subject.js';
import Teacher from '../models/Teacher.js';
import Settings from '../models/Settings.js';
import mongoose from 'mongoose';

export async function generateTimetable() {
  const settings = await Settings.findOne() || new Settings();
  const days = settings.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const P = settings.periodsPerDay || 6;

  const subjects = await Subject.find().populate('teacher');
  const teachers = await Teacher.find();

  if (!subjects.length) throw new Error('No subjects configured');
  if (!teachers.length) throw new Error('No teachers configured');

  const totalSlots = days.length * P;
  const requiredLectures = subjects.reduce((sum, s) => sum + s.totalLectures, 0);

  if (requiredLectures > totalSlots) {
    throw new Error(`Not enough slots: need ${requiredLectures}, have ${totalSlots}`);
  }

  // Track teacher load (initialize to 0)
  const teacherLoad = Object.fromEntries(teachers.map(t => [t._id.toString(), 0]));

  // Create empty grid
  const grid = Array.from({ length: P }, () =>
    Array.from({ length: days.length }, () => ({ day: null, period: null, subject: null, teacher: null }))
  );
  for (let d = 0; d < days.length; d++) {
    for (let p = 0; p < P; p++) {
      grid[p][d].day = days[d];
      grid[p][d].period = p + 1;
    }
  }

  // Build lecture tasks
  const tasks = [];
  for (const s of subjects) {
    for (let i = 0; i < s.totalLectures; i++) {
      tasks.push({ subject: s, teacher: s.teacher });
    }
  }

  // Shuffle helper
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  shuffle(tasks);

  // Check if a task can be placed at (p,d)
  const isValidPlace = (task, p, d) => {
    // Avoid consecutive same subject in the same day
    if (p > 0 && grid[p - 1][d].subject?.toString() === task.subject._id.toString()) return false;
    if (p < P - 1 && grid[p + 1][d].subject?.toString() === task.subject._id.toString()) return false;

    // Slot must be empty
    if (grid[p][d].subject) return false;

    return true;
  };

  // Free slots
  const freeSlots = [];
  for (let d = 0; d < days.length; d++) for (let p = 0; p < P; p++) freeSlots.push([p, d]);
  shuffle(freeSlots);

  const MAX_ATTEMPTS = 3000;
  let attempts = 0;

  const tryPlaceAll = () => {
    // Reset grid and teacherLoad
    for (let d = 0; d < days.length; d++)
      for (let p = 0; p < P; p++) grid[p][d].subject = grid[p][d].teacher = null;
    Object.keys(teacherLoad).forEach(k => teacherLoad[k] = 0);

    const slots = freeSlots.slice();

    for (const task of tasks) {
      let placed = false;
      // Sort teachers by current load to balance assignments
      const teacherId = task.teacher._id.toString();

      shuffle(slots);
      for (const [p, d] of slots) {
        if (isValidPlace(task, p, d)) {
          grid[p][d].subject = task.subject._id;
          grid[p][d].teacher = task.teacher._id;
          teacherLoad[teacherId]++;
          slots.splice(slots.findIndex(s => s[0] === p && s[1] === d), 1);
          placed = true;
          break;
        }
      }
      if (!placed) return false;
    }

    return true;
  };

  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    if (tryPlaceAll()) break;
    shuffle(tasks);
  }

  return { grid, days, periodsPerDay: P };
}
