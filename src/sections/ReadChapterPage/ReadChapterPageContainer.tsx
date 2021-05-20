import { useChapter } from "helpers";
import { useParams } from "react-router";
import { ReadChapterPage } from "./ReadChapterPage";

export default function ReadChapterPageContainer() {
  const { id } = useParams<{ id: string }>();
  const { chapter, relationships } = useChapter(id);

  if (!chapter) {
    return null;
  }

  const mangaId = relationships.find(
    (relationship) => relationship.type === "manga"
  )!.id;

  return <ReadChapterPage chapter={chapter} mangaId={mangaId} />;
}
