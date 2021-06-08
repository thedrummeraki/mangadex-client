import { createMuiTheme } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

declare module "@material-ui/core/styles/createMuiTheme" {
  interface CustomOptions {
    [key: string]: CSSProperties;
  }
  interface Theme {
    custom: CustomOptions;
  }
  interface ThemeOptions {
    custom?: CustomOptions;
  }
}

const globalThemeParams = {
  spacing: 8,
  typography: {
    h6: {
      fontWeight: 1,
    },
  },
  custom: {
    thumbnail: {
      borderRadius: "10px",
      height: 256,
      width: 185,
    },
    clampedTitle: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      "-webkit-line-clamp": 2,
      "-webkit-box-orient": "vertical",
    },
    noSelect: {
      "-webkit-touch-callout": "none",
      "-webkit-user-select": "none",
      "-khtml-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none",
    },
    withPrettyBoxShadow: {
      boxShadow: "0 14px 30px rgba(0, 0, 0,.15),0 4px 4px rgba(0, 0, 0, 0.05)",
    },
  },
};

export const darkTheme = () =>
  createMuiTheme({
    ...globalThemeParams,
    palette: {
      type: "dark",
      background: {
        default: "#262626",
        paper: "#131313",
      },
      primary: {
        main: "#f44336",
        light: "rgb(246, 104, 94)",
        dark: "rgb(170, 46, 37)",
        contrastText: "#fff",
      },
      secondary: {
        main: "#f50057",
        light: "rgb(247, 51, 120)",
        dark: "rgb(171, 0, 60)",
        contrastText: "#fff",
      },
      success: {
        main: "#4caf50",
        light: "#81c784",
        dark: "#388e3c",
        contrastText: "rgba(0, 0, 0, 0.87)",
      },
      warning: {
        main: "#ff9800",
        light: "#ffb74d",
        dark: "#f57c00",
        contrastText: "rgba(0, 0, 0, 0.87)",
      },
      error: {
        contrastText: "#fff",
        dark: "#d32f2f",
        light: "#e57373",
        main: "#f44336",
      },
    },
  });

export const lightTheme = () =>
  //(backgroundImage: string) =>
  createMuiTheme({
    ...globalThemeParams,
    palette: {
      type: "light",
      background: {
        default: "#fafafa",
        paper: "#fff",
      },
      primary: {
        main: "#f44336",
        light: "rgb(246, 104, 94)",
        dark: "rgb(170, 46, 37)",
        contrastText: "#fff",
      },
      secondary: {
        main: "#f50057",
        light: "rgb(247, 51, 120)",
        dark: "rgb(171, 0, 60)",
        contrastText: "#fff",
      },
      success: {
        main: "#4caf50",
        light: "#81c784",
        dark: "#388e3c",
        contrastText: "rgba(0, 0, 0, 0.87)",
      },
      warning: {
        main: "#ff9800",
        light: "#ffb74d",
        dark: "#f57c00",
        contrastText: "rgba(0, 0, 0, 0.87)",
      },
      error: {
        contrastText: "#fff",
        dark: "#d32f2f",
        light: "#e57373",
        main: "#f44336",
      },
    },
    // overrides: {
    //   MuiCssBaseline: {
    //     "@global": {
    //       "body::after": {
    //         opacity: 0.2,
    //         background: `url(${backgroundImage || ""}) no-repeat center`,
    //         backgroundAttachment: "fixed",
    //         backgroundSize: "cover",
    //         top: 0,
    //         left: 0,
    //         bottom: 0,
    //         right: 0,
    //         position: "absolute",
    //         zIndex: -1,
    //         content: '""',
    //       },
    //     },
    //   },
    // },
  });
