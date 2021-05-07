import gql from "graphql-tag";

const query = gql`
  query GetChaptersFormManga($mangaId: String!) {
    chapters(manga: $mangaId, limit: 100)
      @rest(type: "Chapter", path: "/chapter?{args}") {
      limit
      offset
      total
      results {
        result
        relationships
        data {
          id
          type
          attributes {
            title
            volume
            chapter
            translatedLanguage
            hash
            data
            dataSaver
            uploader
            version
            createdAt
            updatedAt
            publishAt
          }
        }
      }
    }
  }
`;

export default query;
