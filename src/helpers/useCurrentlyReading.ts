import { Chapter, Manga } from "types";
import CryptoJS from "crypto-js";

interface Options {
  manga: string | Manga;
  chapter?: string | Chapter;
}

export interface CurrentlyReading {
  chapterId: string;
  mangaId: string;
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
    importHistory: importFromString,
    exportHistory: (password?: string) =>
      exportAsString(currentlyReading, password),
  };
}

export function savedPage(chapter: Chapter, defaultValue: number = 0) {
  const savedValue = localStorage.getItem(`chapter-${chapter.id}`);
  if (!savedValue) {
    return defaultValue;
  }
  return parseInt(savedValue);
}

function exportAsString(state: CurrentlyReading[], password?: string) {
  const encryptPassword = password || "no-password";
  const stateString = JSON.stringify(state);
  return CryptoJS.AES.encrypt(stateString, encryptPassword).toString();
}

function importFromString(string: string, password?: string) {
  const decryptPassword = password || "no-password";
  const bytes = CryptoJS.AES.decrypt(string, decryptPassword);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return parse(originalText);
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
