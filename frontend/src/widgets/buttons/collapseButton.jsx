import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  Typography,
  List,
  Option,
  Select,
} from "@material-tailwind/react";

export function CollapseCustom({ title, children }) {
  return (
    <Popover placement="bottom">
        <PopoverHandler>
          <Button variant="text">{title}</Button>
        </PopoverHandler>
      <PopoverContent className="w-auto  p-0">
        <List>{children}</List>
      </PopoverContent>
    </Popover>
  );
}

export default CollapseCustom;
