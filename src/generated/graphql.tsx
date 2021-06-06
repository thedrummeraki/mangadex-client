import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: any;
};

/** A basic instance of a Chapter. */
export type Chapter = {
  __typename?: 'Chapter';
  attributes: ChapterAttributes;
  id: Scalars['ID'];
  type: Scalars['String'];
};

export type ChapterAttributes = {
  __typename?: 'ChapterAttributes';
  chapter?: Maybe<Scalars['String']>;
  chapterHash: Scalars['String'];
  createdAt: Scalars['ISO8601DateTime'];
  data: Array<Scalars['String']>;
  dataSaver: Array<Scalars['String']>;
  publishAt: Scalars['ISO8601DateTime'];
  title: Scalars['String'];
  translatedLanguage: Scalars['String'];
  updatedAt: Scalars['ISO8601DateTime'];
  uploader?: Maybe<Scalars['String']>;
  version: Scalars['Int'];
  volume?: Maybe<Scalars['String']>;
};

/** Data relevant to a chapter page (expiration date, url, etc.). */
export type ChapterPage = {
  __typename?: 'ChapterPage';
  expiresAt: Scalars['ISO8601DateTime'];
  url: Scalars['String'];
};

export enum ContentRating {
  None = 'NONE',
  Safe = 'SAFE',
  Suggestive = 'SUGGESTIVE',
  Erotica = 'EROTICA',
  Hentai = 'HENTAI'
}

/** An instance of a Cover. Corresponds to the image associated to a Manga. */
export type Cover = {
  __typename?: 'Cover';
  attributes: CoverAttributes;
  id: Scalars['ID'];
  type: Scalars['String'];
  url: Scalars['String'];
};

export type CoverAttributes = {
  __typename?: 'CoverAttributes';
  createdAt: Scalars['ISO8601DateTime'];
  description?: Maybe<Scalars['String']>;
  fileName: Scalars['String'];
  updatedAt: Scalars['ISO8601DateTime'];
  version: Scalars['Int'];
  volume?: Maybe<Scalars['String']>;
};

/** Attributes for cover parameters with fetching from manga. */
export type CoverOptions = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  uploaders?: Maybe<Array<Scalars['String']>>;
};


export type LocalizedString = {
  __typename?: 'LocalizedString';
  en?: Maybe<Scalars['String']>;
};

/** An instance of a Manga. */
export type Manga = {
  __typename?: 'Manga';
  attributes: MangaAttributes;
  covers?: Maybe<Array<Cover>>;
  id: Scalars['ID'];
  type: Scalars['String'];
  volumes?: Maybe<Array<Scalars['String']>>;
};

export type MangaAttributes = {
  __typename?: 'MangaAttributes';
  altTitles: Array<LocalizedString>;
  contentRating?: Maybe<ContentRating>;
  createdAt: Scalars['ISO8601DateTime'];
  description?: Maybe<LocalizedString>;
  isLocked: Scalars['Boolean'];
  lastChapter?: Maybe<Scalars['String']>;
  lastVolume?: Maybe<Scalars['String']>;
  links: MangaLinksData;
  originalLanguage?: Maybe<Scalars['String']>;
  publicationDemographic?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  tags: Array<Tag>;
  title: LocalizedString;
  updatedAt: Scalars['ISO8601DateTime'];
  version: Scalars['Int'];
  year?: Maybe<Scalars['Int']>;
};

export type MangaLinksData = {
  __typename?: 'MangaLinksData';
  /** Manga link data with key al */
  al?: Maybe<Scalars['String']>;
  /** Manga link data with key amz */
  amz?: Maybe<Scalars['String']>;
  /** Manga link data with key ap */
  ap?: Maybe<Scalars['String']>;
  /** Manga link data with key bw */
  bw?: Maybe<Scalars['String']>;
  /** Manga link data with key cdj */
  cdj?: Maybe<Scalars['String']>;
  /** Manga link data with key ebj */
  ebj?: Maybe<Scalars['String']>;
  /** Manga link data with key engl */
  engl?: Maybe<Scalars['String']>;
  /** Manga link data with key kt */
  kt?: Maybe<Scalars['String']>;
  /** Manga link data with key mal */
  mal?: Maybe<Scalars['String']>;
  /** Manga link data with key mu */
  mu?: Maybe<Scalars['String']>;
  /** Manga link data with key nu */
  nu?: Maybe<Scalars['String']>;
  /** Manga link data with key raw */
  raw?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** An example field added by the generator */
  testField: Scalars['String'];
};

