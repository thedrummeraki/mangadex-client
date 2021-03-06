import { Button, makeStyles } from "@material-ui/core";
import { MangaLinkKey } from "types";

import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import { openInNewTab } from "utils";

export interface MangaLinkButtonProps {
  linkKey: MangaLinkKey;
  url: string;
}

interface MapInfo {
  background: string;
  color: string;
  name: string;
  transform?: (value: string) => string;
}

type MangaLinkInfoMap = {
  [key in MangaLinkKey]: MapInfo;
};

const useStyles = makeStyles(() => ({
  root: {
    textTransform: "none",
  },
}));

export function MangaLinkButton({ linkKey, url }: MangaLinkButtonProps) {
  const classes = useStyles();

  // MangaDex has undocumented links, so ignore them and print a
  // warning message.
  if (
    !Object.entries(mangaLinkInfoMap)
      .map((entry) => entry[0])
      .includes(linkKey)
  ) {
    console.warn("[Warning] Missing link key", linkKey);
    return (
      <Button
        disabled
        size="small"
        variant="outlined"
        title="Don't be alarmed! We'll get that fixed soon."
        className={classes.root}
      >
        Unknown link
      </Button>
    );
  }
  const { background, color, name, transform } = mangaLinkInfoMap[linkKey];
  const finalUrl = transform ? transform(url) : url;

  return (
    <Button
      size="small"
      variant="outlined"
      endIcon={<OpenInNewIcon />}
      className={classes.root}
      style={{ backgroundColor: background, color }}
      onClick={() => openInNewTab(finalUrl)}
    >
      {name}
    </Button>
  );
}

const mangaLinkInfoMap: MangaLinkInfoMap = {
  al: {
    // background: "#2b2d42",
    // color: "#d9e6ff",
    background: "",
    color: "",
    name: "AniList",
    transform: (id) => `https://anilist.co/manga/${id}`,
  },
  amz: { background: "", color: "", name: "Amazon" },
  ap: {
    background: "",
    color: "",
    name: "AnimePlanet",
    transform: (slug) => `https://www.anime-planet.com/manga/${slug}`,
  },
  bw: {
    background: "",
    color: "",
    name: "bookwalker.jp",
    transform: (slug) => `https://bookwalker.jp/${slug}`,
  },
  cdj: { background: "", color: "", name: "CDJapan" }, // Not documented for now
  ebj: { background: "", color: "", name: "eBook Japan" },
  engtl: { background: "", color: "", name: "Official English" },
  kt: {
    background: "",
    color: "",
    name: "Kitsu.io",
    transform: (idOrSlug) => {
      if (parseInt(idOrSlug)) {
        return `https://kitsu.io/manga/${idOrSlug}`;
      } else {
        return `https://kitsu.io/api/edge/manga?filter[slug]=${idOrSlug}`;
      }
    },
  },
  mal: {
    background: "",
    color: "",
    name: "MyAnimeList",
    transform: (id) => `https://myanimelist.net/manga/${id}`,
  },
  mu: {
    background: "",
    color: "",
    name: "Baka-Updates Manga",
    transform: (id) => `https://www.mangaupdates.com/series.html?id=${id}`,
  },
  nu: {
    background: "",
    color: "",
    name: "Novel Updates",
    transform: (slug) => `https://www.novelupdates.com/series/${slug}`,
  },
  raw: { background: "", color: "", name: "Official (original)" },
};
