import { Typography } from "@material-ui/core";
import { Page } from "components";
import { useAuth } from "config/providers";
import { PropsWithChildren } from "react";
import { Route, RouteProps } from "react-router";

export default function AuthenticatedRoute({
  children,
  ...args
}: PropsWithChildren<RouteProps>) {
  const { loggedIn } = useAuth();

  return (
    <Route
      {...args}
      render={() => {
        if (loggedIn) {
          return children;
        } else {
          return (
            <Page backUrl="/" title="You are not logged in!">
              <Typography>
                Sorry, you need to be logged in to see this page.
              </Typography>
            </Page>
          );
        }
      }}
    />
  );
}
