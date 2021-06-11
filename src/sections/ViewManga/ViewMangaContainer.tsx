import { Typography, ThemeProvider } from "@material-ui/core";
import { Page } from "components";
import { useParams } from "react-router";
import { ViewManga } from "./ViewManga";
import { useGetMangaQuery } from "generated/graphql";
import { useEffect, useMemo, useRef, useState } from "react";
import usePagination from "helpers/usePagination";
import { WithLayoutProvider } from "config/providers";
import { customTheme } from "config/providers/RootProvider/themes";
import { getClientHost } from "config/providers/APIProvider/client";

export default function ViewMangaContainer() {
  const { id } = useParams<{ id: string }>();
  const defaultLocale = "en";
  const [locales, setLocales] = useState([defaultLocale]);
  const [primaryThemeColour, setPrimaryThemeColour] = useState("#f44336");
  const pageSize = 100;

  const theme = useMemo(
    () => customTheme(primaryThemeColour, primaryThemeColour),
    [primaryThemeColour]
  );

  const initialized = useRef(false);

  const {
    limit: chapterLimit,
    offset: chapterOffset,
    page,
    setPage,
    getPagesCount,
  } = usePagination({ pageSize, pushPageInfoToHistory: false });

  const { data, loading, error, refetch } = useGetMangaQuery({
    variables: {
      id,
      chapterLimit: pageSize,
      chapterOffset: 0,
      translatedLanguage: [defaultLocale],
    },
    context: {
      headers: {
        "X-Allow-Cache": "true",
      },
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
    if (data?.manga && data.manga.covers?.length) {
      const imageUrl = data.manga.covers[0].url;
      if (imageUrl) {
        fetch(
          new URL(
            `/palette?imageUrl=${encodeURIComponent(imageUrl)}`,
            getClientHost()
          ).toString()
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.success) {
              setPrimaryThemeColour(res.color);
            }
          });
      }
    }
  }, [data]);

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
    return (
      <ThemeProvider theme={theme}>
        <WithLayoutProvider>
          <Page backUrl="/" title="Loading..." />
        </WithLayoutProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <WithLayoutProvider>
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
      </WithLayoutProvider>
    </ThemeProvider>
  );
}
