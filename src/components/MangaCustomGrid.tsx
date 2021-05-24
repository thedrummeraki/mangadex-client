import { useEffect, useMemo, useState } from "react";
import { Cover, GenericResponse, Manga } from "types";
import CustomGrid from "./CustomGrid";
import { MangaThumbnail } from "./Thumbnails";
import GetCoversForManga from "sections/ViewManga/queries/GetCoversForManga";
import { useQuery } from "@apollo/client";
import { notEmpty } from "utils";

interface Props {
  mangasInfo: GenericResponse<Manga>[];
}

interface CoverMangaMapping {
  cover?: Cover;
  manga: Manga;
}

export function MangaCustomGrid({ mangasInfo }: Props) {
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

  const { data } = useQuery(GetCoversForManga, {
    variables: {
      ids: coverIdsInfo.map((idInfo) => idInfo.id).slice(-100),
      limit: 100,
    },
  });

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

  return (
    <CustomGrid>
      {coverMangaList.map((mangaWithCover) => (
        <MangaThumbnail
          key={mangaWithCover.manga.id}
          {...mangaWithCover}
          showContentRating
        />
      ))}
    </CustomGrid>
  );
}
