import MaterialSkeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";
import { sharedStyles } from "./sharedStyles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  ...sharedStyles(theme),
  root: {
    borderRadius: 5,
    overflow: "hidden",
  },
  error: {
    background: "#262626", //theme.palette.background.default,
  },
  skeleton: {
    height: 265,
    width: 185,

    // [theme.breakpoints.up("xl")]: {
    //   height: 358,
    //   width: 250,
    // },
  },
}));

interface Props {
  title?: string | null;
  error?: boolean | null;
  staticAnimation?: boolean | null;
  hideTitle?: boolean | null;
}

export function ThumbnailSkeleton({
  title,
  error,
  staticAnimation,
  hideTitle,
}: Props) {
  const classes = useStyles();
  const titleMarkup = title ? (
    <small className={classes.title}>{title}</small>
  ) : (
    <MaterialSkeleton
      className={clsx(classes.title)}
      variant="text"
      animation={!staticAnimation && "pulse"}
    />
  );

  const animation = error ? false : !staticAnimation && "pulse";

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <MaterialSkeleton
          variant="rect"
          animation={animation}
          className={clsx(error ? classes.error : "", classes.skeleton)}
          style={{ borderRadius: 5 }}
        />
      </div>
      {!hideTitle && titleMarkup}
    </div>
  );
}
