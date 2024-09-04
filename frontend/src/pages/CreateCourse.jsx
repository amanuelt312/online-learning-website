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
import { Button, TextField, Typography } from "@mui/material";
import { getUserIdFromLocalStorage } from "../firebase/AuthContext";
import { AlertMessage } from "../components/AlertMessage";
import { LoadingButton } from "@mui/lab";
const url = import.meta.env.VITE_REACT_APP_BACKEND_URL;

const CreateCourse = () => {

  const { courseId } = useParams();
  const [content, setContent] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);
  const userId = getUserIdFromLocalStorage();

  const [status, setStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");

  const clearPage = () => {
    setLessonName("");
    setContent("");
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
        Start Creating Courses{" "}
        <span style={{ color: "#377dff" }}>{courseId.toUpperCase()}</span>
      </Typography>{" "}
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
      {/* 
      <div>
        <h2 className="text-xl font-bold flex justify-center mt-8">Preview</h2>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div> */}
    </div>
  );
};

export default CreateCourse;
