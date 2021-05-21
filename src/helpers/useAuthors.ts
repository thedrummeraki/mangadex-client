import { useQuery } from "@apollo/client";
import GetAuthorsQuery, { Variables } from "./queries/authors/GetAuthors";

export default function useAuthors(variables: Variables) {
  const result = useQuery(GetAuthorsQuery, {
    variables,
  });
  const authors = result.data?.authors?.results || [];

  return { ...result, authors };
}
