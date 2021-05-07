import { Chapter } from "types/chapter";
import { useAtHomeBaseUrl } from "sections/ViewManga/useAtHome";
import { Page, Thumbnail } from "components";
import { Grid } from "@material-ui/core";

interface Props {
  chapter: Chapter;
  mangaId: string;
}

export function ReadChapter({ chapter, mangaId }: Props) {
  const { atHomeBaseUrl, loading, error } = useAtHomeBaseUrl(chapter);

  if (!atHomeBaseUrl || loading || error) {
    return null;
  }

  const pageData = chapter.attributes.dataSaver;
  const pageURLs = pageData.map((data) =>
    [atHomeBaseUrl, "data-saver", chapter.attributes.hash, data].join("/")
  );

  return (
    <Page
      backUrl={`/manga/${mangaId}`}
      title={`You are reading: "${chapter.attributes.title}"`}
      badges={[
        chapter.attributes.volume !== null
          ? `Volume ${chapter.attributes.volume}`
          : null,
      ]}
    >
      <Grid container spacing={1}>
        {pageURLs.map((pageUrl, index) => (
          <Grid item>
            <Thumbnail
              clickable={false}
              img={pageUrl}
              title={`Page ${index + 1}`}
            />
          </Grid>
        ))}
      </Grid>
    </Page>
  );
}