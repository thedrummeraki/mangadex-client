export interface Chapter {
  id: string;
  type: "chapter";
  attributes: ChapterAttributes;
}

export interface ChapterAttributes {
  title: string;
  volume: number | null;
  chapter: string | null;
  translatedLanguage: string;
  hash: string;
  data: Array<string>;
  dataSaver: Array<string>;
  uploader: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  publishAt: string;
}
