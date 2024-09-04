import React from "react";
import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: {
      fontWeight: "bold",
      textAlign: "center",

      // color: "#333",
    },
    body1: {
      fontSize: "1rem",
      color: "#555",
    },
    h3: {
      fontSize: "3rem",
      fontFamily: "Roboto",
      fontWeight: "bold",
      letterSpacing: 1,
      textTransform: "uppercase",
      color: "primary.main",
      textAlign: "center",
      my: 2,
    },
    h5: {
      fontFamily: "Roboto",
      fontWeight: "bold",
      letterSpacing: 1,
      color: "primary.main",
      textAlign: "center",
      my: 2,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          marginTop: "15px",
        },
        containedPrimary: {
          backgroundColor: "#24292e",
          "&:hover": {
            backgroundColor: "#373c40",
          },
        },
        containedSecondary: {
          backgroundColor: "#f50057",
          "&:hover": {
            backgroundColor: "#c51162",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#ffffff",
          },
        },
      },
    },
  },
});
