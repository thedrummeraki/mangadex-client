import { Description, Manga, Title } from "types";
import { Chapter } from "types/chapter";

import DOMPurify from "dompurify";

export function mangaTitle(manga: Manga) {
  return preferredTitle(manga.attributes.title);
}

export function mangaDescription(manga: Manga) {
  return preferredDescription(manga.attributes.description);
}

export function preferredTitle(title: Title) {
  return title.en;
}

export function preferredDescription(description: Description) {
  return DOMPurify.sanitize(description.en, { USE_PROFILES: { html: true } });
}

export function chapterTitle(chapter: Chapter) {
  const {
    attributes: { title, chapter: number },
  } = chapter;
  if (title) {
    return title;
  }

  return number != null ? `Chapter ${number}` : "Chapter";
}
