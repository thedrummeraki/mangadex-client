import { useQuery } from "@apollo/client";
import { Page, TitledSectionTag } from "components";
import {
  DisplayCoverSize,
  getCoverUrl,
  isExplicit,
  preferredTitle,
  relationship,
  relationshipIds,
} from "helpers/mangadex";
import { useHistory } from "react-router";
import useAggregate from "helpers/useAggregate";
import useAuthors from "helpers/useAuthors";
import { useEffect, useMemo, useState } from "react";
import { Cover, GenericResponse } from "types";
import { Author } from "types/authors";
import { ChaptersList } from "./ChaptersList";
import { MangaDetails } from "./MangaDetails";
import GetCoversForManga from "./queries/GetCoversForManga";
import FaceIcon from "@material-ui/icons/Face";
import BrushIcon from "@material-ui/icons/Brush";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import { getFollowUrl, noEmptyString, notEmpty } from "utils";
import { SingleManga } from "generated/graphql";

interface Props {
  manga: SingleManga;
}

export function ViewManga({ manga }: Props) {
  const history = useHistory();

  const [currentVolume, setCurrentVolume] = useState<string | null>(null);
  const [authorsState, setAuthorsStatus] = useState<{
    authors: GenericResponse<Author>[];
    artists: GenericResponse<Author>[];
  }>({ authors: [], artists: [] });

  const covers = useMemo(() => manga.covers || [], [manga]);
  const mainCover = useMemo(() => covers[0], [covers]);

  const currentCoverUrl = useMemo(() => {
    const cover = mainCover;

    return cover ? cover.url : null;
  }, [mainCover, manga]);

  return (
    <Page
      backUrl="/"
      title={manga.attributes.title.en || ""}
      badges={[
        isExplicit(manga, { conservative: false }) ? "EXPLICIT" : null,
        manga.attributes.contentRating || null,
      ]}
      tags={manga.attributes.tags
        .map((tag) => {
          const name = tag.attributes.name.en;
          return name
            ? {
                content: name,
                icon: <LocalOfferIcon />,
              }
            : null;
        })
        .filter(notEmpty)}
      showcase={{
        imageUrl: currentCoverUrl,
        content: <MangaDetails manga={manga} />,
      }}
    >
      {/* <ChaptersList
        volumes={volumes}
        onFirstChapterReady={() => {}}
        manga={manga}
        onVolumeChange={setCurrentVolume}
      /> */}
    </Page>
  );
}
