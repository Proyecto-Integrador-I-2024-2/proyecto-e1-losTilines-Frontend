import React from "react";
import {
  List,
  ListItem,
  Card,
  Typography,
  Button,
} from "@material-tailwind/react";

export function ListCard({
  numberOfItems,
  title,
  hasSeeAll,
  hasAdd, 
  addDescription,
  children
}) {
  const [selected, setSelected] = React.useState(1);
  const setSelectedItem = (value) => setSelected(value);

  const items = Array.from({ length: numberOfItems }, (_, index) => index + 1);

  return (
    <Card className="w-full h-full flex flex-col">
      <div className="mx-auto sticky my-4">
        <Typography variant="h2" color="black">
          {title}
        </Typography>
      </div>
      <div className="h-5/6 overflow-auto">
        <List>
          {children}
        </List>
      </div>

      <div className="flex flex-row justify-center space-x-4 my-4">
        {hasSeeAll && (
          <Button color="gray" size="sm" variant="outlined">
            See all
          </Button>
        )}

        {hasAdd && (
          <Button color="gray" size="sm">
            {addDescription}
          </Button>
        )}
      </div>
    </Card>
  );
}

function AreaInfoRow() {
  return (
    <ListItem
      classname="flex"
      selected={selected === 1}
      onClick={() => setSelectedItem(1)}
    >
      <div></div>
      <div></div>
    </ListItem>
  );
}

export default ListCard;
