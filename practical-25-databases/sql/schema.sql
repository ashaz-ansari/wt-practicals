CREATE DATABASE IF NOT EXISTS college;
USE college;

DROP TABLE IF EXISTS students;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  course VARCHAR(100) NOT NULL,
  marks INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO students (name, course, marks) VALUES
('Aarav', 'Web Technology', 88),
('Meera', 'Web Technology', 92),
('Rohan', 'Web Technology', 76);

SELECT * FROM students;

SELECT name, marks FROM students WHERE marks >= 80 ORDER BY marks DESC;

UPDATE students SET marks = 95 WHERE name = 'Aarav';

SELECT * FROM students WHERE name = 'Aarav';

DELETE FROM students WHERE marks < 80;

SELECT * FROM students;
