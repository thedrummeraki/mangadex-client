import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { BBDescription } from "components";
import { MangaLinkButton } from "components/MangaLinkButton";
import { mangaDescription } from "helpers";
import { MangaLinkKey } from "types";
import { decodeHTML, notEmpty } from "utils";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { SingleManga } from "generated/graphql";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

export interface Props {
  manga: SingleManga;
}

const useStyles = makeStyles((theme) => ({
  altTitles: {
    color: theme.palette.grey.A700,
  },
  description: {
    padding: theme.spacing(),
    overflow: "hidden",
  },
  authorChip: {
    margin: theme.spacing(0.5),
  },
  accordionRoot: {
    marginTop: theme.spacing(2),
    width: "100%",
  },
  accordionHeading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  readNowButton: {
    marginBottom: theme.spacing(4),
    width: "37em",

    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  tagsContainer: {
    width: "100%",
    marginTop: theme.spacing(0.5),

    "&:first-child": {
      marginLeft: 0,
    },
    "&:last-child": {
      marginRight: 0,
    },
  },
  tagsDescription: {
    marginRight: theme.spacing(),
    color: theme.palette.text.hint,
  },
  tag: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}));

export function MangaDetails({ manga }: Props) {
  const classes = useStyles();
  const {
    attributes: { description },
  } = manga;

  const links = manga.attributes.links
    ? Object.entries(manga.attributes.links)
        .map((entry) => {
          const linkKey = entry[0] as MangaLinkKey;
          const url = entry[1];

          return url ? { linkKey, url } : null;
        })
        .filter(notEmpty)
    : [];

  const tagGroups = [
    {
      name: "Genre",
      tags: manga.attributes.tags.filter(
        (tag) => tag.attributes.group === "genre"
      ),
    },
    {
      name: "Theme",
      tags: manga.attributes.tags.filter(
        (tag) => tag.attributes.group === "theme"
      ),
    },
    {
      name: "Category",
      tags: manga.attributes.tags.filter(
        (tag) => tag.attributes.group === "content"
      ),
    },
  ];

  return (
    <Grid container spacing={1}>
      <Button
        size="large"
        color="primary"
        variant="contained"
        startIcon={<PlayArrowIcon />}
        className={classes.readNowButton}
      >
        Read now
      </Button>

      {tagGroups.map(
        (tagGroup) =>
          tagGroup.tags.length > 0 && (
            <div className={classes.tagsContainer}>
              <Typography
                component="span"
                variant="subtitle2"
                className={classes.tagsDescription}
              >
                {tagGroup.name}
              </Typography>
              {tagGroup.tags.map((tag, index) => {
                return (
                  <Chip
                    key={`${tag}-${index}`}
                    variant={"outlined"}
                    color={"default"}
                    size="small"
                    label={tag.attributes.name.en}
                    className={classes.tag}
                  />
                );
              })}
            </div>
          )
      )}
      <div className={classes.accordionRoot}>
        {description?.en && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.accordionHeading}>
                Description
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                <BBDescription description={description.en} />
              </Typography>
            </AccordionDetails>
          </Accordion>
        )}
        {manga.attributes.altTitles.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.accordionHeading}>
                Other details
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <Typography component="span" variant="subtitle2">
                  Also known as:{" "}
                </Typography>
                <Typography variant="caption" className={classes.altTitles}>
                  <em>
                    {manga.attributes.altTitles
                      .map((title) => decodeHTML(title.en || ""))
                      .join("・")}
                  </em>
                </Typography>
              </div>
            </AccordionDetails>
          </Accordion>
        )}
        {links.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.accordionHeading}>
                Links ({links.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {links.map((link) => (
                    <Grid key={link.linkKey} item>
                      <MangaLinkButton {...link} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}
      </div>
    </Grid>
  );
}
