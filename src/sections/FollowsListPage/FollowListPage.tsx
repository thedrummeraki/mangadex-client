import { ChaptersGrid, TitledSection } from "components";
import { Chapter, GenericResponse } from "types";

interface Props {
  chaptersResponse?: Array<GenericResponse<Chapter>>;
}

export function FollowListPage({ chaptersResponse }: Props) {
  return (
    <>
      <TitledSection title="Your follows" />
      <ChaptersGrid chaptersResponse={chaptersResponse || []} />
    </>
  );
}