export enum PublicationDemographic {
  Shounen = 'SHOUNEN',
  Shoujo = 'SHOUJO',
  Josei = 'JOSEI',
  Seinen = 'SEINEN',
  None = 'NONE'
}

export type Query = {
  __typename?: 'Query';
  /** Find a chapter by ID. */
  chapter?: Maybe<SingleChapter>;
  /** Find a manga by ID. */
  manga?: Maybe<SingleManga>;
  /** List manga */
  mangas: Array<Manga>;
};


export type QueryChapterArgs = {
  id: Scalars['String'];
};


export type QueryMangaArgs = {
  id: Scalars['String'];
  coverParams?: Maybe<CoverOptions>;
  translatedLanguage?: Maybe<Array<Scalars['String']>>;
};


export type QueryMangasArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  authors?: Maybe<Array<Scalars['String']>>;
  artists?: Maybe<Array<Scalars['String']>>;
  year?: Maybe<Scalars['Int']>;
  includedTags?: Maybe<Array<Scalars['String']>>;
  includedTagsMode?: Maybe<TagMode>;
  excludedTags?: Maybe<Array<Scalars['String']>>;
  excludedTagsMode?: Maybe<TagMode>;
  status?: Maybe<Array<Status>>;
  originalLanguage?: Maybe<Array<Scalars['String']>>;
  publicationDemographic?: Maybe<Array<PublicationDemographic>>;
  ids?: Maybe<Array<Scalars['String']>>;
  contentRating?: Maybe<Array<ContentRating>>;
};

/** An instance of a single chapter. Used when fetching a chapter by ID. */
export type SingleChapter = {
  __typename?: 'SingleChapter';
  attributes: ChapterAttributes;
  id: Scalars['ID'];
  pages: Array<ChapterPage>;
  type: Scalars['String'];
};


/** An instance of a single chapter. Used when fetching a chapter by ID. */
export type SingleChapterPagesArgs = {
  dataSaver?: Maybe<Scalars['Boolean']>;
};

/** An instance of a single manga. Used when fetching a manga by ID. */
export type SingleManga = {
  __typename?: 'SingleManga';
  attributes: MangaAttributes;
  chapters: Array<Chapter>;
  covers?: Maybe<Array<Cover>>;
  id: Scalars['ID'];
  type: Scalars['String'];
  volumes?: Maybe<Array<Scalars['String']>>;
};


/** An instance of a single manga. Used when fetching a manga by ID. */
export type SingleMangaChaptersArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Scalars['String']>>;
  uploader?: Maybe<Scalars['String']>;
  volume?: Maybe<Scalars['String']>;
  chapter?: Maybe<Scalars['String']>;
  translatedLanguage?: Maybe<Array<Scalars['String']>>;
};

export enum Status {
  Ongoing = 'ONGOING',
  Completed = 'COMPLETED',
  Hiatus = 'HIATUS',
  Cancelled = 'CANCELLED'
}

/** An instance of a Tag. */
export type Tag = {
  __typename?: 'Tag';
  attributes: TagAttributes;
  id: Scalars['ID'];
  type: Scalars['String'];
};

export type TagAttributes = {
  __typename?: 'TagAttributes';
  group: Scalars['String'];
  name: LocalizedString;
  version: Scalars['Int'];
};

export enum TagMode {
  And = 'AND',
  Or = 'OR'
}

