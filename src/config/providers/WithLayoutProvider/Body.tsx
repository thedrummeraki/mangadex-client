import { makeStyles } from "@material-ui/core";
import { PropsWithChildren } from "react";
import { useNavigationBarVisible } from "./WithLayoutProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(6),
  },
}));

export default function Body({ children }: PropsWithChildren<{}>) {
  const classes = useStyles();
  const { visible } = useNavigationBarVisible();

  return visible ? (
    <div className={classes.root}>{children}</div>
  ) : (
    <>{children}</>
  );
}
