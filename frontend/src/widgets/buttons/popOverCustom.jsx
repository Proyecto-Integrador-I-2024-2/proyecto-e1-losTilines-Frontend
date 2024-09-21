import {
    Popover,
    PopoverHandler,
    PopoverContent,
    Button,
  } from "@material-tailwind/react";
   
function PopoverCustom({title, content}) {
    return (
    <Popover placement="bottom">
        <PopoverHandler>
          <Button variant="text">{title}</Button>
        </PopoverHandler>
        <PopoverContent>
            {content}
        </PopoverContent>
      </Popover>
    );
  }

export default PopoverCustom;