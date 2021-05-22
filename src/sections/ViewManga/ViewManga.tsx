import {
  Avatar,
  Button,
  Chip,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Page, BBDescription, TitledSection, CustomGrid } from "components";
import { MangaLinkButton } from "components/MangaLinkButton";
import { useLocalCurrentlyReading } from "helpers";
import { mangaDescription, mangaTitle, preferredTitle } from "helpers/mangadex";
import { useState } from "react";
import { useHistory } from "react-router";
import { GenericResponse, Manga, MangaLinkKey } from "types";
import { ChaptersList } from "./ChaptersList";
import { MangaRelationshipsInfo } from "./MangaRelationshipsInfo";

interface Props {
  mangaInfo: GenericResponse<Manga>;
}

const useStyles = makeStyles((theme) => ({
  description: {
    padding: theme.spacing(),
    maxHeight: 200,
    overflow: "hidden",
  },
  moreInfo: {
    padding: theme.spacing(),
  },
  authorChip: {
    margin: theme.spacing(0.5),
  },
}));

export function ViewManga({ mangaInfo }: Props) {
  const history = useHistory();
  const classes = useStyles();
  const [firstChapterId, setFirstChapterId] = useState<string | null>(null);

  const { data: manga } = mangaInfo;
  const {
    attributes: { lastChapter, status, description, tags, title },
  } = manga;
  const lastChapterBadge =
    lastChapter && parseInt(lastChapter) > 0
      ? `Last chapter: ${lastChapter}`
      : null;

  const statusBadge = status || null;

  const pageTags = tags.map((tag) => ({
    content: tag.attributes.name.en,
  }));

  const { latestChapterForManga } = useLocalCurrentlyReading({ manga });

  const primaryAction = (
    <Button
      size="small"
      color="secondary"
      variant="contained"
      onClick={() => {
        if (latestChapterForManga) {
          history.push(`/manga/read/${latestChapterForManga.chapterId}`);
        } else {
          history.push(`/manga/read/${firstChapterId}`);
        }
      }}
    >
      {latestChapterForManga ? "Continue" : "Read now"}
    </Button>
  );

  return (
    <Page
      backUrl="/"
      title={preferredTitle(title)}
      badges={[
        lastChapterBadge,
        statusBadge,
        manga.attributes.contentRating || null,
      ]}
      tags={pageTags}
      primaryAction={primaryAction}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} lg={9} xl={9} style={{ maxHeight: "100%" }}>
          <div className={classes.description}>
            <Typography variant="h6">Description</Typography>
            {description.en ? (
              <Typography variant="body2">
                <BBDescription description={mangaDescription(manga)} />
              </Typography>
            ) : (
              <Typography>
                ~{" "}
                <em>
                  {mangaTitle(manga)} does not have a description for now.
                </em>{" "}
                ~
              </Typography>
            )}
          </div>
        </Grid>
        <Grid item xs={12} lg={3} xl={3}>
          <Paper>
            <Typography variant="h6" className={classes.moreInfo}>
              More information
            </Typography>
            <MangaRelationshipsInfo mangaInfo={mangaInfo} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.moreInfo}>
            Links ({Object.entries(manga.attributes.links).length})
          </Typography>
          <CustomGrid tight>
            {Object.entries(manga.attributes.links).map((entry) => {
              const key = entry[0] as MangaLinkKey;
              const url = entry[1];

              console.log("entry", entry[0], key);

              return url ? (
                <MangaLinkButton key={key} linkKey={key} url={url} />
              ) : null;
            })}
          </CustomGrid>
        </Grid>
      </Grid>

      <ChaptersList onFirstChapterReady={setFirstChapterId} manga={manga} />
    </Page>
  );
}
