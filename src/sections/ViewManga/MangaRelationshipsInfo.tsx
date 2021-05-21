import {
  Avatar,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import useAuthors from "helpers/useAuthors";
import { useEffect, useMemo, useState } from "react";
import { GenericResponse, Manga, Relationship } from "types";
import { Author } from "types/authors";
import { repeat } from "utils";

interface Props {
  mangaInfo: GenericResponse<Manga>;
}

export function MangaRelationshipsInfo({ mangaInfo }: Props) {
  const { relationships } = mangaInfo;

  const [authorsState, setAuthorsStatus] = useState<{
    authors: GenericResponse<Author>[];
    artists: GenericResponse<Author>[];
  }>({ authors: [], artists: [] });

  const authorIds = useMemo(
    () => digIds("author", relationships),
    [relationships]
  );
  const artistIds = useMemo(
    () => digIds("artist", relationships),
    [relationships]
  );
  // const scanlationIds = digIds("scanlation_group", relationships);

  const {
    authors: authorsAndArtists,
    loading,
    error,
  } = useAuthors({
    limit: 100,
    ids: Array.from(new Set(authorIds.concat(artistIds))),
  });

  useEffect(() => {
    if (!loading && !error && authorsAndArtists.length > 0) {
      setAuthorsStatus({
        authors: authorsAndArtists.filter((aa) =>
          authorIds.includes(aa.data.id)
        ),
        artists: authorsAndArtists.filter((aa) =>
          artistIds.includes(aa.data.id)
        ),
      });
    }
  }, [loading, error, authorsAndArtists, authorIds, artistIds]);

  const authorsMarkup = loading
    ? repeat(authorIds.length, (index) => (
        <ListItem key={`author-skeleton-${index}`} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
        </ListItem>
      ))
    : authorsState.authors.map((author) => (
        <ListItem button={false} key={author.data.id} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar src={author.data.attributes.imageUrl || "#"}>
              {author.data.attributes.name.toUpperCase()[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={author.data.attributes.name}
            secondary="Author"
          />
        </ListItem>
      ));

  const artistsMarkup = loading
    ? repeat(artistIds.length, (index) => (
        <ListItem key={`artist-skeleton-${index}`} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
        </ListItem>
      ))
    : authorsState.artists.map((artist) => (
        <ListItem button={false} key={artist.data.id} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar src={artist.data.attributes.imageUrl || "#"}>
              {artist.data.attributes.name.toUpperCase()[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={artist.data.attributes.name}
            secondary="Artist (illustrations)"
          />
        </ListItem>
      ));

  return (
    <Grid container>
      <Grid item style={{ width: "100%" }}>
        <List>
          {authorsMarkup}
          {artistsMarkup}
        </List>
      </Grid>
    </Grid>
  );
}

function digIds(type: string, relationships: Relationship[]) {
  return relationships
    .filter((relationship) => relationship.type === type)
    .map((relationship) => relationship.id);
}
