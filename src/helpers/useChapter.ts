import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { GenericResponse } from "types";
import { Chapter } from "types/chapter";
import { notEmpty } from "utils";

const GetChapterQuery = gql`
  query GetChapter($id: String!) {
    chapter(id: $id) @rest(type: "Chapter", path: "/chapter/{args.id}") {
      result
      relationships
      data {
        id
        type
        attributes {
          title
          volume
          chapter
          translatedLanguage
          hash
          data
          dataSaver
          uploader
          version
          createdAt
          updatedAt
          publishAt
        }
      }
    }
  }
`;

export default function useChapter(id: string) {
  const result = useQuery(GetChapterQuery, {
    variables: { id },
    context: { headers: { "X-Allow-Cache": "true" } },
  });

  const response = result.data?.chapter as GenericResponse<Chapter>;

  const chapter: Chapter | null =
    response && response.result === "ok" ? response.data : null;

  const relationships =
    response && response.result === "ok"
      ? response.relationships.filter(notEmpty)
      : [];

  return { ...result, chapter, relationships };
}
