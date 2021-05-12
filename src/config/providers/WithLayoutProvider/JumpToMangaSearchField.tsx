import {
  Avatar,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import { mangaTitle, useSearchMangaList } from "helpers";
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
    width: 340,
    backgroundColor: theme.palette.background.paper,
    zIndex: 99,
  },
  hidden: {
    display: "none",
  },
}));

export default function JumpToMangaSearchField() {
  const classes = useStyles();
  const history = useHistory();
  const [showResults, setShowResults] = useState(false);
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Array<GenericResponse<Manga>>>([]);
  const { mangaList, loading, searchManga } = useSearchMangaList({ limit: 10 });

  const debouncedQuery = useDebouncedValue(input.trim(), 750);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      searchManga({
        title: debouncedQuery,
        contentRating: [ContentRating.safe],
      });
    } else if (debouncedQuery.length === 0) {
      setResults([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (!loading && mangaList?.results && mangaList.results.length > 0) {
      setResults(mangaList.results);
    }
  }, [loading, mangaList]);

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
            showResults || classes.hidden
          )}
        >
          {results.map((result) => {
            const labelId = `result-item-${result.data.id}`;

            return (
              <ListItem
                key={result.data.id}
                button
                onClick={() => {
                  history.push(`/manga/${result.data.id}`);
                  setShowResults(false);
                }}
              >
                <ListItemAvatar>
                  <Avatar src="#" />
                </ListItemAvatar>

                <ListItemText id={labelId} primary={mangaTitle(result.data)} />
              </ListItem>
            );
          })}
        </List>
      </div>
    </Paper>
  );
}
