import { Typography, Select, Option } from "@material-tailwind/react";


export function SelectCustom({label, description, options}) {
    
    return ( 
        <div className="flex flex-row items-center justify-center w-full">
        <div className="flex flex-row justify-center w-1/2 mr-2">
          <Typography color="black">{description}</Typography>
        </div>
        <Select  label={`select ${label}`}>
          {options.map((option, index) => (
            <Option key={index}>{option}</Option>
          ))}
        </Select>
      </div>
    );
}

export default SelectCustom;