export type GetMangaQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetMangaQuery = (
  { __typename?: 'Query' }
  & { manga?: Maybe<(
    { __typename?: 'SingleManga' }
    & Pick<SingleManga, 'id' | 'type'>
    & { attributes: (
      { __typename?: 'MangaAttributes' }
      & Pick<MangaAttributes, 'status' | 'updatedAt' | 'version' | 'year' | 'contentRating' | 'createdAt' | 'isLocked' | 'lastChapter' | 'lastVolume' | 'originalLanguage' | 'publicationDemographic'>
      & { altTitles: Array<(
        { __typename?: 'LocalizedString' }
        & Pick<LocalizedString, 'en'>
      )>, tags: Array<(
        { __typename?: 'Tag' }
        & Pick<Tag, 'id' | 'type'>
        & { attributes: (
          { __typename?: 'TagAttributes' }
          & Pick<TagAttributes, 'group' | 'version'>
          & { name: (
            { __typename?: 'LocalizedString' }
            & Pick<LocalizedString, 'en'>
          ) }
        ) }
      )>, title: (
        { __typename?: 'LocalizedString' }
        & Pick<LocalizedString, 'en'>
      ), description?: Maybe<(
        { __typename?: 'LocalizedString' }
        & Pick<LocalizedString, 'en'>
      )>, links: (
        { __typename?: 'MangaLinksData' }
        & Pick<MangaLinksData, 'al' | 'nu' | 'raw' | 'amz' | 'ap' | 'bw' | 'cdj' | 'ebj' | 'engl' | 'kt' | 'mal' | 'mu'>
      ) }
    ), covers?: Maybe<Array<(
      { __typename?: 'Cover' }
      & Pick<Cover, 'id' | 'url' | 'type'>
      & { attributes: (
        { __typename?: 'CoverAttributes' }
        & Pick<CoverAttributes, 'volume' | 'fileName' | 'description' | 'version' | 'createdAt' | 'updatedAt'>
      ) }
    )>>, chapters: Array<(
      { __typename?: 'Chapter' }
      & Pick<Chapter, 'id' | 'type'>
      & { attributes: (
        { __typename?: 'ChapterAttributes' }
        & Pick<ChapterAttributes, 'chapter' | 'version' | 'chapterHash' | 'data' | 'dataSaver' | 'title' | 'translatedLanguage' | 'uploader' | 'volume' | 'createdAt' | 'updatedAt' | 'publishAt'>
      ) }
    )> }
  )> }
);


export const GetMangaDocument = gql`
    query GetManga($id: String!) {
  manga(id: $id) {
    id
    attributes {
      altTitles {
        en
      }
      status
      tags {
        attributes {
          group
          name {
            en
          }
          version
        }
        id
        type
      }
      title {
        en
      }
      updatedAt
      version
      year
      contentRating
      createdAt
      description {
        en
      }
      isLocked
      lastChapter
      lastVolume
      links {
        al
        nu
        raw
        amz
        ap
        bw
        cdj
        ebj
        engl
        kt
        mal
        mu
      }
      originalLanguage
      publicationDemographic
      tags {
        id
        type
        attributes {
          group
          name {
            en
          }
          version
        }
      }
    }
    type
    covers {
      id
      url
      type
      attributes {
        volume
        fileName
        description
        version
        createdAt
        updatedAt
      }
    }
    chapters {
      id
      type
      attributes {
        chapter
        version
        chapterHash
        data
        dataSaver
        title
        translatedLanguage
        uploader
        volume
        createdAt
        updatedAt
        publishAt
      }
    }
  }
}
    `;

/**
 * __useGetMangaQuery__
 *
 * To run a query within a React component, call `useGetMangaQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMangaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMangaQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMangaQuery(baseOptions: Apollo.QueryHookOptions<GetMangaQuery, GetMangaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMangaQuery, GetMangaQueryVariables>(GetMangaDocument, options);
      }
export function useGetMangaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMangaQuery, GetMangaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMangaQuery, GetMangaQueryVariables>(GetMangaDocument, options);
        }
export type GetMangaQueryHookResult = ReturnType<typeof useGetMangaQuery>;
export type GetMangaLazyQueryHookResult = ReturnType<typeof useGetMangaLazyQuery>;
export type GetMangaQueryResult = Apollo.QueryResult<GetMangaQuery, GetMangaQueryVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    