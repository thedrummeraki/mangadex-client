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

export function useAtHomeBaseUrl(chapter: Chapter) {
  const result = useQuery(AtHomeQuery, {
    variables: { chapterId: chapter.id },
  });

  const { data, loading, error } = result;
  const atHomeBaseUrl =
    (!loading && !error && data && data.atHome.baseUrl) || null;

  return { ...result, atHomeBaseUrl };
}
