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
  if (onClick) {
    return (
      <Link to="#" onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (url) {
    return <Link to={url}>{children}</Link>;
  }

  return <>{children}</>;
}
