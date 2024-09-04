import React from "react";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/Navbar";

import {
  AuthProvider,
  getUserIdFromLocalStorage,
} from "./firebase/AuthContext";
import AddLesson from "./pages/AddLesson";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";

import { theme } from "./styles/theme";
import { AllCourses } from "./pages/AllCourses";
import { NewCourse } from "./pages/newCourse";
import TextEditor from "./pages/TextEditor";
import { Course } from "./pages/Course";
import { EditCourse } from "./pages/EditCourse";
import NotFound from "./pages/NotFound";
const ownerId = import.meta.env.VITE_REACT_APP_OWNER_ID;

const App = () => {
  const userId = getUserIdFromLocalStorage();
  console.log(userId);
  console.log(ownerId);
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            {/* <NavBar /> */}
            <Routes>
              {/* test */}
              <Route path="/" element={<NavBar />}>
                <Route index element={<Home />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/signUp" element={<SignUp />}></Route>
                <Route path="/allCourses" element={<AllCourses />}></Route>
                <Route path="/courses/:courseName" element={<Course />}></Route>

                <Route
                  path="/edit"
                  element={<AllCourses edit={true} />}
                ></Route>
                <Route
                  path="/editCourse/:courseId"
                  element={<EditCourse />}
                ></Route>

                <Route
                  path="/editCourse/:courseId/:lesson"
                  element={<AddLesson edit={true} />}
                ></Route>

                <Route path="/newCourse" element={<NewCourse />}></Route>
                <Route
                  path="/addLesson/:courseId"
                  element={<AddLesson />}
                ></Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
