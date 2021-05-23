export interface Cover {
  id: string;
  type: "cover_art";
  attributes: CoverAttributes;
}

export interface CoverAttributes {
  volume: string;
  fileName: string;
  description: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}
