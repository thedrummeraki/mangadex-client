import { useQuery } from "@apollo/client";
import { CircularProgress, Grid } from "@material-ui/core";
import { Thumbnail, TitledSection } from "components";
import { chapterTitle } from "helpers";
import { PagedResultsList, Manga } from "types";
import { Chapter } from "types/chapter";
import { timeAgo } from "utils";
import GetChaptersForManga from "./queries/GetChaptersForManga";

interface Props {
  manga: Manga;
}

export function ChaptersList({ manga }: Props) {
  const { data, loading, error } = useQuery(GetChaptersForManga, {
    variables: { mangaId: manga.id },
    context: {
      headers: {
        "X-Allow-Cache": "true",
      },
    },
  });

  if (error) {
    return <TitledSection title="Error" />;
  }

  if (loading) {
    return (
      <TitledSection
        title={
          <span>
            Chapters list <CircularProgress size={18} />
          </span>
        }
      />
    );
  }

  if (!data?.chapters?.results) {
    return <TitledSection title="No chapters were found yet" />;
  }

  const chaptersList = data.chapters as PagedResultsList<Chapter>;

  return (
    <>
      <TitledSection title={`Chapters list (${chaptersList.total})`} />
      <Grid container spacing={2}>
        {chaptersList.results.map((chapterInfo, index) => (
          <Grid item>
            <Thumbnail
              features={[timeAgo(chapterInfo.data.attributes.publishAt)]}
              title={`${index + 1}) ${chapterTitle(chapterInfo.data)}`}
              img="https://picsum.photos/185/265"
              url={`/manga/read/${chapterInfo.data.id}`}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
