import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import RecommendIcon from "@mui/icons-material/Recommend";
import SchoolIcon from "@mui/icons-material/School";
export const Cards = (props) => {
  const {
    title,
    imgLink,
    description,
    action = true,
    icon = false,
    progress,
    length,
  } = props;

  return (
    <Card
      sx={{
        height: "255px",
        position: "relative",
        width: "250px",
        overflow: "hidden",
      }}
    >
      <CardActionArea>
        {icon ? (
          <IconButton>
            <imgLink />
          </IconButton>
        ) : imgLink ? (
          <CardMedia
            component="img"
            height="100"
            width="60"
            sx={{ objectFit: "contain" }}
            src={imgLink}
            alt={title}
          />
        ) : (
          <CardMedia height="140" width="100" sx={{ objectFit: "contain" }}>
            <SchoolIcon
              sx={{ height: 70, width: 100, color: "gray", marginTop: 7 }}
            />
          </CardMedia>
        )}

        <CardContent
          sx={{
            // display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 2,
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
