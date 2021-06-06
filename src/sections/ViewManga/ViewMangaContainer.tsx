import { useQuery } from "@apollo/client";
import { Typography } from "@material-ui/core";
import { Page } from "components";
import { useParams } from "react-router";
import { ViewManga } from "./ViewManga";
import ViewMangaQuery from "./queries/ViewMangaQuery";
import { useGetMangaQuery } from "generated/graphql";
import { useState } from "react";
import usePagination from "helpers/usePagination";

export default function ViewMangaContainer() {
  const { id } = useParams<{ id: string }>();
  const defaultLocale = "en";
  const [locales, setLocales] = useState([defaultLocale]);
  const pageSize = 100;

  const {
    limit: chapterLimit,
    offset: chapterOffset,
    page,
    setPage,
    getPagesCount,
  } = usePagination({ pageSize });

  const { data, loading, error, refetch } = useGetMangaQuery({
    variables: {
      id,
      chapterLimit: pageSize,
      chapterOffset: 0,
      translatedLanguage: [defaultLocale],
    },
  });

  if (error || (!loading && !data?.manga)) {
    if (error) console.error(error);
    return (
      <Page backUrl="/" title="Uh oh...">
        <Typography>
          We're sorry, we were not able to get the latest information from
          Mangadex.
        </Typography>
      </Page>
    );
  }

  if (loading || !data?.manga) {
    return <Page backUrl="/" title="Loading..." />;
  }

  return (
    <ViewManga
      manga={data.manga}
      requestedLocales={locales}
      page={page}
      pagesCount={getPagesCount(data.manga.chaptersCount)}
      onLocaleChange={(locales) => {
        setLocales(locales);
        setPage(1);
        refetch({
          translatedLanguage: locales,
          chapterLimit: pageSize,
          chapterOffset: 0,
        });
      }}
      onPageChange={(page) => {
        setPage(page);
        refetch({ chapterLimit, chapterOffset });
      }}
    />
  );
}
