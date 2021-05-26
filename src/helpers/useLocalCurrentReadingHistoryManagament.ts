import {
  ReadingHistory,
  useLocalCurrentlyReading,
  savedPage,
} from "./useCurrentlyReading";
import CryptoJS from "crypto-js";

export default function useLocalCurrentReadingHistoryManagament() {
  const { storageKey, currentlyReading } = useLocalCurrentlyReading();
  const readingHistory = currentlyReading.map((cr) => ({
    ...cr,
    page: savedPage(cr.chapterId),
  }));
  return {
    importHistory: importFromString,
    clearHistory: () => clearHistory(storageKey),
    exportHistory: (password?: string) =>
      exportAsString(readingHistory, password),
    saveImport: async (
      importedReadingHistory: ReadingHistory[],
      override?: boolean
    ) => {
      const contentToSave = [...importedReadingHistory];
      if (!override) {
        contentToSave.concat(currentlyReading as ReadingHistory[]);
      }
      contentToSave.forEach((rh) => {
        if (rh.page) {
          localStorage.setItem(`chapter-${rh.chapterId}`, String(rh.page));
        }
      });

      const stringToSave = JSON.stringify(importedReadingHistory);
      localStorage.setItem(storageKey, stringToSave);
    },
  };
}

function exportAsString(readingHistory: ReadingHistory[], password?: string) {
  const encryptPassword = password || "no-password";
  const readingHistoryString = JSON.stringify(readingHistory);
  return CryptoJS.AES.encrypt(readingHistoryString, encryptPassword).toString();
}

async function importFromString(string: string, password?: string) {
  const decryptPassword = password || "no-password";
  const bytes = CryptoJS.AES.decrypt(string, decryptPassword);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return parse(originalText);
}

function clearHistory(storageKey: string) {
  localStorage.removeItem(storageKey);
  Object.entries(localStorage)
    .filter((entry) => entry[0].startsWith("chapter-"))
    .forEach((entry) => {
      localStorage.removeItem(entry[0]);
    });
}

function parse(value: string | null) {
  if (value === null) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed as ReadingHistory[];
    }

    return [];
  } catch {
    return [];
  }
}
