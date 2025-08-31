// Optional: quick seed to test locally
import './src/db.js';
import Teacher from './src/models/Teacher.js';
import Subject from './src/models/Subject.js';
import Settings from './src/models/Settings.js';

async function run() {
  await Teacher.deleteMany({});
  await Subject.deleteMany({});
  await Settings.deleteMany({});

  const teachers = await Teacher.insertMany([
    { name: 'Mr. A', maxLecturesPerWeek: 8 },
    { name: 'Ms. B', maxLecturesPerWeek: 8 },
    { name: 'Mr. C', maxLecturesPerWeek: 8 }
  ]);

  await Subject.insertMany([
    { name: 'Math', totalLectures: 5, teacher: teachers[0]._id },
    { name: 'Physics', totalLectures: 4, teacher: teachers[1]._id },
    { name: 'Chemistry', totalLectures: 4, teacher: teachers[2]._id }
  ]);

  await new Settings({ days: ['Mon','Tue','Wed','Thu','Fri','sat'], periodsPerDay: 6 }).save();
  console.log('Seeded.');
  process.exit(0);
}
run();
