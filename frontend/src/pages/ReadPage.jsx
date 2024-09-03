import React, { useEffect, useState } from "react";
import axios from "axios";
import Title from "../components/Title";
import STitle from "../components/STitle";
import Paragraph from "../components/Paragraph";
import CodeBlock from "../components/CodeBlock";
import Strong from "../components/Strong";
import Picture from "../components/Picture";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Para } from "../components/Para";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { RiAiGenerate, RiContactsBookLine } from "react-icons/ri";

// import url from "../components/url";

import { saveAs } from "file-saver";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const tagComponents = {
  Title: Title,
  STitle: STitle,
  Paragraph: Para,
  CodeBlock: CodeBlock,
  Strong: Strong,
  img: Picture,
};
const url = import.meta.env.VITE_REACT_APP_BACKEND_URL;

export const ReadPage = () => {
  const [tags, setTags] = useState([]);
  const [pTags, setPTags] = useState([]);

  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [relatedResourcesDone, setRelatedResourcesDone] = useState(false);
  const [summary, setSummary] = useState("");
  //getig the route name
  const [expanded, setExpanded] = useState(false);
  const [showPersonalized, setShowPersonalized] = useState(false);
  const [personalizeLoading, setPersonalizeLoading] = useState(false);

  const fileName = useParams().lessonId;
  const [formData, setFormData] = useState({
    subtopicsToInclude: "",
    DesiredLessonStyle: "",
    knowledgeLevel: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleExpand = () => {
    setExpanded(!expanded);
  };
  // console.log(useParams());
  // console.log(fileName);
  const courseName = useParams().courseName;
  const saveFile = () => {
    const jsonData = JSON.stringify(tags, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    saveAs(blob, `${fileName}.json`);
    console.log("Josn SAved");
  };
  const handlePersonalize = () => {
    // console.log(formData, tags);
    setPersonalizeLoading(true);
    setShowPersonalized(false);

    setExpanded(false);

    fetch(url + "/personalizeLesson", {
      method: "POST",
      headers: { "Content-Type": `application/json` },
      body: JSON.stringify({
        formData,
        tags,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(typeof data.response);
        console.log(data);
        setPTags(data.response);
        setExpanded(false);
        setPersonalizeLoading(false);
        setShowPersonalized(true);
      })
      .catch((err) => {
        console.log(err);
        setPersonalizeLoading(false);
      });
  };
  const fetchResources = async (tagss) => {
    setRelatedResourcesDone(false);
    setSummary("");
    fetch(url + "/summary", {
      method: "POST",
      headers: { "Content-Type": `application/json` },
      body: JSON.stringify({
        lesson: tagss,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.response);
        setSummary(data.response);
        setRelatedResourcesDone(true);
      })
      .catch((err) => {
        console.error(error);
      });
  };
  useEffect(() => {
    setPTags([]);
    setPersonalizeLoading(false);
    setShowPersonalized(false);
    setLoading(true);
    setTags([]);
    const fetchTags = async () => {
      try {
        console.log(fileName);

        fetch(`${url}/course/${courseName}/${fileName}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);

            // console.log(data[0].content);
            // console.log(typeof data);
            setTags(data[0].content);
            fetchResources(data[0].content);

            // setTags(data[0]);
            setNotFound(false);
            setLoading(false);
            window.scrollTo(0, 0);
          })
          .catch((err) => console.log("error getting lessons ", err));
      } catch (error) {
        console.log("error geting tags: ", error.message);
        setLoading(false);
      }
    };
    fetchTags();
  }, [fileName]);

  // useEffect(() => {
  //   if (tags.length > 1) {
  //   }
  // }, [tags]);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            flexGrow: 1,
            px: 1,
            marginTop: 7,
            width: { sm: `calc(100% - 300px)` },
          }}
        >
          {notFound ? (
            <h1>The Course is not finished </h1>
          ) : (
            <>
              {/* <h1>{fileName}</h1> */}
              {loading ? (
                <Skeleton
                  variant="rounded"
                  width={"100%"}
                  height={700}
                  sx={{ backgroundColor: "#55556b" }}
                />
              ) : null}
              {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

              {!loading && (
                <>
                  <Box
                    sx={{
                      width: { sm: "100%", md: "50%" },
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    <Accordion expanded={expanded} onChange={handleExpand} sm>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Customize the Course Contents</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="subtopicsToInclude"
                          label="What subtopics should the course cover"
                          value={formData.subtopicsToInclude}
                          onChange={handleChange}
                          margin="normal"
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="knowledgeLevel"
                          label="knowledge level"
                          value={formData.knowledgeLevel}
                          onChange={handleChange}
                          select
                          margin="normal"
                        >
                          <MenuItem value="beginner">Beginner</MenuItem>
                          <MenuItem value="intermediate">Intermediate</MenuItem>
                          <MenuItem value="advanced">Advanced</MenuItem>
                        </TextField>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="DesiredLessonStyle"
                          label="Desired lesson style?"
                          value={formData.DesiredLessonStyle}
                          onChange={handleChange}
                          margin="normal"
                        />
                        <Button
                          sx={{ marginLeft: "auto", marginRight: "auto" }}
                          startIcon={<RiAiGenerate />}
                          variant={"contained"}
                          onClick={() => handlePersonalize()}
                        >
                          Personalize
                        </Button>
                      </AccordionDetails>
                      <AccordionActions>
                        <Button onClick={handleExpand}>Cancel</Button>
                        <Button onClick={handleExpand}>Done</Button>
                      </AccordionActions>
                    </Accordion>
                  </Box>
                  {personalizeLoading && (
                    <>
                      <Box sx={{ width: "100%" }}>
                        <Typography>Personalizing the Lesson</Typography>
                        <LinearProgress />
                      </Box>
                    </>
                  )}
                  {!personalizeLoading && pTags && pTags.length > 1 && (
                    <>
                      <Typography>
                        Your Personalized lesson Has been Generated
                        <Button
                          variant="outlined"
                          sx={{ m: 2 }}
                          onClick={() => setShowPersonalized(!showPersonalized)}
                        >
                          Show {showPersonalized ? "Original" : "personalized"}{" "}
                          course
                        </Button>
                      </Typography>
                      {showPersonalized && (
                        <Box
                          sx={{
                            border: "2px solid #0000FF",
                            borderRadius: "4px",
                            boxShadow: "0 0 10px #0000FF",
                            padding: "2px",
                            transition: "box-shadow 0.3s ease-in-out",
                            "&:hover": {
                              boxShadow: "0 0 20px #0000FF",
                            },
                          }}
                        >
                          <Typography variant="h5" sx={{ textAlign: "center" }}>
                            Your Personalized Lesson Is Ready
                          </Typography>
                          {pTags.map((tag, index) => {
                            return tag.tag == "Paragraph" ? (
                              <Box key={index}>
                                <Para
                                  content={tag.content}
                                  amharic={tag.amharic}
                                >
                                  {tag.content}
                                </Para>
                              </Box>
                            ) : tag.tag == "CodeBlock" ? (
                              <CodeBlock language={tag.language}>
                                {tag.content}
                              </CodeBlock>
                            ) : (
                              <Box key={index} mb={2}>
                                {tagComponents[tag.tag] ? (
                                  React.createElement(
                                    tagComponents[tag.tag],
                                    null,
                                    tag.content
                                  )
                                ) : (
                                  <p>no tag</p>
                                )}
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                    </>
                  )}
                  {!showPersonalized && (
                    <>
                      {tags.map((tag, index) => {
                        return tag.tag == "Paragraph" ? (
                          <Box key={index}>
                            <Para content={tag.content} amharic={tag.amharic}>
                              {tag.content}
                            </Para>
                          </Box>
                        ) : tag.tag == "CodeBlock" ? (
                          <CodeBlock language={tag.language}>
                            {tag.content}
                          </CodeBlock>
                        ) : (
                          <Box key={index} mb={2}>
                            {tagComponents[tag.tag] ? (
                              React.createElement(
                                tagComponents[tag.tag],
                                null,
                                tag.content
                              )
                            ) : (
                              <p>no tag</p>
                            )}
                          </Box>
                        );
                      })}
                    </>
                  )}

                  {/* <Button onClick={() => saveFile()}>Json</Button> */}
                </>
              )}
            </>
          )}
        </Box>
        <Box
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            // mt: 15,
            width: "300px",
            // backgroundColor: "black",
          }}
        >
          <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>
            Lesson Summary
          </Typography>
          {relatedResourcesDone && summary ? (
            <Box sx={{ width: "100%", my: 5 }}>
              {/* <Typography>{summary}</Typography> */}
              <Para content={summary}>{summary}</Para>
            </Box>
          ) : (
            <Box sx={{ width: "100%", my: 5 }}>
              <Typography>Generating Summary...</Typography>
              <LinearProgress />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};
