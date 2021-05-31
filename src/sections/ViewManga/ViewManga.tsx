import { useQuery } from "@apollo/client";
import { Page, TitledSectionTag } from "components";
import {
  DisplayCoverSize,
  getCoverUrl,
  isExplicit,
  preferredTitle,
  relationship,
  relationshipIds,
} from "helpers/mangadex";
import { useHistory } from "react-router";
import useAggregate from "helpers/useAggregate";
import useAuthors from "helpers/useAuthors";
import { useEffect, useMemo, useState } from "react";
import { Cover, GenericResponse, Manga } from "types";
import { Author } from "types/authors";
import { ChaptersList } from "./ChaptersList";
import { MangaDetails } from "./MangaDetails";
import GetCoversForManga from "./queries/GetCoversForManga";
import FaceIcon from "@material-ui/icons/Face";
import BrushIcon from "@material-ui/icons/Brush";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import { getFollowUrl } from "utils";

interface Props {
  mangaInfo: GenericResponse<Manga>;
}

export function ViewManga({ mangaInfo }: Props) {
  const history = useHistory();
  const coversResult = useQuery(GetCoversForManga, {
    variables: { mangaIds: [mangaInfo.data.id], limit: 100 },
  });
  const [currentVolume, setCurrentVolume] = useState<string | null>(null);
  const [authorsState, setAuthorsStatus] = useState<{
    authors: GenericResponse<Author>[];
    artists: GenericResponse<Author>[];
  }>({ authors: [], artists: [] });

  const { data: manga, relationships } = mangaInfo;
  const {
    attributes: { lastChapter, status, tags, title },
  } = manga;
  const lastChapterBadge =
    lastChapter && parseInt(lastChapter) > 0
      ? `Last chapter: ${lastChapter}`
      : null;

  const statusBadge = status || null;

  const pageTags = useMemo(() => {
    const result: TitledSectionTag[] = [];
    const { authors, artists } = authorsState;
    if (authors.length > 0) {
      authors.forEach((author) => {
        result.push({
          content: author.data.attributes.name,
          icon: <FaceIcon />,
          onClick: () =>
            history.push(getFollowUrl(`/by-author/${author.data.id}`)),
        });
      });
    }
    if (artists.length > 0) {
      artists.forEach((artist) => {
        result.push({
          content: artist.data.attributes.name,
          icon: <BrushIcon />,
          onClick: () =>
            history.push(getFollowUrl(`/by-author/${artist.data.id}`)),
        });
      });
    }

    return result.concat(
      tags.map((tag) => ({
        content: tag.attributes.name.en,
        icon: <LocalOfferIcon />,
      }))
    );
  }, [authorsState, history, tags]);

  const authorIds = useMemo(
    () => relationshipIds(relationships, "author"),
    [relationships]
  );
  const artistIds = useMemo(
    () => relationshipIds(relationships, "artist"),
    [relationships]
  );

  const {
    authors: authorsAndArtists,
    loading: authorsLoading,
    error: authorsError,
  } = useAuthors({
    limit: 100,
    ids: Array.from(new Set(authorIds.concat(artistIds))),
  });

  useEffect(() => {
    if (!authorsLoading && !authorsError && authorsAndArtists.length > 0) {
      setAuthorsStatus({
        authors: authorsAndArtists.filter((aa) =>
          authorIds.includes(aa.data.id)
        ),
        artists: authorsAndArtists.filter((aa) =>
          artistIds.includes(aa.data.id)
        ),
      });
    }
  }, [authorsLoading, authorsError, authorsAndArtists, authorIds, artistIds]);

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
      return mainCover || null;
    }
    return null;
  }, [covers, mangaInfo]);

  const coverForVolume = useMemo(() => {
    const requestedVolume = parseFloat(currentVolume || "0");
    if (covers.length > 0 || String(requestedVolume) === "NaN") {
      if (!currentVolume || currentVolume === "N/A") {
        return mainCover ? mainCover : null;
      }

      let foundCover: GenericResponse<Cover> | null = null;
      let foundCoverVolume: number | null = null;
      const filteredCovers =
        covers.filter((cover) => cover.data.attributes.volume != null) || [];

      filteredCovers.forEach((cover) => {
        const coverVolumeString = cover.data.attributes.volume;
        const coverVolume = parseFloat(coverVolumeString || "0");
        if (!foundCover || foundCoverVolume == null) {
          foundCover = cover;
          foundCoverVolume = coverVolume;
          return;
        }

        if (
          foundCoverVolume < requestedVolume &&
          coverVolume <= requestedVolume
        ) {
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
