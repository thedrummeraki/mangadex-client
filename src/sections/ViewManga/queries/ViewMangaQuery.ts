import gql from "graphql-tag";

const query = gql`
  query GetMangaById($id: String!) {
    manga(id: $id) @rest(type: "Manga", path: "/manga/{args.id}") {
      result
      data {
        id
        type
        attributes {
          title
          altTitles
          description
          isLocked
          links
          originalLanguage
          lastVolume
          lastChapter
          publicationDemographic
          status
          year
          contentRating
          tags
          version
          createdAt
          updatedAt
        }
      }
      relationships {
        id
        type
      }
    }
  }
`;

export default query;
