import {
  Link as ReactRouterLink,
  LinkProps as ReactRouterLinkProps,
} from "react-router-dom";
import {
  Link as MaterialLink,
  LinkProps as MaterialLinkProps,
} from "@material-ui/core";
import { openInNewTab } from "utils";

interface ActsAsExternalProps {
  external?: boolean;
}

export type LinkProps = MaterialLinkProps &
  ReactRouterLinkProps &
  ActsAsExternalProps;

export function Link(props: LinkProps) {
  const linkProps = props as Omit<LinkProps, "external">;
  if (props.external) {
    const goToNewTab = () => openInNewTab(props.to.toString());

    return (
      <MaterialLink
        onClick={goToNewTab}
        {...linkProps}
        style={{ cursor: "pointer" }}
      />
    );
  }
  return <MaterialLink component={ReactRouterLink} {...linkProps} />;
}
