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
  mangaId: Scalars['ID'];
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

/** Attributes for chapter parameters with fetching from manga. */
export type ChapterOptions = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Scalars['String']>>;
  uploader?: Maybe<Scalars['String']>;
  volume?: Maybe<Scalars['String']>;
  chapter?: Maybe<Scalars['String']>;
  translatedLanguage?: Maybe<Array<Scalars['String']>>;
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

/** Possible sizes for covers */
export enum CoverSize {
  Thumb256 = 'thumb256',
  Thumb512 = 'thumb512',
  Original = 'original'
}

/** A basic instance of a CurrentUser, extending User. */
export type CurrentUser = {
  __typename?: 'CurrentUser';
  attributes: UserAttributes;
  id: Scalars['ID'];
  refresh?: Maybe<Scalars['String']>;
  session?: Maybe<Scalars['String']>;
  type: Scalars['String'];
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
  links?: Maybe<MangaLinksData>;
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
  chapterAddProgress?: Maybe<ReadingHistory>;
  loginUser?: Maybe<Token>;
  logout: Scalars['Boolean'];
};


export type MutationChapterAddProgressArgs = {
  chapterUuid?: Maybe<Scalars['String']>;
  mangaUuid?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  complete?: Maybe<Scalars['Boolean']>;
};


export type MutationLoginUserArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};

/** A basic instance of a Person. */
export type Person = {
  __typename?: 'Person';
  attributes: PersonAttributes;
  id: Scalars['ID'];
  type: Scalars['String'];
};

export type PersonAttributes = {
  __typename?: 'PersonAttributes';
  createdAt: Scalars['ISO8601DateTime'];
  imageUrl?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  updatedAt: Scalars['ISO8601DateTime'];
  version: Scalars['Int'];
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
  chapterHistory?: Maybe<ReadingHistory>;
  chapters: Array<Chapter>;
  chaptersReadingStatus?: Maybe<Array<ReadingHistory>>;
  continueReading?: Maybe<Chapter>;
  currentUser?: Maybe<CurrentUser>;
  currentlyReading?: Maybe<Array<ReadingHistory>>;
  /** Find a manga by ID. */
  manga?: Maybe<SingleManga>;
  /** List manga */
  mangas: Array<Manga>;
};


export type QueryChapterArgs = {
  id: Scalars['String'];
};


export type QueryChapterHistoryArgs = {
  chapterUuid: Scalars['String'];
};


export type QueryChaptersArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  manga?: Maybe<Array<Scalars['String']>>;
  ids?: Maybe<Array<Scalars['String']>>;
  title?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Scalars['String']>>;
  volume?: Maybe<Array<Scalars['String']>>;
  chapter?: Maybe<Array<Scalars['String']>>;
  translatedLanguage?: Maybe<Array<Scalars['String']>>;
};


export type QueryChaptersReadingStatusArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryContinueReadingArgs = {
  mangaUuid: Scalars['ID'];
};


