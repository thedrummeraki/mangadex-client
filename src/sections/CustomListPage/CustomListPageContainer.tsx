import { useQuery } from "@apollo/client";
import { CustomGrid, Page, Thumbnail } from "components";
import { useAuth } from "config/providers";
import { CreateCustomListPage } from "./CreateCustomListPage";
import GetCurrentCustomList from "./queries/GetCurrentCustomList";

export default function CustomListPageContainer() {
  const { data, loading, error } = useQuery(GetCurrentCustomList);
  const { currentUser } = useAuth();
  // const [customList, setCustomList] = useState<CustomList | null>(null);

  const dummyName =
    currentUser && `${currentUser.attributes.username}'s custom list`;

  if (loading || !dummyName) {
    return <Page backUrl="/" title="Your custom lists" />;
  }

  if (
    error ||
    !data?.customList?.results == null ||
    data?.customList?.result === "error"
  ) {
    return (
      <Page backUrl="/" title="Uh oh!">
        Something when wrong!
      </Page>
    );
  }

  if (data?.customList?.results?.length === 0) {
    return (
      <CreateCustomListPage name={dummyName} onCustomListCreated={() => {}} />
    );
  }

  return (
    <Page backUrl="/" title="Your custom lists">
      <CustomGrid>
        {data?.customList?.results?.map((result) => (
          <Thumbnail
            clickable={false}
            img="#"
            title={result.data?.attributes?.name || "title"}
          />
        ))}
      </CustomGrid>
    </Page>
  );
}
