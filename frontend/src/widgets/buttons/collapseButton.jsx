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

export function CollapseSelection({ description, title, options, label }) {
  return (
    <Popover placement="bottom">
      <PopoverHandler>
        <Button variant="text">{title}</Button>
      </PopoverHandler>
      <PopoverContent className="w-96 p-0">
        <List>
          <div className="flex flex-row items-center justify-center  ">
            <div className="flex flex-row justify-center w-1/2">
              <Typography color="black">{description}</Typography>
            </div>
            <Select label={`select ${label}`}>
              {options.map((option, index) => (
                <Option key={index}>{option}</Option>
              ))}
            </Select>
          </div>
        </List>
      </PopoverContent>
    </Popover>
  );
}

export default CollapseSelection;
