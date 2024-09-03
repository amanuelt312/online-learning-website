const express = require("express");
const { connectToDb, getDb } = require("./db");
const app = express();

const cors = require("cors");
app.use(cors());
app.use(express.json());
let db;

const port = 3001;

connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log("app is listening on ", port);
    });
  }
  db = getDb();
});

app.post(`/newCourse`, (req, res) => {
  const data = req.body;
  console.log(data);
  db.collection("coursesInfo")
    .insertOne(data)
    .then(
      db
        .collection("courses")
        .insertOne({ courseId: data.courseId })
        .then((result) => {
          res.status(200).send(result);
        })
    )
    .catch((err) =>
      res.status(500).send({ error: "Error on creaing course", err })
    );
});

app.get(`/courseInfo`, (req, res) => {
  console.log("getting courses");
  db.collection("coursesInfo")
    .find()
    .sort({ rank: -1 })
    .toArray()
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: "error on getting course info" });
    });
});

app.post(`/addLesson/:courseName/:owner`, async (req, res) => {
  const { courseName, owner } = req.params;
  const { content, lessonName } = req.body;
  console.log("updating ", courseName);
  if (!content || !lessonName) {
    return res
      .status(400)
      .json({ error: "Content and lessonName are required" });
  }

  try {
    const courseInfo = await db
      .collection("coursesInfo")
      .findOne({ courseId: courseName, ownerId: owner });

    if (!courseInfo) {
      await db.collection("coursesInfo").insertOne({
        courseId: courseName,
        ownerId: owner,
        length: 0,
        title: courseName,
      });
    }

    // Update the course with the new lesson in the courses collection
    const result = await db.collection("courses").updateOne(
      { ownerId: owner, courseId: courseName },
      {
        $push: {
          lesson: { content: content, title: lessonName },
        },
      },
      { upsert: true }
    );
    await db
      .collection("coursesInfo")
      .updateOne(
        { title: courseName, ownerId: owner },
        { $inc: { length: 1 } }
      );

    res.status(200).json(result);
    console.log("lesson", result);
  } catch (err) {
    console.log("error creating lesson", err);
    res.status(500).json({ error: "Error updating or creating course", err });
  }
});

app.get("/course/:courseName", (req, res) => {
  let lessons = [];
  const courseName = req.params.courseName;

  console.log("getting ", courseName);
  db.collection("courses")
    .find({ courseId: courseName }, { projection: { lesson: 1, _id: 0 } })
    .forEach((element) => {
      element.lesson.forEach((lesson) => {
        lessons.push({ title: lesson.title, content: lesson.content });
      });
    })
    .then(() => {
      console.log("done");
      res.send(lessons);
    })
    .catch((err) => {
      res.status(500).json({ error: "could't fetch the document", err });
    });
});
