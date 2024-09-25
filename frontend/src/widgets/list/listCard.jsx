import React from "react";
import {
  List,
  ListItem,
  Card,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Link } from 'react-router-dom';
export function ListCard({
  numberOfItems,
  title,
  hasSeeAll,
  hasAdd,
  newDialog,
  seeAllButton,
  children,
  route
}) {
  const [selected, setSelected] = React.useState(1);
  const setSelectedItem = (value) => setSelected(value);

  const items = Array.from({ length: numberOfItems }, (_, index) => index + 1);

  return (
    <Card className="w-full h-full flex flex-col">
      <div className="mx-auto sticky my-4">
        <Typography variant="h3" color="black">
          {title}
        </Typography>
      </div>
      <div className="h-full overflow-auto">
        {children}
      </div>

      <div className="flex flex-row justify-center space-x-4 my-4">
        {hasSeeAll && (
          <Link to={route}>

            <Button color="gray" size="sm" variant="outlined">
              See all
            </Button>

          </Link>


        )}

        {hasAdd && (
          newDialog
        )}
      </div>
    </Card >
  );
}



export default ListCard;