export type QueryMangaArgs = {
  id: Scalars['String'];
  coverParams?: Maybe<CoverOptions>;
  coverSize?: Maybe<CoverSize>;
  translatedLanguage?: Maybe<Array<Scalars['String']>>;
  chapterParams?: Maybe<ChapterOptions>;
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

/** A basic instance of a ReadingHistory (a relationship of manga, chapter and user). */
export type ReadingHistory = {
  __typename?: 'ReadingHistory';
  chapterUuid: Scalars['ID'];
  complete: Scalars['Boolean'];
  id: Scalars['ID'];
  mangaUuid: Scalars['ID'];
  page: Scalars['Int'];
};

/** An instance of a single chapter. Used when fetching a chapter by ID. */
export type SingleChapter = {
  __typename?: 'SingleChapter';
  attributes: ChapterAttributes;
  id: Scalars['ID'];
  mangaId: Scalars['ID'];
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
  chaptersCount: Scalars['Int'];
  covers?: Maybe<Array<Cover>>;
  id: Scalars['ID'];
  people: Array<Person>;
  type: Scalars['String'];
  volumes?: Maybe<Array<Scalars['String']>>;
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

export type Token = {
  __typename?: 'Token';
  refresh: Scalars['String'];
  session: Scalars['String'];
};

export type UserAttributes = {
  __typename?: 'UserAttributes';
  username: Scalars['String'];
  version: Scalars['Int'];
};

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = (
  { __typename?: 'Query' }
  & { currentUser?: Maybe<(
    { __typename?: 'CurrentUser' }
    & Pick<CurrentUser, 'id' | 'type' | 'refresh' | 'session'>
    & { attributes: (
      { __typename?: 'UserAttributes' }
      & Pick<UserAttributes, 'username' | 'version'>
    ) }
  )> }
);

export type LoginUserMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginUserMutation = (
  { __typename?: 'Mutation' }
  & { loginUser?: Maybe<(
    { __typename?: 'Token' }
    & Pick<Token, 'refresh' | 'session'>
  )> }
);

export type GetCurrentReadingQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentReadingQueryQuery = (
  { __typename?: 'Query' }
  & { currentlyReading?: Maybe<Array<(
    { __typename?: 'ReadingHistory' }
    & Pick<ReadingHistory, 'id' | 'mangaUuid' | 'chapterUuid' | 'complete' | 'page'>
  )>> }
);

export type GetHomePageQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset: Scalars['Int'];
}>;


export type GetHomePageQuery = (
  { __typename?: 'Query' }
  & { mangas: Array<(
    { __typename?: 'Manga' }
    & Pick<Manga, 'id' | 'type'>
    & { covers?: Maybe<Array<(
      { __typename?: 'Cover' }
      & Pick<Cover, 'id' | 'type' | 'url'>
      & { attributes: (
        { __typename?: 'CoverAttributes' }
        & Pick<CoverAttributes, 'volume' | 'fileName' | 'description' | 'version' | 'createdAt' | 'updatedAt'>
      ) }
    )>>, attributes: (
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
      )>, links?: Maybe<(
        { __typename?: 'MangaLinksData' }
        & Pick<MangaLinksData, 'al' | 'nu' | 'raw' | 'amz' | 'ap' | 'bw' | 'cdj' | 'ebj' | 'engl' | 'kt' | 'mal' | 'mu'>
      )> }
    ) }
  )> }
);

export type GetSearchMangaQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  authors?: Maybe<Array<Scalars['String']> | Scalars['String']>;
  artists?: Maybe<Array<Scalars['String']> | Scalars['String']>;
  year?: Maybe<Scalars['Int']>;
  includedTags?: Maybe<Array<Scalars['String']> | Scalars['String']>;
  includedTagsMode?: Maybe<TagMode>;
  excludedTags?: Maybe<Array<Scalars['String']> | Scalars['String']>;
  excludedTagsMode?: Maybe<TagMode>;
  status?: Maybe<Array<Status> | Status>;
  originalLanguage?: Maybe<Array<Scalars['String']> | Scalars['String']>;
  ids?: Maybe<Array<Scalars['String']> | Scalars['String']>;
  contentRating?: Maybe<Array<ContentRating> | ContentRating>;
}>;


export type GetSearchMangaQuery = (
  { __typename?: 'Query' }
  & { mangas: Array<(
    { __typename?: 'Manga' }
    & Pick<Manga, 'id' | 'type'>
    & { covers?: Maybe<Array<(
      { __typename?: 'Cover' }
      & Pick<Cover, 'id' | 'type' | 'url'>
      & { attributes: (
        { __typename?: 'CoverAttributes' }
        & Pick<CoverAttributes, 'volume' | 'fileName' | 'description' | 'version' | 'createdAt' | 'updatedAt'>
      ) }
    )>>, attributes: (
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
      )>, links?: Maybe<(
        { __typename?: 'MangaLinksData' }
        & Pick<MangaLinksData, 'al' | 'nu' | 'raw' | 'amz' | 'ap' | 'bw' | 'cdj' | 'ebj' | 'engl' | 'kt' | 'mal' | 'mu'>
      )> }
    ) }
  )> }
);

export type ChapterAddProgressMutationVariables = Exact<{
  chapterUuid: Scalars['String'];
  mangaUuid: Scalars['String'];
  page?: Maybe<Scalars['Int']>;
  complete?: Maybe<Scalars['Boolean']>;
}>;


