import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Chapter } from "types/chapter";

const AtHomeQuery = gql`
  query AtHome($chapterId: String!) {
    atHome(chapterId: $chapterId)
      @rest(type: "AtHome", path: "/at-home/server/{args.chapterId}") {
      baseUrl
    }
  }
`;

export function useAtHome(chapter: Chapter): string | null {
  const { data, loading, error } = useQuery(AtHomeQuery, {
    variables: { chapterId: chapter.id },
  });

  return (!loading && !error && data && data.atHome.baseUrl) || null;
}
