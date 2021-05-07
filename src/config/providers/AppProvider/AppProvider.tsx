import { PropsWithChildren } from "react";
import { ThemeProvider } from "@material-ui/core";
import { darkTheme } from "./themes";

export function AppProvider({ children }: PropsWithChildren<{}>) {
  return <ThemeProvider theme={darkTheme()}>{children}</ThemeProvider>;
}
