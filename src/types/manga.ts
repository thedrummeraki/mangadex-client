import { Maybe } from "graphql/jsutils/Maybe";

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
  publicationDemographic?: Maybe<string>;
  status?: Maybe<string>;
  year: number;
  contentRating?: Maybe<string>;
  tags: Array<any>;
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
