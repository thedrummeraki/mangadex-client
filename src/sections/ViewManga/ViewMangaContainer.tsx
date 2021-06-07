import { Typography } from "@material-ui/core";
import { Page } from "components";
import { useParams } from "react-router";
import { ViewManga } from "./ViewManga";
import { useGetMangaQuery } from "generated/graphql";
import { useEffect, useRef, useState } from "react";
import usePagination from "helpers/usePagination";

export default function ViewMangaContainer() {
  const { id } = useParams<{ id: string }>();
  const defaultLocale = "en";
  const [locales, setLocales] = useState([defaultLocale]);
  const pageSize = 100;

  const initialized = useRef(false);

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

  useEffect(() => {
    if (!initialized.current) {
      return;
    }

    refetch({
      translatedLanguage: locales,
      chapterLimit,
      chapterOffset,
    });
  }, [refetch, chapterLimit, chapterOffset, locales]);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = Boolean(data?.manga);
  }, [data]);

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
      refetching={false}
      manga={data.manga}
      requestedLocales={locales}
      page={page}
      pagesCount={getPagesCount(data.manga.chaptersCount)}
      onLocaleChange={(locales) => {
        setLocales(locales);
        setPage(1);
      }}
      onPageChange={(page) => {
        setPage(page);
      }}
    />
  );
}
