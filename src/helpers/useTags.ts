import { useQuery } from "@apollo/client";
import GetTagsQuery from "./queries/manga/GetTags";

export default function useTags() {
  const results = useQuery(GetTagsQuery);
  const tags = results.data?.tags || [];

  return { ...results, tags };
}
