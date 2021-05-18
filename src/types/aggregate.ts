export interface VolumeCount {
  volume: string;
  count: number;
  chapters: Array<ChapterCount>;
}

export interface ChapterCount {
  chapter: number;
  count: number;
}
