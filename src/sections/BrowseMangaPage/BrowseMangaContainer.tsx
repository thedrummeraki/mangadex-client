import { useSearchMangaList } from "helpers";
import { useEffect } from "react";
import { SearchState } from "types";

interface Props {
  searchOptions: SearchState;
}

export function BrowseMangaContainer({ searchOptions }: Props) {
  const { searchManga } = useSearchMangaList({ limit: 100 });

  useEffect(() => {
    searchManga(searchOptions);
  }, [searchOptions, searchManga]);

  return null;
}
