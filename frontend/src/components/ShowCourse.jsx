import {
  Alert,
  Box,
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
export const ShowCourse = ({ lesson }) => {
  const { title, content, quiz } = lesson;
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setUserAnswers({});
    setFeedback({});
    setShowFeedback(false);
  }, [lesson]);
  const handleAnswerChange = (questionIndex, value) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: value,
    });
  };
  const handleCheckAnswers = () => {
    const newFeedback = {};

    quiz.forEach((quiz, index) => {
      if (userAnswers[index] === quiz.answer) {
        newFeedback[index] = { correct: true };
      } else {
        newFeedback[index] = { correct: false, correctAnswer: quiz.answer };
      }
    });

    setFeedback(newFeedback);
    setShowFeedback(true);
  };

  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom style={{ color: "#377dff" }}>
          {title}
        </Typography>
        <div
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        ></div>
        {quiz && quiz.length > 0 ? (
          <>
            <Typography variant="h5">Quiz</Typography>
            <Grid container spacing={2}>
              {quiz.map((quiz, index) => (
                <Grid item xs={12} key={index}>
                  <Typography variant="h6">{`${index + 1}: ${
                    quiz.question
                  }`}</Typography>

                  {quiz.type === "multiple-choice" ? (
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        Choose the correct answer:
                      </FormLabel>
                      <RadioGroup
                        aria-label={`question-${index}`}
                        name={`question-${index}`}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                        value={userAnswers[index] || ""}
                      >
                        {quiz.options.map((option, optIndex) => (
                          <FormControlLabel
                            key={optIndex}
                            value={option}
                            control={<Radio />}
                            label={option}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Your Answer"
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      value={userAnswers[index] || ""}
                    />
                  )}
                  <Collapse in={showFeedback && feedback[index] !== undefined}>
                    {feedback[index]?.correct ? (
                      <Alert severity="success" style={{ marginTop: "10px" }}>
                        Correct!
                      </Alert>
                    ) : (
                      <Alert severity="error" style={{ marginTop: "10px" }}>
                        Incorrect. The correct answer is:{" "}
                        {feedback[index]?.correctAnswer}
                      </Alert>
                    )}
                  </Collapse>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckAnswers}
              style={{ marginTop: "20px" }}
            >
              Check Answers
            </Button>
          </>
        ) : null}
      </Box>
    </>
  );
};
