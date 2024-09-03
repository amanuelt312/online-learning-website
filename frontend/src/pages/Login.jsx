import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Grid,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { signInWithEmailAndPassword } from "firebase/auth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { auth } from "../firebase/firebase";
import { setUserIdLocalStorage } from "../firebase/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError();
      const { email, password } = formData;
      await signInWithEmailAndPassword(auth, email, password);
      const userId = auth.currentUser.uid;
      console.log("login successful");
      console.log(auth.currentUser);
      setUserIdLocalStorage(userId);
      navigate("/allCourses");
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 15 }}>
      <CssBaseline />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // marginTop: "64px",
        }}
      >
        <LockOutlinedIcon color="primary" style={{ fontSize: "48px" }} />
        <Typography variant="h5" style={{ margin: "16px" }}>
          Log In
        </Typography>
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
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            ),
          }}
        />

        <LoadingButton
          onClick={handleSubmit}
          loading={loading}
          style={{ margin: "auto", display: "block" }}
          loadingPosition="end"
          variant="contained"
        >
          <span>Login</span>
        </LoadingButton>

        <Grid container justifyContent="center">
          <Grid item>
            {error ? (
              <Typography style={{ color: "red" }}>{error}</Typography>
            ) : null}
            <Typography variant="body2">
              Don't have an account?{" "}
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/Signup")}
              >
                Sign Up
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};
export default Login;
