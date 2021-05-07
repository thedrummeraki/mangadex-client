import { Description, Manga, Title } from "types";

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
  return description.en;
}
