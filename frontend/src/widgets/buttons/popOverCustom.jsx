import {
    Popover,
    PopoverHandler,
    PopoverContent,
    Button,
  } from "@material-tailwind/react";
   
export function PopoverCustom({title, content}) {
    return (
    <Popover placement="bottom">
        <PopoverHandler>
          <Button variant="text">{title}</Button>
        </PopoverHandler>
        <PopoverContent className=" w-auto">
            {content}
        </PopoverContent>
      </Popover>
    );
  }

export default PopoverCustom;