export type ChapterAddProgressMutation = (
  { __typename?: 'Mutation' }
  & { chapterAddProgress?: Maybe<(
    { __typename?: 'ReadingHistory' }
    & Pick<ReadingHistory, 'id' | 'chapterUuid' | 'mangaUuid' | 'page' | 'complete'>
  )> }
);

export type GetChapterQueryVariables = Exact<{
  id: Scalars['String'];
  dataSaver?: Maybe<Scalars['Boolean']>;
}>;


export type GetChapterQuery = (
  { __typename?: 'Query' }
  & { chapter?: Maybe<(
    { __typename?: 'SingleChapter' }
    & Pick<SingleChapter, 'id' | 'type' | 'mangaId'>
    & { attributes: (
      { __typename?: 'ChapterAttributes' }
      & Pick<ChapterAttributes, 'title' | 'translatedLanguage' | 'chapter' | 'chapterHash' | 'data' | 'dataSaver' | 'version' | 'volume' | 'createdAt' | 'updatedAt' | 'publishAt'>
    ), pages: Array<(
      { __typename?: 'ChapterPage' }
      & Pick<ChapterPage, 'url' | 'expiresAt'>
    )> }
  )> }
);

export type GetChapterReadingStatusesQueryQueryVariables = Exact<{
  ids: Array<Scalars['ID']> | Scalars['ID'];
}>;


export type GetChapterReadingStatusesQueryQuery = (
  { __typename?: 'Query' }
  & { chaptersReadingStatus?: Maybe<Array<(
    { __typename?: 'ReadingHistory' }
    & Pick<ReadingHistory, 'id' | 'chapterUuid' | 'mangaUuid' | 'complete' | 'page'>
  )>> }
);

export type GetContinueReadingChapterQueryVariables = Exact<{
  mangaId: Scalars['ID'];
}>;


export type GetContinueReadingChapterQuery = (
  { __typename?: 'Query' }
  & { continueReading?: Maybe<(
    { __typename?: 'Chapter' }
    & Pick<Chapter, 'id' | 'mangaId' | 'type'>
    & { attributes: (
      { __typename?: 'ChapterAttributes' }
      & Pick<ChapterAttributes, 'chapter' | 'chapterHash' | 'createdAt' | 'data' | 'dataSaver' | 'publishAt' | 'title' | 'translatedLanguage' | 'uploader' | 'updatedAt' | 'version' | 'volume'>
    ) }
  )> }
);

export type GetMangaQueryVariables = Exact<{
  id: Scalars['String'];
  chapterLimit?: Maybe<Scalars['Int']>;
  chapterOffset?: Maybe<Scalars['Int']>;
  translatedLanguage?: Maybe<Array<Scalars['String']> | Scalars['String']>;
  chaptersForVolume?: Maybe<Scalars['String']>;
}>;


export type GetMangaQuery = (
  { __typename?: 'Query' }
  & { manga?: Maybe<(
    { __typename?: 'SingleManga' }
    & Pick<SingleManga, 'id' | 'type' | 'chaptersCount'>
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
      )>, links?: Maybe<(
        { __typename?: 'MangaLinksData' }
        & Pick<MangaLinksData, 'al' | 'nu' | 'raw' | 'amz' | 'ap' | 'bw' | 'cdj' | 'ebj' | 'engl' | 'kt' | 'mal' | 'mu'>
      )> }
    ), covers?: Maybe<Array<(
      { __typename?: 'Cover' }
      & Pick<Cover, 'id' | 'url' | 'type'>
      & { attributes: (
        { __typename?: 'CoverAttributes' }
        & Pick<CoverAttributes, 'volume' | 'fileName' | 'description' | 'version' | 'createdAt' | 'updatedAt'>
      ) }
    )>>, chapters: Array<(
      { __typename?: 'Chapter' }
      & Pick<Chapter, 'id' | 'type' | 'mangaId'>
      & { attributes: (
        { __typename?: 'ChapterAttributes' }
        & Pick<ChapterAttributes, 'chapter' | 'version' | 'chapterHash' | 'data' | 'dataSaver' | 'title' | 'translatedLanguage' | 'uploader' | 'volume' | 'createdAt' | 'updatedAt' | 'publishAt'>
      ) }
    )>, people: Array<(
      { __typename?: 'Person' }
      & Pick<Person, 'id' | 'type'>
      & { attributes: (
        { __typename?: 'PersonAttributes' }
        & Pick<PersonAttributes, 'name' | 'imageUrl' | 'createdAt' | 'updatedAt' | 'version'>
      ) }
    )> }
  )> }
);


