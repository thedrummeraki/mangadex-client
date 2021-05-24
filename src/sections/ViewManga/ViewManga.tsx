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
import { useMemo, useState } from "react";
import { Cover, GenericResponse, Manga } from "types";
import { ChaptersList } from "./ChaptersList";
import { MangaDetails } from "./MangaDetails";
import GetCoversForManga from "./queries/GetCoversForManga";

interface Props {
  mangaInfo: GenericResponse<Manga>;
}

export function ViewManga({ mangaInfo }: Props) {
  const coversResult = useQuery(GetCoversForManga, {
    variables: { mangaIds: [mangaInfo.data.id], limit: 100 },
  });
  const [currentVolume, setCurrentVolume] = useState<string | null>(null);

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

  const { volumesCount } = useAggregate(mangaInfo.data);
  const volumes = useMemo(
    () => volumesCount.map((count) => count.volume),
    [volumesCount]
  );

  const covers = useMemo(() => {
    const covers = Array.from(coversResult.data?.covers.results || []).sort(
      (a, b) => {
        const volA = parseInt(a.data.attributes.volume || "");
        const volB = parseInt(b.data.attributes.volume || "");
        if (volA < volB) {
          return -1;
        } else if (volA > volB) {
          return 1;
        }
        return 0;
      }
    );

    return covers;
  }, [coversResult]);

  const mainCover = useMemo(() => {
    if (covers.length > 0) {
      const mainCoverId = relationship(mangaInfo, "cover_art")?.id;
      const mainCover =
        mainCoverId && covers.find((cover) => cover.data.id === mainCoverId);
      // if (mainCover) {
      //   const filename = mainCover.data.attributes.fileName;
      //   return getCoverUrl(manga, filename, DisplayCoverSize.Thumb512);
      // }
      return mainCover || null;
    }
    return null;
  }, [covers, mangaInfo]);

  const coverForVolume = useMemo(() => {
    const requestedVolume = parseFloat(currentVolume || "0");
    console.log("Current volume", currentVolume, "aka", requestedVolume);
    if (covers.length > 0 || String(requestedVolume) === "NaN") {
      if (!currentVolume || currentVolume === "N/A") {
        return mainCover ? mainCover : null;
      }

      let foundCover: GenericResponse<Cover> | null = null;
      let foundCoverVolume: number | null = null;
      const filteredCovers =
        covers.filter((cover) => cover.data.attributes.volume != null) || [];
      const maxVolumeString =
        filteredCovers.slice(-1)[0].data?.attributes?.volume;
      const maxVolume = maxVolumeString ? parseFloat(maxVolumeString) : null;
      console.log("max for", filteredCovers, "is", maxVolume);

      filteredCovers.forEach((cover) => {
        const coverVolumeString = cover.data.attributes.volume;
        const coverVolume = parseFloat(coverVolumeString || "0");
        if (!foundCover || foundCoverVolume == null) {
          foundCover = cover;
          console.log("setting", coverVolumeString);
          foundCoverVolume = coverVolume;
          return;
        }

        console.log("between?", coverVolume, foundCoverVolume, maxVolume);
        if (
          foundCoverVolume < requestedVolume &&
          coverVolume <= requestedVolume
        ) {
          console.log(
            "hey look its",
            coverVolume,
            cover.data.attributes.volume
          );
          foundCoverVolume = coverVolume;
          foundCover = cover;
        }
      });

      return foundCover || mainCover;
    }
    return null;
  }, [covers, mainCover, currentVolume]);

  const currentCoverUrl = useMemo(() => {
    const cover = coverForVolume || mainCover;

    return cover
      ? getCoverUrl(
          manga,
          cover.data.attributes.fileName,
          DisplayCoverSize.Thumb512
        )
      : null;
  }, [mainCover, manga, coverForVolume]);

  return (
    <Page
      backUrl="/"
      title={preferredTitle(title)}
      badges={[
        isExplicit(manga, { conservative: false }) ? "EXPLICIT" : null,
        lastChapterBadge,
        statusBadge,
        manga.attributes.contentRating || null,
      ]}
      tags={pageTags}
      showcase={{
        imageUrl: currentCoverUrl,
        content: <MangaDetails manga={manga} />,
      }}
    >
      <ChaptersList
        volumes={volumes}
        onFirstChapterReady={() => {}}
        manga={manga}
        onVolumeChange={setCurrentVolume}
      />
    </Page>
  );
}
