import { useQuery } from "@apollo/client";
import { useAuth } from "config/providers";
import GetCustomListManga, {
  GetCustomListMangaVariables,
} from "./queries/GetCustomListMangaQuery";

export default function useCustomListMangaFeed(
  options: GetCustomListMangaVariables
) {
  const result = useQuery(GetCustomListManga, {
    variables: {
      ...options,
    },
    context: {
      headers: {
        "X-Should-Auth": "true",
        "X-Allow-Cache": "true",
      },
    },
  });

  return {
    ...result,
    chapters: result.data?.customListManga.results || [],
  };
}
