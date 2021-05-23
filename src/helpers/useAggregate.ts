import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { Manga } from "types";
import GetAggregateQuery from "./queries/manga/GetAggregate";

export default function useAggregate(manga: Manga) {
  const result = useQuery(GetAggregateQuery, {
    variables: { mangaId: manga.id },
  });

  const { data } = result;

  const volumesCount = useMemo(() => {
    if (data?.aggregate.volumes) {
      return Object.entries(data.aggregate.volumes).map((entry) => entry[1]);
    }

    return [];
  }, [data]);

  return { ...result, volumesCount };
}
