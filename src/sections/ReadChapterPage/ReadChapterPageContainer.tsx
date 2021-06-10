import {
  useGetChapterQuery,
  useGetChapterReadingStatusesQueryLazyQuery,
  useGetMangaLazyQuery,
} from "generated/graphql";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { ReadChapterPage } from "./ReadChapterPage";

export default function ReadChapterPageContainer() {
  const { id } = useParams<{ id: string }>();
  const {
    data,
    loading: chapterLoading,
    refetch,
  } = useGetChapterQuery({
    variables: { id, dataSaver: false },
    fetchPolicy: "no-cache",
  });
  const [
    getCurrentChapterReadingStatus,
    { data: chaptersReadingStatusData, loading: statusLoading },
  ] = useGetChapterReadingStatusesQueryLazyQuery();

  const [getManga, { data: mangaData }] = useGetMangaLazyQuery();

  const chapter = data?.chapter;
  const manga = mangaData?.manga;
  const status = chaptersReadingStatusData?.chaptersReadingStatus;

  const [page, setPage] = useState(1);
  const pageInitialized = useRef(false);

  useEffect(() => {
    if (chapter) {
      getCurrentChapterReadingStatus({ variables: { ids: [chapter.id] } });
      getManga({
        variables: {
          id: chapter.mangaId,
          translatedLanguage: chapter.attributes.translatedLanguage,
          chaptersForVolume: chapter.attributes.volume,
          chapterLimit: 100,
        },
      });
    }
  }, [getCurrentChapterReadingStatus, getManga, chapter]);

  useEffect(() => {
    if (!status?.length || pageInitialized.current) {
      return;
    }

    setPage(status[0].page);
    pageInitialized.current = true;
  }, [status]);

  return (
    <ReadChapterPage
      loading={chapterLoading || statusLoading}
      chapter={chapter}
      manga={manga}
      page={page}
      onPageChange={setPage}
      onChapterChange={(chapterId) => {
        refetch({ id: chapterId });
        setPage(1);
      }}
    />
  );
}
