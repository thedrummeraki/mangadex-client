import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { decodeHTML, notEmpty } from "utils";
import { ChaptersList } from "./ChaptersList";
import { MangaRelationshipsInfo } from "./MangaRelationshipsInfo";
import { MangaDetails } from "./MangaDetails";

interface Props {
  mangaInfo: GenericResponse<Manga>;
}

export function ViewManga({ mangaInfo }: Props) {
  const history = useHistory();
  const [firstChapterId, setFirstChapterId] = useState<string | null>(null);
  const [open] = useState(false);

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
      showcase={{
        imageUrl: "https://picsum.photos/185/265",
        content: <MangaDetails manga={manga} />,
      }}
    >
      <ChaptersList
        volumes={volumes}
        onFirstChapterReady={setFirstChapterId}
        manga={manga}
      />
    </Page>
  );
}
