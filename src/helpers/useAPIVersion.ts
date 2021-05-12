import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const query = gql`
  query GetAPIVersion {
    version @rest(type: "Version", path: "/version") {
      version
    }
  }
`;

export default function useAPIVersion() {
  const result = useQuery(query);
  const { data, error, loading } = result;

  if (!data || error || loading) {
    return { ...result, version: null };
  }

  return { ...result, version: data?.version?.version as string };
}
