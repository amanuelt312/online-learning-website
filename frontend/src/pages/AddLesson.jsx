import { useCallback, useMemo, useRef } from "react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref as sRef,
  StorageError,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase/firebase";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { getUserIdFromLocalStorage } from "../firebase/AuthContext";
import { AlertMessage } from "../components/AlertMessage";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect } from "react";
const url = import.meta.env.VITE_REACT_APP_BACKEND_URL;

const AddLesson = ({ edit = false }) => {
  const ownerId = import.meta.env.VITE_REACT_APP_OWNER_ID;
  const userId = getUserIdFromLocalStorage();
  if (!userId && userId !== ownerId) {
    return <NotFound />;
  }
  const { courseId, lesson } = useParams();
  const [content, setContent] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentOptions, setCurrentOptions] = useState([""]);
  const [questionType, setQuestionType] = useState("text");

  const [status, setStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");

  useEffect(() => {
    if (edit) {
      setLessonName(lesson);
      const getLesson = () => {
        fetch(`${url}/course/${courseId}/${lesson}`)
          .then((result) => result.json())
          .then((data) => {
            console.log(data.lesson[0].content);
            setContent(data.lesson[0].content);
            setQuestions(data.lesson[0].quiz);
          });
      };

      getLesson();
    }
  }, [edit, courseId]);

  const clearPage = () => {
    setLessonName("");
    setQuestions([]);
    setContent("");
  };
  const handleAddQuestion = () => {
    if (currentQuestion && currentAnswer) {
      const newQuestion = {
        question: currentQuestion,
        answer: currentAnswer,
        type: questionType,
        ...(questionType === "multiple-choice" && { options: currentOptions }),
      };

      setQuestions([...questions, newQuestion]);
      setCurrentQuestion("");
      setCurrentAnswer("");
      setCurrentOptions([""]);
      setQuestionType("text");
    }
  };
  const handleOptionChange = (index, value) => {
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    setCurrentOptions(newOptions);
  };
  const handleAddOption = () => {
    setCurrentOptions([...currentOptions, ""]);
  };

  const handleDeleteOption = (index) => {
    const newOptions = currentOptions.filter(
      (_, optIndex) => optIndex !== index
    );
    setCurrentOptions(newOptions);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  function handleSubmit() {
    if (!lessonName) {
      setError("Enter lesson name");
    } else {
      setLoading(true);
      fetch(`${url}/addLesson/${courseId}/${userId}`, {
        method: `POST`,
        headers: { "Content-Type": `application/json` },
        body: JSON.stringify({
          content,
          lessonName: lessonName,
          quiz: questions,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          setStatusType("success");
          setStatusMessage(`Lesson Created successfully.`);
          setStatus(true);
          clearPage();
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setStatusType("error");
          setStatusMessage("Failed to save the lesson");
          setStatus(true);
          console.log("failed to save lesson", err);
        });
    }
  }
  const handleLessonName = (e) => {
    e.preventDefault();
    setLessonName(e.target.value);
  };
  const imageHandler = useCallback(() => {
    try {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const file = input.files[0];

        const storageRef = sRef(
          storage,
          `/courseImages/${courseId}/${lessonName}/${file.name}`
        );
        await uploadBytes(storageRef, file);

        const imageUrl = await getDownloadURL(storageRef);

        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();

        quill.insertEmbed(range.index, "image", imageUrl);
      };
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setStatus(false);
  };
  const videoHandler = useCallback(() => {
    try {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "video/*");
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        if (file) {
          const storageRef = sRef(
            storage,
            `/courseVideos/${courseId}/${lessonName}/${file.name}`
          );
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);

          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();

          quill.insertEmbed(range.index, "video", downloadURL);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
          video: videoHandler,
        },
      },

      clipboard: {
        matchVisual: true,
      },
    }),
    []
  );

  return (
    <div style={{ marginTop: "80px" }}>
      <Typography
        variant="h4"
        sx={{ margin: "auto", alignSelf: "center", my: 3 }}
      >
        Start Creating Lessons{" "}
        <span style={{ color: "#377dff" }}>{courseId.toUpperCase()}</span>
      </Typography>{" "}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            type="text"
            value={lessonName}
            label={"Lesson Name"}
            onChange={handleLessonName}
            sx={{ my: 3 }}
          ></TextField>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            formats={[
              "header",
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "list",
              "bullet",
              "indent",
              "link",
              "image",
              "video",
            ]}
            placeholder="Write something amazing..."
            modules={modules}
            onChange={setContent}
            value={content}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Add Quiz
            </Typography>
            <Paper sx={{ padding: 2, marginBottom: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Question"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Question Type</InputLabel>
                    <Select
                      value={questionType}
                      onChange={(e) => setQuestionType(e.target.value)}
                    >
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="multiple-choice">
                        Multiple Choice
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {questionType === "multiple-choice" && (
                  <Grid item xs={12}>
                    {currentOptions.map((option, index) => (
                      <Box key={index} display="flex" alignItems="center">
                        <TextField
                          fullWidth
                          variant="outlined"
                          label={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                        />
                        <IconButton
                          color="secondary"
                          onClick={() => handleDeleteOption(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleAddOption}
                      sx={{ marginTop: 1 }}
                    >
                      Add Option
                    </Button>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Answer"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddQuestion}
                    sx={{ marginRight: 2 }}
                  >
                    Add Question
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            <Typography variant="h5" gutterBottom>
              Questions Preview
            </Typography>
            {questions &&
              questions.map((question, index) => (
                <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={10}>
                      <Typography variant="h6">{`Q: ${question.question}`}</Typography>
                      {question.type === "multiple-choice" && (
                        <ul>
                          {question.options.map((option, optIndex) => (
                            <li key={optIndex}>{option}</li>
                          ))}
                        </ul>
                      )}
                      <Typography variant="body1">{`Answer: ${question.answer}`}</Typography>
                    </Grid>
                    <Grid item xs={2} display="flex" justifyContent="flex-end">
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeleteQuestion(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
          </Box>
        </Grid>
      </Grid>
      {error && <Typography color="error">{error}</Typography>}
      <LoadingButton
        loading={loading}
        onClick={handleSubmit}
        loadingIndicator="Saving...."
        variant={"contained"}
      >
        Submit
      </LoadingButton>
      <AlertMessage
        open={status}
        handleClose={() => handleClose()}
        message={statusMessage}
        type={statusType}
      />
    </div>
  );
};

export default AddLesson;
