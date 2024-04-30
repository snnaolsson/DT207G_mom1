/**
 * Installationsfil för sqlite
 */

const sqlite3 = require("sqlite3").verbose(); //verbose ger fler felmeddelanden än utan - bra under utvecklingen
const db = new sqlite3.Database("./db/courses.db");
db.serialize(() => {
  db.run("DROP TABLE IF EXISTS courses;");
  db.run(`
CREATE TABLE courses(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT NOT NULL,
    name TEXT NOT NULL,
    syllabus TEXT NOT NULL,
    progression TEXT NOT NULL

);
`);
});

db.close();
