import { useTheme } from "@material-ui/core";
import { Link } from "components/Link";
import { PropsWithChildren } from "react";
import { getFollowUrl } from "utils";

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

  if (onClick) {
    return (
      <Link title={title || undefined} to="#" onClick={onClick}>
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
        style={{ color: theme.palette.text.primary }}
      >
        {children}
      </Link>
    );
  }

  return <>{children}</>;
}
