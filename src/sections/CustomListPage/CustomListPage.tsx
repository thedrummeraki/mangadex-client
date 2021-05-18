import { CustomList } from "types/customList";

interface Props {
  customList: CustomList;
}

export function CustomListPage({ customList }: Props) {
  return <p>{customList.attributes.name}</p>;
}
