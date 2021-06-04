import { CustomGrid } from "components";
import { useSearchMangaList } from "helpers";
import { useEffect } from "react";
import { SearchState } from "types";
import { repeat } from "utils";
import { Link } from "./Link";
import { MangaCustomGrid } from "./MangaCustomGrid";
import { ThumbnailSkeleton } from "./Thumbnail/ThumbnailSkeleton";
import { TitledSection } from "./TitledSection";

interface Props {
  title: string;
  url: string;
  searchOptions: Partial<SearchState>;
}

export function MangaCategory({ title, url, searchOptions }: Props) {
  const limit = 6;
  const { mangaList, loading, searchManga } = useSearchMangaList({ limit });

  useEffect(() => {
    searchManga(searchOptions);
  }, [searchManga, searchOptions]);

  return (
    <div>
      <TitledSection
        title={title}
        variant="h6"
        primaryAction={<Link to={url}>View more</Link>}
      />
      {loading || !mangaList.results?.length ? (
        <CustomGrid>
          {repeat(limit, (index) => (
            <ThumbnailSkeleton key={`thumb-${index}`} />
          ))}
        </CustomGrid>
      ) : (
        <MangaCustomGrid mangasInfo={mangaList.results || []} />
      )}
    </div>
  );
}
