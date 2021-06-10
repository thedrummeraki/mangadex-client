import { Theme, createStyles } from "@material-ui/core/styles";

export const sharedStyles = (theme: Theme) =>
  createStyles({
    container: {
      height: "100%",
      width: "100%",

      // [theme.breakpoints.up("xl")]: {
      //   height: 358,
      // },
    },
    textContainer: {
      width: 185,

      // [theme.breakpoints.up("xl")]: {
      //   width: 250,
      // },
    },
    title: {
      marginTop: theme.spacing(1.5),
      color: theme.palette.text.secondary,
      fontWeight: "bold",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      "-webkit-line-clamp": 2,
      "-webkit-box-orient": "vertical",

      // [theme.breakpoints.up("xl")]: {
      //   width: 250,
      // },

      "&:hover": {
        color: "black",
      },
    },
  });
