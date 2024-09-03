import {
  Button,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useAsyncError, useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { auth } from "../firebase/firebase";
import LogIn from "./LogIn";
import {
  useAuth,
  getUserIdFromLocalStorage,
  setUserIdLocalStorage,
  setUserRoleLocalStorage,
} from "../firebase/AuthContext";
import { LoadingButton } from "@mui/lab";
import { validatePassword } from "../components/validatePassord";

// import { getUserIdFromLocalStorage } from "../firebase/AuthContext";

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async () => {
    setLoading(true);
    const { email, password } = formData;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorMessage = validatePassword(password);

    if (!regex.test(email)) {
      setError("Invalid email address");
      setLoading(false);

      return;
    } else if (errorMessage) {
      setError(errorMessage);
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("user Created ", userCredential.user.uid);
      setUserIdLocalStorage(userCredential.user.uid);

      await updateProfile(userCredential.user, {
        displayName: name,
      });
      navigate("/allCourses");
    } catch (err) {
      console.error("Error signing up with email:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 15,
        minHeight: "80vh",
        display: "flex",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <CssBaseline />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AccountCircleIcon color="primary" style={{ fontSize: "48px" }} />
        <Typography variant="h5" style={{ margin: "16px" }}>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <LoadingButton
            onClick={handleSubmit}
            loading={loading}
            variant="contained"
            style={{ margin: "auto", display: "block" }}
          >
            Sign in
          </LoadingButton>
          {error ? (
            <Typography style={{ color: "red" }}>{error}</Typography>
          ) : null}
        </form>
        <Grid container justifyContent="center">
          <Grid item>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link to={"/login"}>
                <Button variant="text" color="primary">
                  Log In
                </Button>
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default SignUp;
