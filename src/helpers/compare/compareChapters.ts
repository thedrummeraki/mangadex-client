import { Chapter, GenericResponse } from "types";
import { CompareDirection } from "./types";

export default function compareChapters(direction: CompareDirection) {
  return (a: GenericResponse<Chapter>, b: GenericResponse<Chapter>) =>
    compareChaptersWithDirection(a, b, direction);
}

function compareChaptersWithDirection(
  a: GenericResponse<Chapter>,
  b: GenericResponse<Chapter>,
  direction: CompareDirection
) {
  const chapterA = a.data.attributes.chapter;
  const chapterB = b.data.attributes.chapter;
  if (chapterA != null && chapterB != null) {
    const intChA = parseInt(chapterA);
    const intChB = parseInt(chapterB);

    if (intChA < intChB) {
      return -1 * direction;
    } else if (intChA > intChB) {
      return 1 * direction;
    }
    return 0;
  } else if (chapterA != null) {
    return -1 * direction;
  } else if (chapterB != null) {
    return 1 * direction;
  }

  return 0;
}
