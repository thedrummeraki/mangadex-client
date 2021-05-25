import { Chapter, Manga } from "types";

interface Options {
  manga: string | Manga;
  chapter?: string | Chapter;
}

interface CurrentlyReading {
  chapterId: string;
  mangaId: string;
}

export interface ReadingHistory extends CurrentlyReading {
  page: number;
}

export function useLocalCurrentlyReading(options?: Options) {
  const storageKey = "currentlyReading";

  const setCurrentlyReading = (options: Options) => {
    const { mangaId, chapterId } = idsFromOptions(options);
    const state = parse(localStorage.getItem(storageKey));
    const newState: CurrentlyReading[] = [];

    if (!chapterId) {
      return;
    }

    const currentChapterExists = state.find(
      (cr) => cr.chapterId === chapterId && cr.mangaId === mangaId
    );

    state.forEach((cr) => {
      if (
        currentChapterExists &&
        cr.chapterId === currentChapterExists.chapterId &&
        cr.mangaId === currentChapterExists.mangaId
      ) {
        return;
      }

      newState.push(cr);
    });

    if (currentChapterExists) {
      newState.push(currentChapterExists);
    } else {
      newState.push({ mangaId, chapterId });
    }

    localStorage.setItem(storageKey, JSON.stringify(newState));
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
      storageKey,
      isReading: isReadingChapter || isReadingManga,
      isReadingChapter,
      isReadingManga,
      latestChapterForManga,
      currentlyReading,
      setCurrentlyReading,
    };
  }

  return {
    storageKey,
    isReading: null,
    isReadingChapter: null,
    isReadingManga: null,
    latestChapterForManga: null,
    currentlyReading,
    setCurrentlyReading,
  };
}

export function savedPage(chapterId: string, defaultValue: number = 0) {
  const savedValue = localStorage.getItem(`chapter-${chapterId}`);
  if (!savedValue) {
    return defaultValue;
  }
  return parseInt(savedValue);
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