export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  currentUser {
    id
    type
    attributes {
      username
      version
    }
    refresh
    session
  }
}
    `;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const LoginUserDocument = gql`
    mutation LoginUser($username: String!, $password: String!) {
  loginUser(username: $username, password: $password) {
    refresh
    session
  }
}
    `;
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const GetCurrentReadingQueryDocument = gql`
    query GetCurrentReadingQuery {
  currentlyReading {
    id
    mangaUuid
    chapterUuid
    complete
    page
  }
}
    `;

/**
 * __useGetCurrentReadingQueryQuery__
 *
 * To run a query within a React component, call `useGetCurrentReadingQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentReadingQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentReadingQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentReadingQueryQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentReadingQueryQuery, GetCurrentReadingQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentReadingQueryQuery, GetCurrentReadingQueryQueryVariables>(GetCurrentReadingQueryDocument, options);
      }
export function useGetCurrentReadingQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentReadingQueryQuery, GetCurrentReadingQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentReadingQueryQuery, GetCurrentReadingQueryQueryVariables>(GetCurrentReadingQueryDocument, options);
        }
export type GetCurrentReadingQueryQueryHookResult = ReturnType<typeof useGetCurrentReadingQueryQuery>;
export type GetCurrentReadingQueryLazyQueryHookResult = ReturnType<typeof useGetCurrentReadingQueryLazyQuery>;
export type GetCurrentReadingQueryQueryResult = Apollo.QueryResult<GetCurrentReadingQueryQuery, GetCurrentReadingQueryQueryVariables>;
export const GetHomePageDocument = gql`
    query GetHomePage($limit: Int!, $offset: Int!) {
  mangas(limit: $limit, offset: $offset) {
    id
    type
    covers {
      id
      type
      url
      attributes {
        volume
        fileName
        description
        version
        createdAt
        updatedAt
      }
    }
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
  }
}
    `;

/**
 * __useGetHomePageQuery__
 *
 * To run a query within a React component, call `useGetHomePageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHomePageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHomePageQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetHomePageQuery(baseOptions: Apollo.QueryHookOptions<GetHomePageQuery, GetHomePageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetHomePageQuery, GetHomePageQueryVariables>(GetHomePageDocument, options);
      }
export function useGetHomePageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetHomePageQuery, GetHomePageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetHomePageQuery, GetHomePageQueryVariables>(GetHomePageDocument, options);
        }
export type GetHomePageQueryHookResult = ReturnType<typeof useGetHomePageQuery>;
export type GetHomePageLazyQueryHookResult = ReturnType<typeof useGetHomePageLazyQuery>;
export type GetHomePageQueryResult = Apollo.QueryResult<GetHomePageQuery, GetHomePageQueryVariables>;
export const GetSearchMangaDocument = gql`
    query GetSearchManga($limit: Int, $offset: Int, $title: String, $authors: [String!], $artists: [String!], $year: Int, $includedTags: [String!], $includedTagsMode: TagMode, $excludedTags: [String!], $excludedTagsMode: TagMode, $status: [Status!], $originalLanguage: [String!], $ids: [String!], $contentRating: [ContentRating!]) {
  mangas(
    limit: $limit
    offset: $offset
    title: $title
    authors: $authors
    artists: $artists
    year: $year
    includedTags: $includedTags
    includedTagsMode: $includedTagsMode
    excludedTags: $excludedTags
    excludedTagsMode: $excludedTagsMode
    status: $status
    originalLanguage: $originalLanguage
    ids: $ids
    contentRating: $contentRating
  ) {
    id
    type
    covers {
      id
      type
      url
      attributes {
        volume
        fileName
        description
        version
        createdAt
        updatedAt
      }
    }
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
  }
}
    `;

/**
 * __useGetSearchMangaQuery__
 *
 * To run a query within a React component, call `useGetSearchMangaQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSearchMangaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSearchMangaQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      title: // value for 'title'
 *      authors: // value for 'authors'
 *      artists: // value for 'artists'
 *      year: // value for 'year'
 *      includedTags: // value for 'includedTags'
 *      includedTagsMode: // value for 'includedTagsMode'
 *      excludedTags: // value for 'excludedTags'
 *      excludedTagsMode: // value for 'excludedTagsMode'
 *      status: // value for 'status'
 *      originalLanguage: // value for 'originalLanguage'
 *      ids: // value for 'ids'
 *      contentRating: // value for 'contentRating'
 *   },
 * });
 */
