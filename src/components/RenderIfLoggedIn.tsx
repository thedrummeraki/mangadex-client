import { useAuth } from "config/providers";
import { PropsWithChildren } from "react";

interface Props {
  loggedIn?: boolean;
}

export function RenderIfLoggedIn({
  children,
  loggedIn = true,
}: PropsWithChildren<Props>) {
  const { loggedIn: isLoggedIn } = useAuth();

  if (isLoggedIn === loggedIn) {
    return <>{children}</>;
  }

  return null;
}
