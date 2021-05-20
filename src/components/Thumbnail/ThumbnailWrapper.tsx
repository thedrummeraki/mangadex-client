import { useTheme } from "@material-ui/core";
import { Link } from "components/Link";
import { PropsWithChildren } from "react";

interface Props {
  url?: string | null;
  follow?: boolean | null;
  onClick?: VoidFunction;
}

export function ThumbnailWrapper({
  children,
  url,
  follow,
  onClick,
}: PropsWithChildren<Props>) {
  const theme = useTheme();

  if (onClick) {
    return (
      <Link to="#" onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (url) {
    const finalUrl = follow ? getFollowUrl(url) : url;

    return (
      <Link to={finalUrl} style={{ color: theme.palette.text.primary }}>
        {children}
      </Link>
    );
  }

  return <>{children}</>;
}

function getFollowUrl(targetUrl: string) {
  const url = new URL(window.location.toString());
  url.pathname = targetUrl;
  url.searchParams.set(
    "from",
    encodeURIComponent(window.location.pathname + window.location.search)
  );

  return url.pathname + url.search;
}
