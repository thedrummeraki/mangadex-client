import { useChapter } from "helpers";
import { useParams } from "react-router";
import { ReadChapter } from "./ReadChapter";

export function ReadChapterContainer() {
  const { id } = useParams<{ id: string }>();
  const { chapter, relationships } = useChapter(id);

  if (!chapter) {
    return null;
  }

  const mangaId = relationships.find(
    (relationship) => relationship.type === "manga"
  )!.id;

  return <ReadChapter chapter={chapter} mangaId={mangaId} />;
}
