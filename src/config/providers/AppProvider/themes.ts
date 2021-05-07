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
    custom: {
      thumbnail: {
        borderRadius: "10px",
        height: 256,
        width: 185,
      },
    },
  });
