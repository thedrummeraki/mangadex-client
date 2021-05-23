import { ReactNode } from "react";

interface BaseProps {
  img: string;
  follow?: boolean | null;
  clickable?: boolean | null;
  explicit?: boolean | null;
  raw?: boolean | null;
  title?: string | null;
  url?: string | null;
  features?: Array<string | null | undefined>;
  icons?: AllowedIcons[];
  onClick?: VoidFunction;
}

interface WithUrlProps extends BaseProps {
  url: string;
  follow?: boolean;
  onClick?: VoidFunction;
}

interface WithOnClickProps extends BaseProps {
  url?: string;
  follow?: null;
  onClick: VoidFunction;
}

interface NotClickable extends BaseProps {
  clickable: false;
  follow?: null | false;
  url?: string | null;
  onClick?: VoidFunction;
}

export type ThumbnailProps = WithOnClickProps | WithUrlProps | NotClickable;

export type AllowedIcons = "play" | "done";
export type AllowedIconsMap = {
  [key in AllowedIcons]: Exclude<NonNullable<ReactNode>, boolean>;
};
