import { PropsWithChildren } from "react";
import Body from "./Body";
import NavigationBar from "./NavigationBar";

export function WithLayoutProvider({ children }: PropsWithChildren<{}>) {
  return (
    <div>
      <NavigationBar />
      <Body>{children}</Body>
    </div>
  );
}
