import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

interface ComplexOption {
  content: string;
  disabled?: boolean;
  onSelect?: VoidFunction;
}

interface Props {
  options: (string | ComplexOption)[];
  initialSelection?: number;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  onSelection?: (index: number) => void;
}

export default function SplitButton({
  options,
  initialSelection,
  size,
  disabled,
  onSelection,
}: Props) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(
    initialSelection != null ? initialSelection : 0
  );

  const currentOption: string | ComplexOption | undefined = useMemo(
    () => options[selectedIndex],
    [options, selectedIndex]
  );

  console.log("options", options);

  const handleMenuItemClick = useCallback(
    (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
      setSelectedIndex(index);
      setOpen(false);

      if (onSelection) {
        onSelection(index);
      }
    },
    [onSelection]
  );

  useEffect(() => {
    const option = options[selectedIndex];
    if (option && typeof option !== "string" && option.onSelect) {
      option.onSelect();
    }
  }, [options, selectedIndex]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  if (!currentOption) {
    return null;
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="flex-end"
      style={{ width: "auto" }}
    >
      <Grid item xs={12}>
        <ButtonGroup
          variant="contained"
          color="primary"
          ref={anchorRef}
          aria-label="split button"
          size={size}
          disabled={disabled}
        >
          <Button
            onClick={handleToggle}
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            endIcon={<ArrowDropDownIcon />}
            disabled={disabled}
          >
            {typeof currentOption === "string"
              ? currentOption
              : currentOption.content}
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => {
                      const content =
                        typeof option === "string" ? option : option.content;
                      const disabled =
                        typeof option === "string" ? false : option.disabled;

                      return (
                        <MenuItem
                          key={content}
                          disabled={disabled}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {content}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
}
