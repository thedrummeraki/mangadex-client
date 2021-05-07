import { makeStyles } from "@material-ui/core";
import { PropsWithChildren } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
}));

export default function Body({ children }: PropsWithChildren<{}>) {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}
