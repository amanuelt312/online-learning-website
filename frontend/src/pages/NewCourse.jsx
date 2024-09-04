import {
  Box,
  Button,
  CardMedia,
  createChainedFunction,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref as sRef,
  uploadBytes,
} from "firebase/storage";
import CircularProgress from "@mui/material/CircularProgress";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { getUserIdFromLocalStorage } from "../firebase/AuthContext";
import { storage } from "../firebase/firebase";
import NotFound from "./NotFound";
const url = import.meta.env.VITE_REACT_APP_BACKEND_URL;
export const NewCourse = () => {
  const navigate = useNavigate();

  const ownerId = import.meta.env.VITE_REACT_APP_OWNER_ID;
  const userId = getUserIdFromLocalStorage();
  if (!userId && userId !== ownerId) {
    return <NotFound />;
  }
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [ai, setAi] = useState(true);
  const [image, setImage] = useState();
  const [selectedFileName, setSelectedFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [length, setLength] = useState();

  const [loading, setLoading] = useState(false);

  const createId = (text) => {
    return text
      .toLocaleLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setSelectedFileName(file.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setSelectedFileName("");
      setImagePreview(null);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    console.log(courseName, description, length);
    const courseId = createId(courseName);
    if (image) {
      const storageRef = sRef(storage, `/courseImages/${userId}/${courseId}`);
      try {
        console.log("uploading image....");
        await uploadBytes(storageRef, image);
        const imageLink = await getDownloadURL(storageRef);
        console.log("imagedone ", imageLink);
        fetch(`${url}/newCourse`, {
          method: "POST",
          headers: { "Content-Type": `application/json` },
          body: JSON.stringify({
            courseId,
            title: courseName,
            description,
            imageLink,
            length,
            ownerId: userId,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            navigate(`/addLesson/${courseId}`);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      } catch (err) {
        setLoading(false);
        console.log("error uploading  image ", err);
      }
    } else {
      setLoading(false);
      handleMessage("error", "No Profile Image Selected.");

      console.log("no no profile Image uploded");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Grid container spacing={3}>
        <Grid sx={{ display: { xs: "none", sm: "block" } }} item xs={12} sm={6}>
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: "100%",
              alignItems: "center",

              justifyContent: "center",
            }}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/smartpath-b7c1c.appspot.com/o/be-creative-2111029_1280-removebg.png?alt=media&token=73a7c25d-a866-4627-b268-0704be0f6d71"
              alt="hero"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h3" style={{ margin: "16px" }}>
              Create Course
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: "70%" }}>
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="picture-input"
                  onChange={handleImageChange}
                />
                {!selectedFileName && (
                  <label htmlFor="picture-input">
                    <Button
                      variant="contained"
                      component="span"
                      color="primary"
                    >
                      Select image
                    </Button>
                  </label>
                )}
              </Grid>
              {selectedFileName && (
                <Grid item xs={12}>
                  <Paper elevation={3} style={{ padding: "16px" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {selectedFileName}
                    </Typography>

                    <CardMedia
                      component="img"
                      alt="Profile Picture Preview"
                      sx={{
                        height: "200px",
                        width: "200px;",
                        borderRadius: "50%",
                      }}
                      image={imagePreview}
                    />

                    <label htmlFor="picture-input">
                      <Button
                        variant="contained"
                        component="span"
                        color="primary"
                      >
                        Choose Another
                      </Button>
                    </label>
                  </Paper>
                </Grid>
              )}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />

              <TextField
                required
                label="Descriptione"
                fullWidth
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField
                required
                label="Length"
                type={"number"}
                fullWidth
                margin="normal"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />

              <LoadingButton
                loading={loading}
                variant={"contained"}
                size={"large"}
                sx={{ width: "80px", alignSelf: "center" }}
                onClick={() => handleSubmit()}
              >
                Create
              </LoadingButton>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
