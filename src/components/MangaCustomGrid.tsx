import { useCallback, useEffect, useMemo, useState } from "react";
import { Cover, GenericResponse, Manga } from "types";
import CustomGrid from "./CustomGrid";
import { MangaThumbnail } from "./Thumbnails";
import GetCoversForManga from "sections/ViewManga/queries/GetCoversForManga";
import { useQuery } from "@apollo/client";
import { notEmpty } from "utils";
import { ThumbnailSkeleton } from "./Thumbnail/ThumbnailSkeleton";
import { mangaTitle } from "helpers";

interface Props {
  mangasInfo: GenericResponse<Manga>[];
  overrideFeatures?: (
    manga: GenericResponse<Manga>
  ) => Array<string | null | undefined>;
}

interface CoverMangaMapping {
  cover?: Cover;
  manga: Manga;
}

export function MangaCustomGrid({ mangasInfo, overrideFeatures }: Props) {
  const [allCovers, setAllCovers] = useState<GenericResponse<Cover>[]>([]);
  const [coverMangaList, setCoverMangaList] = useState<CoverMangaMapping[]>([]);

  const coverIdsInfo = useMemo(
    () =>
      mangasInfo
        .map((mangaInfo) => {
          const id = mangaInfo.relationships.find(
            (relationship) => relationship.type === "cover_art"
          )?.id;

          return id ? { id, manga: mangaInfo.data } : null;
        })
        .filter(notEmpty),
    [mangasInfo]
  );

  const { data, loading } = useQuery(GetCoversForManga, {
    variables: {
      ids: coverIdsInfo.map((idInfo) => idInfo.id).slice(-100),
      limit: 100,
    },
  });

  const getOverrideFeatures = useCallback(
    (manga: Manga) => {
      const mangaInfo = mangasInfo.find(
        (mangaInfo) => mangaInfo.data.id === manga.id
      );

      return mangaInfo && overrideFeatures
        ? overrideFeatures(mangaInfo)
        : undefined;
    },
    [mangasInfo, overrideFeatures]
  );

  useEffect(() => {
    const newCovers = data?.covers.results || [];
    setAllCovers((allCovers) => [...allCovers, ...newCovers]);
  }, [data]);

  useEffect(() => {
    if (allCovers.length > 0) {
      const mappings: CoverMangaMapping[] = [];
      mangasInfo.forEach((mangaInfo) => {
        const manga = mangaInfo.data;
        const coverId = coverIdsInfo.find(
          (idInfo) => manga.id === idInfo.manga.id
        )?.id;
        const cover = coverId
          ? allCovers.find((cover) => cover.data.id === coverId)?.data
          : undefined;

        mappings.push({ cover, manga });
      });
      setCoverMangaList(mappings);
    }
  }, [allCovers, coverIdsInfo, mangasInfo]);

  if (loading) {
    return (
      <CustomGrid>
        {mangasInfo.map((mangaInfo) => (
          <ThumbnailSkeleton
            key={`${mangaInfo.data.id}-skeleton`}
            title={mangaTitle(mangaInfo.data)}
          />
        ))}
      </CustomGrid>
    );
  }

  return (
    <CustomGrid>
      {coverMangaList.map((mangaWithCover) => (
        <MangaThumbnail
          key={mangaWithCover.manga.id}
          {...mangaWithCover}
          showContentRating
          overrideFeatures={getOverrideFeatures(mangaWithCover.manga)}
        />
      ))}
    </CustomGrid>
  );
}
