const express = require("express");
const bodyParser = require("body-parser"); //Möjiggör att man kan läsa in formdata

const app = express();
const port = 3000;

//Skapar ny databas
const sqlite3 = require("sqlite3").verbose(); //verbose ger fler felmeddelanden än utan - bra under utvecklingen
const db = new sqlite3.Database("./db/courses.db");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Routing. Hämtar alla poster från db.
app.get("/", (req, res) => {
  db.all("SELECT * FROM courses;", (err, rows) => {
    if (err) {
      console.log("Fel");
    }
    res.render("index", {
      rows: rows,
    });
  });
});

app.get("/addCourse", (req, res) => {
  res.render("addCourse", {
    errors: [],
  });
});

//Lägga till kurs
app.post("/addCourse", (req, res) => {
  let inputCode = req.body.coursecode;
  let inputName = req.body.name;
  let inputSyllabus = req.body.syllabus;
  let inputProgression = req.body.progression;
  //skapar en array som heter errors - om något av de olika fälten på sidan inte är ifyllda så pushas det felmeddelandet till arrayen och skrivs ut från index.ejs
  let errors = [];

  if (inputCode === "") {
    errors.push("Alla värden måste vara ifyllda, ange en kurskod.");
  }
  if (inputName === "") {
    errors.push("Alla värden måste vara ifyllda, ange ett kursnamn.");
  }
  if (inputSyllabus === "") {
    errors.push(
      "Alla värden måste vara ifyllda. Ange en länk till kursens kursplan."
    );
  }
  if (inputProgression === "") {
    errors.push("Alla värden måste vara ifyllda. Ange kursens progression.");
  }
  //Om det inte finns någon error så läggs värdena från gränssnittet till i databasen med SQLkommandot INSERT
  if (errors.length === 0) {
    console.log(inputCode, inputName, inputProgression, inputSyllabus);
    let stmt = db.prepare(
      "INSERT INTO courses(course_code, name, syllabus, progression)VALUES(?, ?, ?, ?);"
    );
    stmt.run(inputCode, inputName, inputSyllabus, inputProgression);
    stmt.finalize();

    //redirect till index där kurserna listas om det inte finns några error
    res.redirect("/");
  } else {
    res.render("addCourse", {
      errors: errors,
    });
  }
});

app.get("/about", (req, res) => {
  res.render("about", { error: "" });
});
//radera utifrån id vid klick på länken till resp kurs i ejs-filen
app.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  db.run("DELETE FROM courses WHERE id=?;", id, (err) => {
    if (err) {
      console.log("error");
    }

    res.redirect("/");
  });
});

//startar applikation
app.listen(port, () => {
  console.log("server started on port: " + port);
});
