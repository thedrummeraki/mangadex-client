import { useQuery } from "@apollo/client";
import { Chapter, GenericResponse, Manga, Order } from "types";
import GetMangaFeedQuery from "./queries/manga/GetMangaFeed";

type GroupBy = "chapter" | "volume";

interface Options {
  order: Required<Order<GroupBy>>;
}

type GroupedChapters = {
  [key in string | "null"]: {
    // volume number
    chaptersInfo: GenericResponse<Chapter>[];
  };
};

export default function useGroupedChaptersByVolume(
  manga: Manga,
  options?: Options
) {
  const queryOptions: Options = options || {
    order: { chapter: "asc", volume: "desc" },
  };
  const result = useQuery(GetMangaFeedQuery, {
    variables: {
      mangaId: manga.id,
      orderChapter: queryOptions.order.chapter,
      orderVolume: queryOptions.order.volume,
    },
  });

  const { data, loading, error } = result;
  const groupedChapters: GroupedChapters = {};

  if (data && !loading && !error && data.chapters.results != null) {
    const {
      chapters: { results: chaptersInfo },
    } = data;

    const groupedByVolume = groupByVolume(chaptersInfo);
    console.log(groupedByVolume);
  }

  return { ...result, groupedChapters };
}

function groupByVolume(chaptersInfo: GenericResponse<Chapter>[]) {
  const group = chaptersInfo.reduce(
    (entryMap, e) =>
      entryMap.set(e.data.attributes.volume, [
        ...(entryMap.get(e.data.attributes.volume) || []),
        e,
      ]),
    new Map<string | null, GenericResponse<Chapter>[]>()
  );

  return group;
}
