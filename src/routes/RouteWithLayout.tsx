import { WithLayoutProvider } from "config/providers";
import { PropsWithChildren } from "react";
import { Route, RouteProps } from "react-router";

export default function RouteWithLayout({
  children,
  ...args
}: PropsWithChildren<RouteProps>) {
  return (
    <Route
      {...args}
      render={() => <WithLayoutProvider>{children}</WithLayoutProvider>}
    />
  );
}
