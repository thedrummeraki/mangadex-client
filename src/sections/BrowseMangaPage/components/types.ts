export type SearchFieldProps<ValueType = any, OtherProps = {}> = {
  value: ValueType;
  onChange: (value: ValueType) => void;
} & OtherProps;
