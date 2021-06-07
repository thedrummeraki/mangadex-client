import { NetworkStatus } from "@apollo/client";
import { makeStyles, TextField } from "@material-ui/core";
import { CustomGrid, Page, Thumbnail } from "components";
import { ThumbnailSkeleton } from "components/Thumbnail/ThumbnailSkeleton";
import { useAuth } from "config/providers";
import { Status, useGetSearchMangaQuery } from "generated/graphql";
import { useState } from "react";
import { repeat, useDebouncedValue } from "utils";

const useStyles = makeStyles((theme) => ({
  searchField: {
    marginBottom: theme.spacing(3),
    width: "100%",
  },
}));

interface Search {
  title: string | null;
  status: Status | null;
}

export function HomePage() {
  const classes = useStyles();
  const { currentUser } = useAuth();

  const [search, setSearch] = useState<Partial<Search>>({});

  const debouncedSearch = useDebouncedValue(search, 500);

  const { data, error, loading, networkStatus, fetchMore } =
    useGetSearchMangaQuery({
      variables: { limit: 100, offset: 0, ...debouncedSearch },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "no-cache",
    });

  const fetchingMore = networkStatus === NetworkStatus.fetchMore;

  if (error) {
    return <p>error</p>;
  }

  console.log(data);

  const mangas = data?.mangas || [];

  return (
    <Page
      title={
        currentUser
          ? `Welcome, ${currentUser.attributes.username}.`
          : `Hottest manga`
      }
      tags={Object.values(Status).map((status) => ({
        content: status,
        onClick: () =>
          setSearch((search) => ({
            ...search,
            status: search.status === status ? null : status,
          })),
      }))}
      selectedTag={search.status ? String(search.status) : null}
      onScrolledToBottom={() => {
        if (loading) {
          return;
        }

        fetchMore({ variables: { offset: mangas.length } });
      }}
    >
      <TextField
        variant="outlined"
        label="Search by title..."
        value={search.title}
        onChange={(event) =>
          setSearch((search) => ({ ...search, title: event.target.value }))
        }
        className={classes.searchField}
      />
      <CustomGrid>
        {mangas.map((manga) => (
          <Thumbnail
            key={manga.id}
            features={[manga.attributes.status]}
            title={manga.attributes.title.en}
            img={manga.covers?.length ? manga.covers[0].url : "#"}
            url={`/manga/${manga.id}`}
          />
        ))}
        {fetchingMore ||
          (loading &&
            repeat(20, (index) => (
              <ThumbnailSkeleton key={`manga-skeleton-${index}`} />
            )))}
      </CustomGrid>
    </Page>
  );
}
