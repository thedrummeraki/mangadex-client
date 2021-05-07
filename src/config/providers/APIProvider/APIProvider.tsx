import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";

import client from "./client";

export function APIProvider({ children }: PropsWithChildren<{}>) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
