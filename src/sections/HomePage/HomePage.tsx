import { Page } from "components";
import { MangaCustomGrid } from "components/MangaCustomGrid";
import { useAuth } from "config/providers";
import useMangaList from "helpers/useMangaList";

export function HomePage() {
  const pageSize = 50;

  const { mangaList, data, loading, error } = useMangaList({
    limit: pageSize,
    allowCache: true,
    authedRequest: true,
  });

  const { currentUser } = useAuth();

  if (error) {
    return <p>error</p>;
  }

  if (loading || !data) {
    return null;
  }

  return (
    <Page
      maxWitdh={false}
      title={
        currentUser
          ? `Welcome, ${currentUser.attributes.username}.`
          : `Hottest manga`
      }
    >
      <MangaCustomGrid mangasInfo={mangaList.results} />
    </Page>
  );
}
