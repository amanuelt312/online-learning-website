import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { ReactTyped } from "react-typed";

import { WhyUs } from "../components/WhyUs";
import { Player } from "@lottiefiles/react-lottie-player";

import lootie from "../assets/animation.json";
import { getUserIdFromLocalStorage } from "../firebase/AuthContext";
import { AllCourses } from "./AllCourses";
const ownerId = import.meta.env.VITE_REACT_APP_OWNER_ID;

const Home = () => {
  console.log(getUserIdFromLocalStorage());
  const isMobile = useMediaQuery("(max-width:600px)");
  const userId = getUserIdFromLocalStorage();

  return (
    <>
      <Container
        sx={{ marginTop: 14, backgroundColor: "white", color: "black" }}
      >
        <Box
          component="section"
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: { md: 25, xs: 0 },
            alignItems: "center",
          }}
        >
          <Box
            component="section"
            sx={{
              padding: "20px",

              width: "80vw",

              // boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Grid container spacing={3}>
              <Grid
                // sx={{ display: { xs: "none", sm: "block" } }}
                item
                xs={12}
                sm={6}
              >
                <Box
                  sx={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    alignItems: "center",

                    justifyContent: "center",
                  }}
                >
                  <Player
                    src={lootie}
                    className="player"
                    loop
                    autoplay
                    style={{ height: "300px", width: "300px" }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Stack direction={"column"}>
                    <Typography
                      variant={"h1"}
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      Online learning
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ color: "#333", maxWidth: 400 }}
                    >
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Dolor a ex dicta eligendi fuga assumenda et iure,
                      cupiditate aperiam rem cum maxime facere quis quisquam
                      sit. Harum quod beatae ducimus!
                    </Typography>
                    <Stack direction={isMobile ? "column" : "row"}>
                      <Link to={"/allCourses"}>
                        <Button
                          variant="contained"
                          sx={{
                            width: isMobile ? "100%" : "140px",
                            margin: isMobile ? "10px 0" : "10px",
                          }}
                        >
                          Learn
                        </Button>
                      </Link>
                      {userId && userId == ownerId && (
                        <>
                          <Link to={"/newCourse"}>
                            <Button
                              variant="outlined"
                              sx={{
                                width: isMobile ? "100%" : "100px",
                                margin: isMobile ? "10px 0" : "10px",
                              }}
                            >
                              Create
                            </Button>
                          </Link>
                          <Link to={"/edit"}>
                            <Button
                              variant="outlined"
                              sx={{
                                width: isMobile ? "100%" : "100px",
                                margin: isMobile ? "10px 0" : "10px",
                              }}
                            >
                              Edit
                            </Button>
                          </Link>
                        </>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ mt: 7 }}>
                <Box>
                  <WhyUs />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          my: 5,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", my: 3 }}>
          Courses
        </Typography>

        <AllCourses />
      </Box>
    </>
  );
};

//TODO private pages
//TODO quiz
//TODO Progress, profile,
//Routers fro the backend
export default Home;