export function useGetSearchMangaQuery(baseOptions?: Apollo.QueryHookOptions<GetSearchMangaQuery, GetSearchMangaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSearchMangaQuery, GetSearchMangaQueryVariables>(GetSearchMangaDocument, options);
      }
export function useGetSearchMangaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSearchMangaQuery, GetSearchMangaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSearchMangaQuery, GetSearchMangaQueryVariables>(GetSearchMangaDocument, options);
        }
export type GetSearchMangaQueryHookResult = ReturnType<typeof useGetSearchMangaQuery>;
export type GetSearchMangaLazyQueryHookResult = ReturnType<typeof useGetSearchMangaLazyQuery>;
export type GetSearchMangaQueryResult = Apollo.QueryResult<GetSearchMangaQuery, GetSearchMangaQueryVariables>;
export const ChapterAddProgressDocument = gql`
    mutation ChapterAddProgress($chapterUuid: String!, $mangaUuid: String!, $page: Int, $complete: Boolean) {
  chapterAddProgress(
    chapterUuid: $chapterUuid
    mangaUuid: $mangaUuid
    page: $page
    complete: $complete
  ) {
    id
    chapterUuid
    mangaUuid
    page
    complete
  }
}
    `;
export type ChapterAddProgressMutationFn = Apollo.MutationFunction<ChapterAddProgressMutation, ChapterAddProgressMutationVariables>;

/**
 * __useChapterAddProgressMutation__
 *
 * To run a mutation, you first call `useChapterAddProgressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChapterAddProgressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chapterAddProgressMutation, { data, loading, error }] = useChapterAddProgressMutation({
 *   variables: {
 *      chapterUuid: // value for 'chapterUuid'
 *      mangaUuid: // value for 'mangaUuid'
 *      page: // value for 'page'
 *      complete: // value for 'complete'
 *   },
 * });
 */
export function useChapterAddProgressMutation(baseOptions?: Apollo.MutationHookOptions<ChapterAddProgressMutation, ChapterAddProgressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChapterAddProgressMutation, ChapterAddProgressMutationVariables>(ChapterAddProgressDocument, options);
      }
export type ChapterAddProgressMutationHookResult = ReturnType<typeof useChapterAddProgressMutation>;
export type ChapterAddProgressMutationResult = Apollo.MutationResult<ChapterAddProgressMutation>;
export type ChapterAddProgressMutationOptions = Apollo.BaseMutationOptions<ChapterAddProgressMutation, ChapterAddProgressMutationVariables>;
export const GetChapterDocument = gql`
    query GetChapter($id: String!, $dataSaver: Boolean) {
  chapter(id: $id) {
    id
    type
    mangaId
    attributes {
      title
      translatedLanguage
      chapter
      chapterHash
      data
      dataSaver
      version
      volume
      createdAt
      updatedAt
      publishAt
    }
    pages(dataSaver: $dataSaver) {
      url
      expiresAt
    }
  }
}
    `;

/**
 * __useGetChapterQuery__
 *
 * To run a query within a React component, call `useGetChapterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChapterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChapterQuery({
 *   variables: {
 *      id: // value for 'id'
 *      dataSaver: // value for 'dataSaver'
 *   },
 * });
 */
export function useGetChapterQuery(baseOptions: Apollo.QueryHookOptions<GetChapterQuery, GetChapterQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChapterQuery, GetChapterQueryVariables>(GetChapterDocument, options);
      }
export function useGetChapterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChapterQuery, GetChapterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChapterQuery, GetChapterQueryVariables>(GetChapterDocument, options);
        }
