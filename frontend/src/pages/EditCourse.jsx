import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  ImageListItemBar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
const url = import.meta.env.VITE_REACT_APP_BACKEND_URL;
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { AlertMessage } from "../components/AlertMessage";
import NotFound from "./NotFound";
import { getUserIdFromLocalStorage } from "../firebase/AuthContext";

export const EditCourse = () => {
  const { courseId } = useParams();
  const ownerId = import.meta.env.VITE_REACT_APP_OWNER_ID;
  const userId = getUserIdFromLocalStorage();
  if (!userId && userId !== ownerId) {
    return <NotFound />;
  }

  const [lesson, setLesson] = useState([]);
  const [selectedList, SetSelectedList] = useState(0);
  const [open, setOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState("");
  const [status, setStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");

  const handleListClick = (index) => {
    SetSelectedList(index);
  };

  const getLessons = async () => {
    try {
      console.log("getting lessons of ", courseId);

      fetch(`${url}/course/${courseId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setLesson(data);
        })
        .catch((err) => console.log("error fetching ", err));

      console.log("Docs are suc");
    } catch (err) {
      console.error("errror getting the lessons ", err);
    }
  };

  useEffect(() => {
    getLessons();
  }, []);

  const handleDialogClose = () => {
    setOpen(false);
  };

  const deleteLesson = async () => {
    // console.log(lessonToDelete);
    try {
      const response = await fetch(
        `${url}/deleteLesson/${courseId}/${lessonToDelete}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.error("Lesson not found");
        } else {
          console.error("Error deleting lesson:", response.statusText);
        }
        return;
      }

      setStatusType("success");
      setStatusMessage(`Lesson Deleted successfully.`);
      setStatus(true);
      handleDialogClose();
      getLessons();
    } catch (error) {
      console.error(error);
      setStatusType("error");
      setStatusMessage(`Lesson not Deleted.`);
      setStatus(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setStatus(false);
  };
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          maxWidth: "600px",
          mt: 12,
          mx: "auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{ margin: "auto", alignSelf: "center", my: 3 }}
        >
          Editing{" "}
          <span style={{ color: "#377dff" }}>{courseId.toUpperCase()}</span>
        </Typography>
        <Link to={`/addLesson/${courseId}`}>
          <Button variant={"contained"} my={3}>
            Add New Lesson
          </Button>
        </Link>
        <List>
          {lesson &&
            lesson.map(({ title }, index) => (
              <>
                <ListItem
                  key={index}
                  onClick={() => handleListClick(index)}
                  secondaryAction={
                    <>
                      <Link
                        to={`/editCourse/${courseId}/${title}`}
                        style={{ textDecoration: "none" }}
                      >
                        <IconButton edge="end" aria-label="edit">
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          setLessonToDelete(title);
                          setOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={title.charAt(0).toUpperCase() + title.slice(1)}
                  />
                </ListItem>

                <Divider />
              </>
            ))}
        </List>
      </Box>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this lesson?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteLesson} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <AlertMessage
        open={status}
        handleClose={() => handleClose()}
        message={statusMessage}
        type={statusType}
      />
    </Container>
  );
};
