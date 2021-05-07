import { PropsWithChildren } from "react";
import { ThemeProvider } from "@material-ui/core";
import { lightTheme } from "./themes";

export function RootProvider({ children }: PropsWithChildren<{}>) {
  const theme = lightTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
