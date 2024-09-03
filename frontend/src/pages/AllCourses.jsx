import {
  Box,
  Button,
  Container,
  Grid,
  Grid2,
  LinearProgress,
  Typography,
} from "@mui/material";
import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cards } from "../components/Cards";

const url = import.meta.env.VITE_REACT_APP_BACKEND_URL;

export const AllCourses = ({ addLesson = false }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(addLesson);
  useEffect(() => {
    const readCourses = async () => {
      try {
        setLoading(true);
        console.log(url);

        fetch(`${url}/courseInfo`)
          .then((respons) => respons.json())
          .then((data) => {
            setCourses(data);
            setLoading(false);

            console.log("All courese are readed");
          })
          .catch((err) => {
            setLoading(false);

            console.log("error on getting all courses ", err);
          });
      } catch (error) {
        setLoading(false);

        console.log("error geting all courese", error.message);
      }
    };
    readCourses();
  }, []);
  return (
    <Container
      sx={{
        mt: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {loading ? (
        <Box sx={{ width: "100%", my: 5 }}>
          <LinearProgress />
        </Box>
      ) : (
        <Box

        // sx={{
        //   paddingTop: "40px",
        // }}
        >
          {addLesson && <Typography variant="h3">Select Course</Typography>}
          <Grid2
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              my: 4,
            }}
            container
            rowSpacing={2}
            columnGap={2}
          >
            {courses &&
              courses.map((course) => (
                <Grid2 item xl={2} lg={2} md={3} sm={4} xs={5} key={course.id}>
                  <Link
                    to={
                      addLesson
                        ? `/create/${course.courseId}`
                        : `/courses/${course.courseId}`
                    }
                    style={{ textDecoration: "none" }}
                  >
                    <Cards
                      title={course.title}
                      imgLink={course.imageLink}
                      description={course.description}
                    />
                  </Link>
                </Grid2>
              ))}
          </Grid2>
        </Box>
      )}
    </Container>
  );
};
