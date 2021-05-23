import {
  Avatar,
  Button,
  Chip,
  Collapse,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Page, BBDescription, TitledSection, CustomGrid } from "components";
import { MangaLinkButton } from "components/MangaLinkButton";
import { useLocalCurrentlyReading } from "helpers";
import {
  isExplicit,
  mangaDescription,
  mangaTitle,
  preferredTitle,
} from "helpers/mangadex";
import useAggregate from "helpers/useAggregate";
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { GenericResponse, Manga, MangaLinkKey } from "types";
import { notEmpty } from "utils";
import { ChaptersList } from "./ChaptersList";
import { MangaRelationshipsInfo } from "./MangaRelationshipsInfo";

interface Props {
  mangaInfo: GenericResponse<Manga>;
}

const useStyles = makeStyles((theme) => ({
  description: {
    padding: theme.spacing(),
    overflow: "hidden",
  },
  authorChip: {
    margin: theme.spacing(0.5),
  },
}));

export function ViewManga({ mangaInfo }: Props) {
  const history = useHistory();
  const classes = useStyles();
  const [firstChapterId, setFirstChapterId] = useState<string | null>(null);
  const [open] = useState(false);

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
  const { volumesCount } = useAggregate(mangaInfo.data);
  const volumes = useMemo(
    () => volumesCount.map((count) => count.volume),
    [volumesCount]
  );

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

  const links = manga.attributes.links
    ? Object.entries(manga.attributes.links)
        .map((entry) => {
          const linkKey = entry[0] as MangaLinkKey;
          const url = entry[1];

          return url ? { linkKey, url } : null;
        })
        .filter(notEmpty)
    : [];

  console.log("links", links);

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
      primaryAction={primaryAction}
    >
      <Grid container spacing={1}>
        {/* <Grid item xs={12} lg={9} xl={9} style={{ maxHeight: "100%" }}>
          <div className={classes.description}>
            <Typography variant="h6">Description</Typography>
            {description.en ? (
              <Collapse unmountOnExit collapsedHeight={200} in={open}>
                <Typography variant="body2">
                  <BBDescription description={mangaDescription(manga)} />
                </Typography>
              </Collapse>
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
        </Grid> */}
        {links.length > 0 && (
          <Grid item xs={12}>
            <TitledSection title={`Links (${links.length})`} />
            <Grid container spacing={1}>
              {links.map((link) => (
                <Grid key={link.linkKey} item>
                  <MangaLinkButton {...link} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>

      <ChaptersList
        volumes={volumes}
        onFirstChapterReady={setFirstChapterId}
        manga={manga}
      />
    </Page>
  );
}
