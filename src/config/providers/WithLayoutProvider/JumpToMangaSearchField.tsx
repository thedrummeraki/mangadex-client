import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  CircularProgressProps,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import { mangaDescription, mangaTitle, useSearchMangaList } from "helpers";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { ContentRating, GenericResponse, Manga } from "types";
import { useDebouncedValue } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  iconButton: {
    padding: 10,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "100%",
  },
  search: {
    position: "relative",
    width: "100%",
  },
  autocompleteList: {
    position: "absolute",
    width: "50%",
    minWidth: 340,
    maxWidth: 700,
    backgroundColor: theme.palette.background.paper,
    zIndex: 99,
  },
  searchResultItemTitle: {
    ...theme.custom.clampedTitle,
  },
  hidden: {
    display: "none",
  },
  loading: {
    color: theme.palette.secondary.dark,
    marginRight: theme.spacing(),
  },
}));

export default function JumpToMangaSearchField() {
  const classes = useStyles();
  const history = useHistory();
  const [showResults, setShowResults] = useState(false);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Array<GenericResponse<Manga>>>([]);
  const { mangaList, loading, searchManga } = useSearchMangaList({ limit: 5 });

  const debounceDelayMs = 750;
  const debouncedQuery = useDebouncedValue(input.trim(), debounceDelayMs);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      searchManga({
        title: debouncedQuery,
        contentRating: [ContentRating.safe],
      });
    } else if (debouncedQuery.length === 0) {
      setResults([]);
    }
  }, [debouncedQuery, searchManga]);

  useEffect(() => {
    if (!loading && mangaList?.results && mangaList.results.length > 0) {
      setResults(mangaList.results);
    }
  }, [loading, mangaList]);

  // useEffect(() => {
  //   setDebouncing(input.length > 0);
  //   if (input.length > 0) {
  //     setProgress({
  //       value: 1,
  //       variant: "determinate",
  //       className: classes.loading,
  //     });
  //   } else {
  //     setProgress(defaultProgress);
  //   }
  // }, [input]);

  return (
    <Paper
      className={classes.root}
      onBlur={(event) => {
        if (!event.relatedTarget) {
          setShowResults(false);
        }
      }}
    >
      <IconButton className={classes.iconButton}>
        <SearchIcon />
      </IconButton>
      <div className={classes.search}>
        <InputBase
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className={classes.input}
          placeholder="Jump to manga..."
          onFocus={() => setShowResults(true)}
        />
        <List
          className={clsx(
            classes.autocompleteList,
            (showResults && debouncedQuery.length && results.length) ||
              classes.hidden
          )}
        >
          {results.map((result) => {
            const manga = result.data;
            const {
              attributes: { year, status, tags },
            } = manga;
            const labelId = `result-item-${manga.id}`;

            return (
              <ListItem
                key={manga.id}
                button
                onClick={() => {
                  history.push(`/manga/${manga.id}`);
                  setShowResults(false);
                }}
              >
                <ListItemAvatar>
                  <Avatar src="#" />
                </ListItemAvatar>

                <ListItemText
                  id={labelId}
                  primary={
                    <Typography className={classes.searchResultItemTitle}>
                      {mangaTitle(manga)}
                    </Typography>
                  }
                  secondary={
                    <div>
                      <div>
                        {year && (
                          <Chip
                            size="small"
                            style={{ marginRight: 8, marginBottom: 6 }}
                            label={String(year)}
                          />
                        )}
                        {status && (
                          <Chip
                            size="small"
                            style={{ marginRight: 8, marginBottom: 6 }}
                            label={String(status)}
                            color="primary"
                          />
                        )}
                        {tags.map((tag) => (
                          <Chip
                            size="small"
                            style={{ marginRight: 8, marginBottom: 6 }}
                            label={tag.attributes.name.en}
                          />
                        ))}
                      </div>
                      <Typography
                        variant="subtitle2"
                        className={classes.searchResultItemTitle}
                      >
                        {mangaDescription(manga)}
                      </Typography>
                    </div>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </div>
      {loading && <CircularProgress size={24} className={classes.loading} />}
    </Paper>
  );
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}
