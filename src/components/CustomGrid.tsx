import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { PropsWithChildren } from "react";

interface Props {
  tight?: boolean;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gap: "28px 30px",
    gridTemplateColumns: "repeat(auto-fill, 185px)",
    justifyContent: "space-between",

    [theme.breakpoints.down(1540)]: {
      gap: "25px 20px",
    },
    [theme.breakpoints.down(1065)]: {
      gap: "25px 14px",
    },
    [theme.breakpoints.down(1040)]: {
      padding: "0 20px",
      gridTemplateColumns: "repeat(auto-fill, minmax(125px, 1fr))",
      justifyContent: "center",
    },
    [theme.breakpoints.down(760)]: {
      padding: "0 20px",
      gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))",
      gap: "20px 25px",
      justifyContent: "center",
    },
    [theme.breakpoints.down(400)]: {
      padding: "0 10px",
      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      gap: "20px 12px",
      justifyContent: "center",
    },
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
