import { Typography } from "@material-ui/core";
import { CustomGrid, Page, Thumbnail } from "components";
import { useEffect, useMemo, useState } from "react";

import ImportIcon from "@material-ui/icons/CloudUpload";
import ExportIcon from "@material-ui/icons/CloudDownload";
import { ExportModal } from "./ExportModal";
import { useHistory } from "react-router";
import {
  ContentRating,
  useGetCurrentReadingQueryQuery,
  useGetSearchMangaLazyQuery,
} from "generated/graphql";

// const useStyles = makeStyles((theme) => ({
//   formRoot: {
//     "& > *": {
//       width: "100%",
//       margin: theme.spacing(1, 0),
//     },
//   },
// }));

export default function ContinueReadingPageContainer() {
  // const classes = useStyles();
  const history = useHistory();

  const [exportModalOpen, setExportModalOpen] = useState(false);

  const { data, error } = useGetCurrentReadingQueryQuery();
  const mangaIds = useMemo(
    () =>
      (data?.currentlyReading || []).map(
        (currentlyReading) => currentlyReading.mangaUuid
      ),
    [data]
  );

  const [searchManga, { data: mangaData }] = useGetSearchMangaLazyQuery({
    fetchPolicy: "no-cache",
  });

  const mangas = useMemo(() => mangaData?.mangas || [], [mangaData]);

  useEffect(() => {
    if (mangaIds.length) {
      searchManga({
        variables: {
          limit: 100,
          offset: 0,
          ids: mangaIds,
          contentRating: Object.values(ContentRating),
        },
      });
    }
  }, [searchManga, mangaIds]);

  if (error) {
    return (
      <Page backUrl="/" title="Uh oh">
        <Typography>
          Something when while fetching your reading history, please try again!
        </Typography>
      </Page>
    );
  }

  const tags = [
    {
      content: "Import...",
      icon: <ImportIcon />,
      onClick: () => history.push("/continue-reading/import"),
    },
  ];

  if (mangas.length > 0) {
    tags.push({
      content: "Export...",
      icon: <ExportIcon />,
      onClick: () => setExportModalOpen(true),
    });
    // tags.push({
    //   content: "Delete...",
    //   icon: <DeleteForeverIcon />,
    //   onClick: () => setDeleteModalOpen(true),
    // });
  }

  return (
    <Page
      title="Reading history"
      tags={tags}
      // searchFields={{ searchOptions: searchState, onChange: setSearchState }}
    >
      <CustomGrid>
        {mangas.map((manga) => (
          <Thumbnail
            key={manga.id}
            features={[manga.attributes.status]}
            title={manga.attributes.title.en}
            img={manga.covers ? manga.covers[0].url : "#"}
            url={`/manga/${manga.id}`}
          />
        ))}
      </CustomGrid>
      {/* <BasicModal
        title="Delete reading history?"
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <Typography>This will be gone forever, are you sure?</Typography>
        <form noValidate autoComplete="off" className={classes.formRoot}>
          <FormControl>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={() => {
                clearHistory();
                setDeleteModalOpen(false);
              }}
            >
              Yes, delete everything
            </Button>
          </FormControl>
        </form>
      </BasicModal> */}
      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </Page>
  );
}

// function showWarning() {
//   return (
//     localStorage.getItem("current-reading-history-local-warning") !==
//     "dismissed"
//   );
// }

// function hideWarningNow() {
//   localStorage.setItem("current-reading-history-local-warning", "dismissed");
// }
