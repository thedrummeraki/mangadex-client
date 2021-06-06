import { useGetChapterQuery } from "generated/graphql";
import { useChapter } from "helpers";
import { useParams } from "react-router";
import { ReadChapterPage } from "./ReadChapterPage";

export default function ReadChapterPageContainer() {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useGetChapterQuery({ variables: { id } });
  const chapter = data?.chapter;

  if (!chapter) {
    return null;
  }

  return <ReadChapterPage chapter={chapter} />;
}
