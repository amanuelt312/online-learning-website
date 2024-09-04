import { useMemo } from "react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref as sRef,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../firebase/firebase";
import { useParams } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
const TextEditor = () => {
  const { courseId } = useParams();
  const [content, setContent] = useState("");
  const [lessonName, setLessonName] = useState("");
  function handleSubmit() {
    console.log(content);
  }
  const handleLessonName = (e) => {
    e.preventdefault();
    setLessonName(e.value);
    console.log(e);
  };
  const imageHandler = async () => {
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
      const quillEditor = quill.current.getEditor();

      const range = quillEditor.getSelection(true);
      quillEditor.insertEmbed(range.index, "image", imageUrl);
    };
  };

  const videoHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "video/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const videoId = uuid();
        const storageRef = sRef(
          storage,
          `/courseVideos/${courseId}/${lessonName}/${videoId}`
        );
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        const quill = quill.current.getEditor();

        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "video", downloadURL);
      }
    };
  };

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
      <Typography variant="h4" sx={{ margin: "auto", alignSelf: "center" }}>
        Start Creating Courses{" "}
        <span style={{ color: "#377dff" }}>{courseId.toUpperCase()}</span>
      </Typography>{" "}
      <TextField
        type="text"
        value={lessonName}
        label={"Lesson Name"}
        onChange={handleLessonName}
      ></TextField>
      <ReactQuill
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
      <Button onClick={handleSubmit} variant={"contained"}>
        Submit
      </Button>
      {/* 
      <div>
        <h2 className="text-xl font-bold flex justify-center mt-8">Preview</h2>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      </div> */}
    </div>
  );
};

export default TextEditor;
