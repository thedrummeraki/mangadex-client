import { useQuery } from "@apollo/client";
import {
  CustomGrid,
  Page,
  Thumbnail,
  TitledSection,
  TitledSectionTag,
} from "components";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { Cover, GenericResponse } from "types";
import { Author } from "types/authors";
import { ChaptersList } from "./ChaptersList";
import { MangaDetails } from "./MangaDetails";
import GetCoversForManga from "./queries/GetCoversForManga";
import FaceIcon from "@material-ui/icons/Face";
import BrushIcon from "@material-ui/icons/Brush";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import { getFollowUrl, noEmptyString, notEmpty } from "utils";
import { SingleManga } from "generated/graphql";
import LanguageSelector from "components/LanguageSelector";
import ISO6391 from "iso-639-1";
import usePagination from "helpers/usePagination";
import { Pagination } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";

import ImageIcon from "@material-ui/icons/Image";
// import ListIcon from "@material-ui/icons/List";
import GridOnIcon from "@material-ui/icons/GridOn";
import { ChapterCustomGrid } from "./ChaptersCustomGrid";

interface Props {
  manga: SingleManga;
  page: number;
  pagesCount: number;
  requestedLocales: string[];
  refetching: boolean;
  onLocaleChange: (locale: string[]) => void;
  onPageChange: (page: number) => void;
}

const useStyles = makeStyles((theme) => ({
  paginationRoot: {
    display: "flex",
    width: "100%",
    margin: theme.spacing(2),
    justifyContent: "center",
  },
}));

export function ViewManga({
  manga,
  requestedLocales,
  page,
  pagesCount,
  refetching,
  onLocaleChange,
  onPageChange,
}: Props) {
  const history = useHistory();
  const classes = useStyles();

  const [currentVolume, setCurrentVolume] = useState<string | null>(null);
  const [authorsState, setAuthorsStatus] = useState<{
    authors: GenericResponse<Author>[];
    artists: GenericResponse<Author>[];
  }>({ authors: [], artists: [] });

  const covers = useMemo(() => manga.covers || [], [manga]);
  const mainCover = useMemo(() => covers[0], [covers]);

  const { people } = manga;

  const authors = people.filter((person) => person.type === "author");
  const artists = people.filter((person) => person.type === "artist");

  const authorsTags = authors.map((author) => ({
    content: author.attributes.name,
    icon: <FaceIcon />,
  }));
  const artistsTags = artists.map((artist) => ({
    content: artist.attributes.name,
    icon: <BrushIcon />,
  }));

  const currentCoverUrl = useMemo(() => {
    const cover = mainCover;

    return cover ? cover.url : null;
  }, [mainCover, manga]);

  return (
    <Page
      backUrl="/"
      title={manga.attributes.title.en || ""}
      badges={[
        isExplicit(manga, { conservative: false }) ? "EXPLICIT" : null,
        manga.attributes.contentRating || null,
      ]}
      tags={authorsTags.concat(artistsTags)}
      tagsDescription="People involved"
      showcase={{
        imageUrl: currentCoverUrl,
        content: <MangaDetails manga={manga} />,
      }}
    >
      <TitledSection
        id="chapters-list"
        title="Chapters list"
        variant="h6"
        tags={[
          { content: "Image", icon: <ImageIcon />, onClick: () => {} },
          { content: "Grid", icon: <GridOnIcon />, disabled: true },
        ]}
        selectedTag="Image"
        tagsDescription="Preview style"
        primaryAction={
          <div style={{ width: 300 }}>
            <LanguageSelector
              defaultLocales={requestedLocales}
              onLocaleChange={onLocaleChange}
            />
          </div>
        }
      />

      <ChapterCustomGrid refetching={refetching} chapters={manga.chapters} />

      {pagesCount > 1 && (
        <div className={classes.paginationRoot}>
          <Pagination
            count={pagesCount}
            page={page}
            onChange={(_, number) => {
              const titleElement = document.getElementById("chapters-list");
              if (titleElement) {
                titleElement.scrollIntoView({ behavior: "smooth" });
              }
              onPageChange(number);
            }}
          />
        </div>
      )}
      {/* <ChaptersList
        volumes={volumes}
        onFirstChapterReady={() => {}}
        manga={manga}
        onVolumeChange={setCurrentVolume}
      /> */}
    </Page>
  );
}
