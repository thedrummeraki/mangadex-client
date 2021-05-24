import { useQuery } from "@apollo/client";
import { Page } from "components";
import {
  DisplayCoverSize,
  getCoverUrl,
  isExplicit,
  preferredTitle,
  relationship,
} from "helpers/mangadex";
import useAggregate from "helpers/useAggregate";
import { useCallback, useMemo } from "react";
import { GenericResponse, Manga } from "types";
import { ChaptersList } from "./ChaptersList";
import { MangaDetails } from "./MangaDetails";
import GetCoversForManga from "./queries/GetCoversForManga";

interface Props {
  mangaInfo: GenericResponse<Manga>;
}

export function ViewManga({ mangaInfo }: Props) {
  // const history = useHistory();
  // const [firstChapterId, setFirstChapterId] = useState<string | null>(null);

  console.log("originalLanguage", mangaInfo.data.attributes.originalLanguage);

  const coversResult = useQuery(GetCoversForManga, {
    variables: { mangaIds: [mangaInfo.data.id], limit: 100 },
  });

  const { data: manga } = mangaInfo;
  const {
    attributes: { lastChapter, status, tags, title },
  } = manga;
  const lastChapterBadge =
    lastChapter && parseInt(lastChapter) > 0
      ? `Last chapter: ${lastChapter}`
      : null;

  const statusBadge = status || null;

  const pageTags = tags.map((tag) => ({
    content: tag.attributes.name.en,
  }));

  // const { latestChapterForManga } = useLocalCurrentlyReading({ manga });
  const { volumesCount } = useAggregate(mangaInfo.data);
  const volumes = useMemo(
    () => volumesCount.map((count) => count.volume),
    [volumesCount]
  );

  const mainCover = useMemo(() => {
    const covers = coversResult.data?.covers.results || [];
    if (covers.length > 0) {
      const mainCoverId = relationship(mangaInfo, "cover_art")?.id;
      const mainCover =
        mainCoverId && covers.find((cover) => cover.data.id === mainCoverId);
      if (mainCover) {
        const filename = mainCover.data.attributes.fileName;
        return getCoverUrl(manga, filename, DisplayCoverSize.Thumb512);
      }
    }
    return null;
  }, [coversResult.data, mangaInfo, manga]);

  const coverForVolume = useCallback((volume: string) => {}, []);

  // const primaryAction = (
  //   <Button
  //     size="small"
  //     color="secondary"
  //     variant="contained"
  //     onClick={() => {
  //       if (latestChapterForManga) {
  //         history.push(`/manga/read/${latestChapterForManga.chapterId}`);
  //       } else {
  //         history.push(`/manga/read/${firstChapterId}`);
  //       }
  //     }}
  //   >
  //     {latestChapterForManga ? "Continue" : "Read now"}
  //   </Button>
  // );

  return (
    <Page
      backUrl="/"
      title={preferredTitle(title)}
      badges={[
        isExplicit(manga) ? "EXPLICIT" : null,
        lastChapterBadge,
        statusBadge,
        manga.attributes.contentRating || null,
      ]}
      tags={pageTags}
      showcase={{
        imageUrl: mainCover,
        content: <MangaDetails manga={manga} />,
      }}
    >
      <ChaptersList
        volumes={volumes}
        onFirstChapterReady={() => {}}
        manga={manga}
        onVolumeChange={() => {}}
      />
    </Page>
  );
}
