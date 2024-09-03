import React from "react";
import { ThemeProvider } from "@emotion/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/Navbar";

import { AuthProvider } from "./firebase/AuthContext";
import CreateCourse from "./pages/CreateCourse";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";

import { theme } from "./styles/theme";
import { AllCourses } from "./pages/AllCourses";
import { NewCourse } from "./pages/newCourse";
import TextEditor from "./pages/TextEditor";
import { Course } from "./pages/Course";

const App = () => {
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
                <Route
                  path="/addLesson"
                  element={<AllCourses addLesson={true} />}
                ></Route>

                <Route path="/courses/:courseName" element={<Course />}></Route>
                <Route path="/newCourse" element={<NewCourse />}></Route>
                <Route
                  path="/create/:courseId"
                  element={<CreateCourse />}
                ></Route>

                <Route
                  path="/generateCourse"
                  element={<CreateCourse />}
                ></Route>
                <Route path="/test" element={<TextEditor />}></Route>
              </Route>
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
