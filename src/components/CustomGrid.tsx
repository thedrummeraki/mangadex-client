import { makeStyles } from "@material-ui/core";
import { PropsWithChildren } from "react";

const useStyles = makeStyles(() => ({
  root: {
    display: "grid",
    gap: "28px 30px",
    gridTemplateColumns: "repeat(auto-fill, 185px)",
    justifyContent: "space-between",
  },
}));

export default function CustomGrid({ children }: PropsWithChildren<{}>) {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}
