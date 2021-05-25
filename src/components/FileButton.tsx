import { Button, ButtonProps } from "@material-ui/core";
import { PropsWithChildren } from "react";

interface BaseProps extends Pick<ButtonProps, "variant" | "color" | "size"> {
  multiple: boolean | null;
  onCancel?: VoidFunction;
}

interface SingleFileProps extends BaseProps {
  multiple: false | null;
  onFileChange: (file: File) => void;
}

interface MultipleFilesProps extends BaseProps {
  multiple: true;
  onFileChange: (files: FileList) => void;
}

type Props = SingleFileProps | MultipleFilesProps;

export function FileButton(props: PropsWithChildren<Props>) {
  return (
    <Button
      variant={props.variant}
      color={props.color}
      size={props.size}
      component="label"
    >
      {props.children}
      <input
        hidden
        multiple={props.multiple || false}
        type="file"
        onChange={(event) => {
          const files = event.target.files;
          if (!files) {
            if (props.onCancel) {
              props.onCancel();
            }
            return;
          }
          if (props.multiple) {
            props.onFileChange(files);
          } else {
            props.onFileChange(files[0]);
          }
        }}
      />
    </Button>
  );
}
