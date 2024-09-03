import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  keyframes,
  Typography,
} from "@mui/material";
import Slider from "react-slick";
import RecommendIcon from "@mui/icons-material/Recommend";
import TranslateIcon from "@mui/icons-material/Translate";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { RiRobot3Fill } from "react-icons/ri";
import TimelineIcon from "@mui/icons-material/Timeline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const settings = {
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  speed: 4500,
  autoplay: true,
  pauseOnHover: true,
  autoplaySpeed: 0,
  arrows: true,
  responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};
export const WhyUs = (props) => {
  const [service, setService] = useState([
    {
      id: 1,
      title: "AI-Powered Learning",
      description:
        "Experience seamless and intuitive learning with our AI-driven platform.",
      img: (
        <RiRobot3Fill
          style={{ height: "100px", width: "100px" }}
          sx={{ color: "blue" }}
        />
      ),
    },
    {
      id: 2,
      title: "Translate with ease",
      description:
        "Break language barriers - translate each lesson into Amharic for inclusive learning.",
      img: <TranslateIcon sx={{ height: 100, width: 100, color: "green" }} />,
    },
    {
      id: 3,
      title: "Detailed lesson breakdowns",
      description:
        "Encounter a complex concept? Dive deeper with detailed explanations for every lesson and Paragraph.",
      img: (
        <ManageSearchIcon sx={{ height: 100, width: 100, color: "purple" }} />
      ),
    },

    {
      id: 4,
      title: "Instant Q&A",
      description:
        "Questions? Click 'Ask' for immediate answers. Learning is a conversation!",
      img: <QuestionMarkIcon sx={{ height: 100, width: 100, color: "red" }} />,
    },
    {
      id: 5,
      title: "Progress Tracking",
      description:
        "Monitor your learning journey with detailed progress tracking.",
      img: <TimelineIcon sx={{ height: 100, width: 100, color: "orange" }} />,
    },
    {
      id: 6,
      title: "Personalized Learning Paths",
      description:
        "Follow personalized learning paths tailored to your goals and interests.",
      img: <AutoAwesomeIcon sx={{ height: 100, width: 100, color: "lime" }} />,
    },
  ]);

  return (
    <Box sx={{ my: 0 }}>
      <Typography variant="h4">The Future of Learning is Here</Typography>

      {/* <Grid
        container
        spacing={2}
        sx={{ display: "flex", alignContent: "center", alignItems: "center" }}
      > */}
      <Slider {...settings}>
        {service.map((items, index) => (
          <Box key={items.id} sx={{ my: 2 }}>
            <Card
              sx={{
                boxShadow: "",
                maxWidth: 300,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
                mx: 1,
                borderRadius: 2,
                // backgroundColor: "black",

                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                },
              }}
            >
              <IconButton
                sx={{
                  color: items.img.props.sx.color,
                }}
              >
                {items.img}
              </IconButton>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography
                  gutterBottom
                  variant="h6"
                  sx={{ fontWeight: "bold" }}
                >
                  {items.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  {items.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};
