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
import { useEffect, useMemo, useState } from "react";
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

interface Props {
  manga: SingleManga;
  page: number;
  pagesCount: number;
  requestedLocales: string[];
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
      tags={[]}
      showcase={{
        imageUrl: currentCoverUrl,
        content: <MangaDetails manga={manga} />,
      }}
    >
      <TitledSection
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
              defaultLocale={"en"}
              onLocaleChange={onLocaleChange}
            />
          </div>
        }
      />

      <CustomGrid>
        {manga.chapters.map((chapter) => {
          const {
            dataSaver,
            chapterHash,
            title,
            translatedLanguage,
            chapter: number,
            volume,
          } = chapter.attributes;
          const filename = dataSaver[0];
          const img = [
            "https://uploads.mangadex.org",
            "data-saver",
            chapterHash,
            filename,
          ].join("/");

          const pagesCount =
            dataSaver.length === 1 ? "1 page" : `${dataSaver.length} pages`;

          return (
            <Thumbnail
              features={[
                volume ? `Vol. ${volume}` : null,
                ISO6391.getName(translatedLanguage.split("-")[0]),
                pagesCount,
              ]}
              img={img}
              url={getFollowUrl(`/manga/read/${chapter.id}`)}
              title={`${number}) ${title || `Chapter ${number}`}`}
            />
          );
        })}
      </CustomGrid>
      {pagesCount > 1 && (
        <div className={classes.paginationRoot}>
          <Pagination
            count={pagesCount}
            page={page}
            onChange={(_, number) => onPageChange(number)}
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
