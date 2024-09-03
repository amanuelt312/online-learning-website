import React, { useEffect, useState } from "react";

import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Icon,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  useParams,
  useNavigate,
  Outlet,
  Link,
  useLocation,
} from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

import { getUserIdFromLocalStorage } from "../firebase/AuthContext";

export const Course = () => {
  const drawerWidth = 300;
  const { courseName } = useParams();
  // console.log(courseName);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [lesson, setLesson] = useState([]);
  const [selectedList, SetSelectedList] = useState(0);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [courseProgress, setCourseProgress] = useState();

  const url = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const navigate = useNavigate();
  const userId = getUserIdFromLocalStorage();
  // console.log(userId);

  const getLessons = async () => {
    try {
      console.log("getting lessons of ", courseName);

      fetch(`${url}/course/${courseName}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setLesson(data);
        })
        .catch((err) => console.log("error fetching ", err));
      setNotFound(false);
      console.log("Docs are suc");
    } catch (err) {
      console.error("errror getting the lessons ", err);
      setNotFound(true);
      setError(error.message);
    }
  };

  useEffect(() => {
    getLessons();
  }, []);

  const handleListClick = (index) => {
    SetSelectedList(index);
    console.log(index);
    setMobileOpen(false);
  };

  const handlePreviousClick = () => {
    if (selectedList > 0) {
      SetSelectedList(selectedList - 1);
    }
  };

  const handleNextClick = () => {
    if (selectedList < lesson.length - 1) {
      SetSelectedList(selectedList + 1);
    }
  };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };
  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <Box sx={{ overflow: "auto" }}>
      {lesson.map(({ title }, index) => (
        <ListItemButton
          key={index}
          onClick={() => handleListClick(index)}
          sx={
            index === selectedList
              ? {
                  backgroundColor: "lightblue",
                  borderRadius: "13px",
                }
              : {}
          }
        >
          <ListItemText
            primary={title.charAt(0).toUpperCase() + title.slice(1)}
          />
        </ListItemButton>
      ))}
    </Box>
  );
  return (
    <>
      {notFound ? (
        <>
          <Typography sx={{ marginTop: 15 }} variant={"h5"} color="red">
            there was an error
          </Typography>
        </>
      ) : (
        <Box sx={{ display: "flex" }}>
          <Box
            component="nav"
            sx={{
              width: { sm: drawerWidth },
              flexShrink: { sm: 0 },
            }}
            aria-label="mailbox folders"
          >
            <Drawer
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                  marginTop: "60px",
                },
              }}
              ModalProps={{
                keepMounted: true,
              }}
              anchor="left"
              open={mobileOpen}
              onTransitionEnd={handleDrawerTransitionEnd}
              onClose={handleDrawerClose}
              variant="temporary"
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                  marginTop: "75px",
                  height: `calc(100% - 80px)`,
                  backgroundColor: "#f9fbfa",
                },
              }}
              open
            >
              {/* <h1>{courseName.toUpperCase()}</h1> */}
              {drawer}
            </Drawer>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              px: 1,
              marginTop: 7,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
          >
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Box position="sticky">
              <IconButton
                // edge="start"
                size="large"
                onClick={handleDrawerToggle}
                sx={{ display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
              <Button variant="contained" onClick={handlePreviousClick}>
                Previous
              </Button>

              <Button variant="contained" onClick={handleNextClick}>
                Next
              </Button>
            </Stack>
            {lesson.length > 0 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  {lesson[selectedList].title}
                </Typography>
                <div
                  dangerouslySetInnerHTML={{
                    __html: lesson[selectedList].content,
                  }}
                ></div>
              </Box>
            )}
            <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
              <Button variant="contained" onClick={handlePreviousClick}>
                Previous
              </Button>

              <Button variant="contained" onClick={handleNextClick}>
                Next
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
};