export type GetChapterQueryHookResult = ReturnType<typeof useGetChapterQuery>;
export type GetChapterLazyQueryHookResult = ReturnType<typeof useGetChapterLazyQuery>;
export type GetChapterQueryResult = Apollo.QueryResult<GetChapterQuery, GetChapterQueryVariables>;
export const GetChapterReadingStatusesQueryDocument = gql`
    query GetChapterReadingStatusesQuery($ids: [ID!]!) {
  chaptersReadingStatus(ids: $ids) {
    id
    chapterUuid
    mangaUuid
    complete
    page
  }
}
    `;

/**
 * __useGetChapterReadingStatusesQueryQuery__
 *
 * To run a query within a React component, call `useGetChapterReadingStatusesQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChapterReadingStatusesQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChapterReadingStatusesQueryQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useGetChapterReadingStatusesQueryQuery(baseOptions: Apollo.QueryHookOptions<GetChapterReadingStatusesQueryQuery, GetChapterReadingStatusesQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChapterReadingStatusesQueryQuery, GetChapterReadingStatusesQueryQueryVariables>(GetChapterReadingStatusesQueryDocument, options);
      }
export function useGetChapterReadingStatusesQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChapterReadingStatusesQueryQuery, GetChapterReadingStatusesQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChapterReadingStatusesQueryQuery, GetChapterReadingStatusesQueryQueryVariables>(GetChapterReadingStatusesQueryDocument, options);
        }
export type GetChapterReadingStatusesQueryQueryHookResult = ReturnType<typeof useGetChapterReadingStatusesQueryQuery>;
export type GetChapterReadingStatusesQueryLazyQueryHookResult = ReturnType<typeof useGetChapterReadingStatusesQueryLazyQuery>;
export type GetChapterReadingStatusesQueryQueryResult = Apollo.QueryResult<GetChapterReadingStatusesQueryQuery, GetChapterReadingStatusesQueryQueryVariables>;
export const GetContinueReadingChapterDocument = gql`
    query GetContinueReadingChapter($mangaId: ID!) {
  continueReading(mangaUuid: $mangaId) {
    id
    mangaId
    type
    attributes {
      chapter
      chapterHash
      createdAt
      data
      dataSaver
      publishAt
      title
      translatedLanguage
      uploader
      updatedAt
      version
      volume
    }
  }
}
    `;

/**
 * __useGetContinueReadingChapterQuery__
 *
 * To run a query within a React component, call `useGetContinueReadingChapterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetContinueReadingChapterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetContinueReadingChapterQuery({
 *   variables: {
 *      mangaId: // value for 'mangaId'
 *   },
 * });
 */
export function useGetContinueReadingChapterQuery(baseOptions: Apollo.QueryHookOptions<GetContinueReadingChapterQuery, GetContinueReadingChapterQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetContinueReadingChapterQuery, GetContinueReadingChapterQueryVariables>(GetContinueReadingChapterDocument, options);
      }
export function useGetContinueReadingChapterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetContinueReadingChapterQuery, GetContinueReadingChapterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetContinueReadingChapterQuery, GetContinueReadingChapterQueryVariables>(GetContinueReadingChapterDocument, options);
        }
export type GetContinueReadingChapterQueryHookResult = ReturnType<typeof useGetContinueReadingChapterQuery>;
export type GetContinueReadingChapterLazyQueryHookResult = ReturnType<typeof useGetContinueReadingChapterLazyQuery>;
export type GetContinueReadingChapterQueryResult = Apollo.QueryResult<GetContinueReadingChapterQuery, GetContinueReadingChapterQueryVariables>;
export const GetMangaDocument = gql`
    query GetManga($id: String!, $chapterLimit: Int, $chapterOffset: Int, $translatedLanguage: [String!], $chaptersForVolume: String) {
  manga(
    id: $id
    coverSize: thumb512
    chapterParams: {limit: $chapterLimit, offset: $chapterOffset, translatedLanguage: $translatedLanguage, volume: $chaptersForVolume}
  ) {
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
    chaptersCount
    chapters {
      id
      type
      mangaId
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
    people {
      id
      type
      attributes {
        name
        imageUrl
        createdAt
        updatedAt
        version
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
 *      chapterLimit: // value for 'chapterLimit'
 *      chapterOffset: // value for 'chapterOffset'
 *      translatedLanguage: // value for 'translatedLanguage'
 *      chaptersForVolume: // value for 'chaptersForVolume'
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
    