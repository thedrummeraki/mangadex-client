import { Maybe } from "graphql/jsutils/Maybe";

export enum MangaStatus {
  ongoing = "ongoing",
  completed = "completed",
  hiatus = "hiatus",
  abandoned = "abandoned",
}

export enum PublicationDemographic {
  shonen = "shonen",
  shoujo = "shoujo",
  josei = "josei",
  seinen = "seinen",
  none = "none",
}

export enum ContentRating {
  safe = "safe",
  suggestive = "suggestive",
  erotica = "erotica",
  pornographic = "pornographic",
}

export interface Manga {
  id: string;
  type: "manga";
  attributes: MangaAttributes;
}

export interface MangaAttributes {
  title: Title;
  altTitles: Array<any>;
  description: Description;
  links: Array<MangaLink>;
  lastChapter?: Maybe<string>;
  publicationDemographic?: Maybe<PublicationDemographic>;
  status?: Maybe<MangaStatus>;
  year?: Maybe<number>;
  contentRating?: Maybe<ContentRating>;
  tags: Array<MangaTag>;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type Title = {
  [key: string]: string;
};

export type Description = {
  [key: string]: string;
};

export type MangaLink = string | null;

export interface MangaTag {
  id: string;
  type: "tag";
  attributes: MangaTagAttributes;
}

export interface MangaTagAttributes {
  name: Title;
  version: number;
}
