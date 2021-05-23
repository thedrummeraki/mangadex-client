import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PropsWithChildren } from "react";

interface Props {
  tight?: boolean;
}

const useStyles = makeStyles(() => ({
  root: {
    display: "grid",
    gap: "28px 30px",
    gridTemplateColumns: "repeat(auto-fill, 185px)",
    justifyContent: "space-between",
  },
  tight: {
    gap: "10px 0",
  },
}));

export default function CustomGrid({
  children,
  tight,
}: PropsWithChildren<Props>) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, tight && classes.tight)}>{children}</div>
  );
}
