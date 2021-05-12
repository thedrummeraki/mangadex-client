import { useTheme } from "@material-ui/core";
import { Link } from "components/Link";
import { PropsWithChildren } from "react";

interface Props {
  url?: string | null;
  onClick?: VoidFunction;
}

export function ThumbnailWrapper({
  children,
  url,
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
    return (
      <Link to={url} style={{ color: theme.palette.text.primary }}>
        {children}
      </Link>
    );
  }

  return <>{children}</>;
}
