
import { Typography } from "@material-tailwind/react";


export function NumberInfo({ description, number }) {
  return (
    <div className="h-full flex flex-col  justify-center items-center    ">
      <Typography>
        {description}
      </Typography>
      <Typography variant="h2" color="blue">
        {number}
      </Typography>
    </div>



  );
}

export default NumberInfo;


