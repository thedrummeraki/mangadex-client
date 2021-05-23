import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { BBDescription, TitledSection } from "components";
import { MangaLinkButton } from "components/MangaLinkButton";
import { mangaDescription } from "helpers";
import { Manga, MangaLinkKey } from "types";
import { decodeHTML, notEmpty } from "utils";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export interface Props {
  manga: Manga;
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

  return (
    <Grid container spacing={1}>
      {manga.attributes.altTitles.length > 0 && (
        <Grid item>
          <Typography component="span" variant="subtitle2">
            Also known as:{" "}
          </Typography>
          <Typography
            variant="caption"
            component="em"
            className={classes.altTitles}
          >
            {manga.attributes.altTitles
              .map((title) => decodeHTML(title[Object.keys(title)[0]]))
              .join("・")}
          </Typography>
        </Grid>
      )}
      <div className={classes.accordionRoot}>
        <Accordion disabled={!Boolean(description.en)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.accordionHeading}>
              Description
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              <BBDescription description={mangaDescription(manga)} />
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      {links.length > 0 && (
        <Grid item xs={12}>
          <TitledSection title={`Links (${links.length})`} />
          <Grid container spacing={1}>
            {links.map((link) => (
              <Grid key={link.linkKey} item>
                <MangaLinkButton {...link} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
