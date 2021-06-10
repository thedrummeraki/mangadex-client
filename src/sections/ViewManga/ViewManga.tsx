import { Page, TitledSection } from "components";
import { isExplicit } from "helpers/mangadex";
import { useEffect, useMemo, useState } from "react";
import { MangaDetails } from "./MangaDetails";
import FaceIcon from "@material-ui/icons/Face";
import BrushIcon from "@material-ui/icons/Brush";
import { SingleManga } from "generated/graphql";
import LanguageSelector from "components/LanguageSelector";
import { Alert, Pagination } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";

import ImageIcon from "@material-ui/icons/Image";
// import ListIcon from "@material-ui/icons/List";
import GridOnIcon from "@material-ui/icons/GridOn";
import { ChapterCustomGrid, DisplayStyle } from "./ChaptersCustomGrid";
import { RenderIfLoggedIn } from "components/RenderIfLoggedIn";

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
  const classes = useStyles();
  const [displayStyle, setDisplayStyle] = useState(
    (localStorage.getItem("display-style") as DisplayStyle) ||
      DisplayStyle.Image
  );

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
  }, [mainCover]);

  useEffect(() => {
    localStorage.setItem("display-style", displayStyle);
  }, [displayStyle]);

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
          {
            content: DisplayStyle.Image,
            icon: <ImageIcon />,
            onClick: () => setDisplayStyle(DisplayStyle.Image),
          },
          {
            content: DisplayStyle.Grid,
            icon: <GridOnIcon />,
            onClick: () => setDisplayStyle(DisplayStyle.Grid),
          },
        ]}
        selectedTag={String(displayStyle)}
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

      <RenderIfLoggedIn loggedIn={false}>
        <Alert severity="info" style={{ marginBottom: 16 }}>
          Log in with your MangaDex account to save your reading progress!
        </Alert>
      </RenderIfLoggedIn>

      <ChapterCustomGrid
        manga={manga}
        displayStyle={displayStyle}
        refetching={refetching}
        requestingOneLocale={requestedLocales.length === 1}
        chapters={manga.chapters}
      />

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
