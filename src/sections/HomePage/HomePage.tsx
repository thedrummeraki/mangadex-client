import { gql, useApolloClient } from "@apollo/client";

const query = gql`
  query Luke {
    manga @rest(type: "Person", path: "/manga") {
      name
    }
  }
`;

export function HomePage() {
  const client = useApolloClient();
  client
    .query({ query })
    .then((response) => console.log(response))
    .catch((error) => console.log(error));

  return <p>Welcome to the home page.</p>;
}
