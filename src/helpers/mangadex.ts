import {
  Description,
  GenericResponse,
  Manga,
  Relationship,
  Title,
} from "types";
import {
  SingleManga as GraphqlSingleManga,
  ContentRating as GraphqlContentRating,
  Chapter as GraphqlChapter,
  SingleChapter as GraphqlSingleChapter,
} from "generated/graphql";
import { Chapter } from "types/chapter";

import DOMPurify from "dompurify";
import ISO6391 from "iso-639-1";
import { decodeHTML } from "utils";

interface ExplicatEvaluatorOptions {
  conservative?: boolean;
  strict?: boolean;
}

export enum DisplayCoverSize {
  Thumb256,
  Thumb512,
  Original,
}

export function mangaTitle(manga: Manga) {
  return preferredTitle(manga.attributes.title);
}

export function isExplicit(
  manga: GraphqlSingleManga,
  options: ExplicatEvaluatorOptions = { conservative: true, strict: false }
) {
  // if strict, a manga is explicit if we don't know its rating.
  if (options.strict && !manga.attributes.contentRating) {
    return true;
  }

  const explicitContentRatings = [GraphqlContentRating.Hentai];

  // A conservative approach means that we also include eroticas.
  if (options.conservative || options.strict) {
    explicitContentRatings.push(GraphqlContentRating.Erotica);
  }

  return (
    manga.attributes.contentRating != null &&
    explicitContentRatings.includes(manga.attributes.contentRating)
  );
}

export function mangaDescription(manga: Manga) {
  return preferredDescription(manga.attributes.description);
}

export function preferredTitle(title: Title) {
  return decodeHTML(title.en);
}

export function preferredDescription(description: Description) {
  return DOMPurify.sanitize(description.en, { USE_PROFILES: { html: true } });
}

export function chapterTitle(
  chapter: Chapter | GraphqlChapter | GraphqlSingleChapter,
  includeNumber: boolean = false
) {
  const {
    attributes: { title, chapter: number },
  } = chapter;
  if (title) {
    return includeNumber && number != null ? `${number}) ${title}` : title;
  }

  return number != null ? `Chapter ${number}` : "Chapter";
}

export function localeName(iso6391Locale: string) {
  return (
    ISO6391.getName(iso6391Locale) ||
    ISO6391.getName(iso6391Locale.split("-")[0]) ||
    iso6391Locale
  );
}

export function relationship<T>(itemInfo: GenericResponse<T>, type: string) {
  return itemInfo.relationships.find(
    (relationship) => relationship.type === type
  );
}

export function relationshipIds(relationships: Relationship[], type: string) {
  return relationships
    .filter((relationship) => relationship.type === type)
    .map((relationship) => relationship.id);
}

export function getCoverUrl(
  manga: GraphqlSingleManga,
  filename: string,
  size: DisplayCoverSize = DisplayCoverSize.Original
) {
  const filenameSize =
    size === DisplayCoverSize.Thumb256
      ? ".256.jpg"
      : size === DisplayCoverSize.Thumb512
      ? ".512.jpg"
      : "";

  const urlParts = [
    "https://uploads.mangadex.org",
    "covers",
    manga.id,
    filename.concat(filenameSize),
  ];

  return urlParts.join("/");
}
