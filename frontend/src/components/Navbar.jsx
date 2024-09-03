import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  clearUserIdLocalStorage,
  getUserIdFromLocalStorage,
  getUserRoleFromLocalStorage,
  useAuth,
} from "../firebase/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useEffect } from "react";
import { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import logo from "../assets/logo.jpg";
export const NavBar = () => {
  const userId = getUserIdFromLocalStorage();

  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    clearUserIdLocalStorage();
    logout();
    navigate("/login");
  };

  return (
    <>
      <Box sx={{ position: "sticky", zIndex: 1000 }}>
        <AppBar>
          <Toolbar sx={{ backgroundColor: "#24292e", color: "white" }}>
            <Link to={"/"}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <img src={logo} style={{ width: "45px", height: "45px" }} />
              </IconButton>
            </Link>
            <Box
              gap={2}
              sx={{ flexGrow: 1, justifyContent: "center", display: "flex" }}
            >
              <Link to={"/"}>
                <Button style={{ color: "white" }}>Home</Button>
              </Link>
              <Link to={"/allCourses"}>
                <Button style={{ color: "white" }}>Courses</Button>
              </Link>
              <Link to={"/contact-us"}>
                <Button style={{ color: "white" }}>Contact Us</Button>
              </Link>
            </Box>
            {/* <IconButton sx={{ marginRight: 2 }}>
              <NotificationsIcon style={{ color: "white" }} />
            </IconButton> */}
            {isLoggedIn || userId ? (
              <Link to={"/LogIn"}>
                <Button
                  style={{ color: "black", backgroundColor: "white" }}
                  variant="contained"
                  onClick={handleSignOut}
                >
                  Logout
                </Button>
              </Link>
            ) : (
              <>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Link to={"/login"}>
                    <Button style={{ color: "white" }} variant="contained">
                      Log In
                    </Button>
                  </Link>
                </Box>
                <Link to={"/signUp"}>
                  <Button style={{ color: "white" }}>Sign Up</Button>
                </Link>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
};
