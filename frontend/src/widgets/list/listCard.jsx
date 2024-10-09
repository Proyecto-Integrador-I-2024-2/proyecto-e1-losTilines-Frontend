import React from "react";
import {
  Card,
  Typography,
  Button,
} from "@material-tailwind/react";
export function ListCard({
  title,
  hasSeeAll,
  hasAdd,
  children,
  subtitle,
  addContent
}) {
  const [selected, setSelected] = React.useState(1);
  const setSelectedItem = (value) => setSelected(value);

  return (
    <Card className="w-full h-full flex flex-col">
      <header className="flex flex-col justify-center items-center  sticky my-4">
        <Typography variant="h3" color="black">
          {title}
        </Typography>

        {subtitle && <Typography color="black">{subtitle}</Typography>}
      </header>

      <div className="h-full overflow-auto">{children}</div>

      <div className="flex flex-row justify-center space-x-4 my-4">
        {hasSeeAll && (
          <Button color="gray" size="sm" variant="outlined" onClick={hasSeeAll}>
            See all
          </Button>
        )}
      
        {addContent}

      </div>
    </Card>
  );
}

export default ListCard;
