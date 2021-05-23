import { noEmptyString } from "utils";

interface DocumentTitleProps {
  title: string;
  prefix?: string;
  suffix?: string;
}

export function DocumentTitle(props: DocumentTitleProps) {
  useDocumentTitle(props);

  return null;
}

export function useDocumentTitle({
  title,
  prefix,
  suffix = "Unofficial MangaDex client",
}: DocumentTitleProps) {
  const fullTitle = [prefix, title, suffix].filter(noEmptyString).join(" ~ ");
  document.title = fullTitle;

  return fullTitle;
}

export function useNoDocumentTitle() {
  useDocumentTitle({ title: "" });
}
