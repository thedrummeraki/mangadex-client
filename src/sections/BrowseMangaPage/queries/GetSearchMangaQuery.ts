import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import gql from "graphql-tag";
import { Manga, PagedResultsList, SearchState } from "types";

export default gql`
  query GetSearchManga($title: String) {
    searchResults(title: $title)
  }
` as TypedDocumentNode<
  {
    searchResults: PagedResultsList<Manga>;
  },
  Partial<SearchState>
>;
