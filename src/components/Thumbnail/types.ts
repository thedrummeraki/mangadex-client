interface BaseProps {
  img: string;
  clickable?: boolean | null;
  raw?: boolean | null;
  title?: string | null;
  url?: string | null;
  features?: Array<string | null | undefined>;
  onClick?: VoidFunction;
}

interface WithUrlProps extends BaseProps {
  url: string;
  onClick?: VoidFunction;
}

interface WithOnClickProps extends BaseProps {
  url?: string;
  onClick: VoidFunction;
}

interface NotClickable extends BaseProps {
  clickable: false;
  url?: string | null;
  onClick?: VoidFunction;
}

export type ThumbnailProps = WithOnClickProps | WithUrlProps | NotClickable;
