import { useGetChapterQuery } from "generated/graphql";
import { useParams } from "react-router";
import { ReadChapterPage } from "./ReadChapterPage";

export default function ReadChapterPageContainer() {
  const { id } = useParams<{ id: string }>();

  const { data } = useGetChapterQuery({
    variables: { id, dataSaver: false },
  });
  const chapter = data?.chapter;

  if (!chapter) {
    return null;
  }

  return <ReadChapterPage chapter={chapter} />;
}
