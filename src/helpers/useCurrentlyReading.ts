import { Chapter, Manga } from "types";

interface Options {
  manga: string | Manga;
  chapter?: string | Chapter;
}

interface CurrentlyReading {
  chapterId: string;
  mangaId: string;
}

export function useLocalCurrentlyReading(options?: Options) {
  const storageKey = "currentlyReading";

  const setCurrentlyReading = (options: Options) => {
    const { mangaId, chapterId } = idsFromOptions(options);
    const state = parse(localStorage.getItem(storageKey));

    if (!chapterId) {
      return;
    }

    const currentChapterExists = state.find(
      (cr) => cr.chapterId === chapterId && cr.mangaId === mangaId
    );

    if (currentChapterExists) {
      return null;
    }

    state.push({ mangaId, chapterId });
    localStorage.setItem(storageKey, JSON.stringify(state));
  };

  const savedCurrentlyReading = localStorage.getItem(storageKey);
  const currentlyReading = parse(savedCurrentlyReading);

  if (options) {
    const { mangaId, chapterId } = idsFromOptions(options);

    const currentlyReading = parse(savedCurrentlyReading);
    const latestChapterForManga = currentlyReading.find(
      (cr) => cr.mangaId === mangaId
    );

    const currentlyReadingChapter = currentlyReading.find(
      (cr) => cr.chapterId === chapterId && cr.mangaId === mangaId
    );

    const isReadingChapter = Boolean(chapterId && currentlyReadingChapter);

    const isReadingManga =
      isReadingChapter ||
      Boolean(currentlyReading.find((cr) => cr.mangaId === mangaId));

    return {
      isReading: isReadingChapter || isReadingManga,
      isReadingChapter,
      isReadingManga,
      latestChapterForManga,
      currentlyReading,
      setCurrentlyReading,
    };
  }

  return {
    isReading: null,
    isReadingChapter: null,
    isReadingManga: null,
    latestChapterForManga: null,
    currentlyReading,
    setCurrentlyReading,
  };
}

export function savedPage(chapter: Chapter, defaultValue: number = 0) {
  return parseInt(
    localStorage.getItem(`chapter-${chapter.id}`) || String(defaultValue)
  );
}

function idsFromOptions({ manga, chapter }: Options) {
  const mangaId = typeof manga === "string" ? manga : manga.id;
  const chapterId = typeof chapter === "string" ? chapter : chapter?.id;

  return { mangaId, chapterId };
}

function parse(value: string | null) {
  if (value === null) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed as CurrentlyReading[];
    }

    return [];
  } catch {
    return [];
  }
}
