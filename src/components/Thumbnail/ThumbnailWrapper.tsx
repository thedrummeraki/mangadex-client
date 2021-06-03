import { useTheme } from "@material-ui/core";
import { Link } from "components/Link";
import { PropsWithChildren } from "react";
import { getFollowUrl } from "utils";
import useThumbnailStyles from "./useThumbnailStyles";

interface Props {
  url?: string | null;
  follow?: boolean | null;
  title?: string | null;
  onClick?: VoidFunction;
}

export function ThumbnailWrapper({
  children,
  url,
  follow,
  title,
  onClick,
}: PropsWithChildren<Props>) {
  const theme = useTheme();
  const classes = useThumbnailStyles();

  if (onClick) {
    return (
      <Link
        title={title || undefined}
        to="#"
        onClick={onClick}
        className={classes.wrapper}
        underline="none"
      >
        {children}
      </Link>
    );
  }

  if (url) {
    const finalUrl = follow ? getFollowUrl(url) : url;

    return (
      <Link
        title={title || undefined}
        to={finalUrl}
        className={classes.wrapper}
        underline="none"
      >
        {children}
      </Link>
    );
  }

  return <>{children}</>;
}
