import { makeStyles } from "@material-ui/core";
import { sharedStyles } from "./sharedStyles";

const useThumbnailStyles = makeStyles((theme) => ({
  root: {
    width: 185,
    height: 265,
    marginBottom: theme.spacing(8),

    [theme.breakpoints.down(1040)]: {
      width: "100%",
      height: 180,
    },

    // [theme.breakpoints.up("xl")]: {
    //   width: 250,
    //   height: 358,
    // },
  },
  holder: {
    position: "relative",
    overflow: "hidden",
    height: 265,

    [theme.breakpoints.down(1040)]: {
      height: 210,
    },

    // [theme.breakpoints.up("xl")]: {
    //   height: 358,
    // },
  },
  overlay: {
    zIndex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",

    "&::after": {
      display: "block",
      width: "100%",
      height: "100%",
      position: "absolute",
      content: '""',
      background:
        "linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.7) 100%)",

      opacity: 0,
      transition: "opacity .7s ease-out",
    },
  },
  overlayLoaded: {
    "&::after": {
      opacity: 1,
    },
  },
  thumbnail: {
    cursor: "pointer",
  },
  thumbnailWrapper: {
    ...theme.custom.withPrettyBoxShadow,
    position: "absolute",
    top: 0,
  },
  extraInfo: {
    position: "absolute",
    top: theme.spacing(2),
    left: theme.spacing(2),
    zIndex: 0,
    transition: "all .7s ease-in-out;",

    "&:hover": {
      zIndex: 2,
    },
  },
  imageContainer: {
    height: 265,
    width: "100%",

    // [theme.breakpoints.up("xl")]: {
    //   height: 358,
    // },
  },
  image: {
    height: 265,
    width: 185,
    objectFit: "cover",
    transition: "all .7s ease-in-out;",

    "&:hover": {
      transform: "scale(1.03)",
      // filter: "blur(1px)",
      opacity: 0.6,
    },
    //"@keyframes fadeIn": {
    //  ...animate(),
    //},

    // [theme.breakpoints.up("xl")]: {
    //   width: 250,
    //   height: 358,
    // },
  },
  explicitImage: {
    filter: "blur(4px)",
  },
  imageNoHover: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    opacity: 0,
    transition: "opacity .7s ease-out",
  },
  loaded: {
    opacity: 1,
  },
  showShowPropContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 20,
  },
  showShowProp: {
    padding: theme.spacing(0.5),
    fontSize: theme.spacing(1.5),
    "&:nth-child(odd)": {
      background: theme.palette.info.dark,
    },
    "&:nth-child(even)": {
      background: theme.palette.info.light,
    },
  },
  explicitFeature: {
    background: `${theme.palette.error.light} !important`,
  },
  bottomIconsContainer: {
    position: "absolute",
    bottom: 0,
    left: 10,
    zIndex: 20,

    "& > *": {
      marginRight: theme.spacing(),
      marginBottom: theme.spacing(0.75),
      color: "white",
    },
  },
  wrapper: {
    color: theme.palette.text.primary,
    borderRadius: theme.spacing(0.5),
  },
  ...sharedStyles(theme),
}));

export default useThumbnailStyles;
