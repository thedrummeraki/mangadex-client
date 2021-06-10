import {
  useGetChapterQuery,
  useGetChapterReadingStatusesQueryLazyQuery,
} from "generated/graphql";
import { useEffect } from "react";
import { useParams } from "react-router";
import { ReadChapterPage } from "./ReadChapterPage";

export default function ReadChapterPageContainer() {
  const { id } = useParams<{ id: string }>();

  const { data } = useGetChapterQuery({
    variables: { id, dataSaver: false },
    fetchPolicy: "no-cache",
  });
  const [getCurrentChapterReadingStatus, { data: chaptersReadingStatusData }] =
    useGetChapterReadingStatusesQueryLazyQuery();
  const chapter = data?.chapter;
  const status = chaptersReadingStatusData?.chaptersReadingStatus;

  useEffect(() => {
    if (chapter) {
      getCurrentChapterReadingStatus({ variables: { ids: [chapter.id] } });
    }
  }, [getCurrentChapterReadingStatus, chapter]);

  if (!chapter || !status?.length) {
    return null;
  }

  return <ReadChapterPage chapter={chapter} initialPage={status[0].page} />;
}
