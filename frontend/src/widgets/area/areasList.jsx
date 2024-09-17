import React from "react";
import { List, ListItem, Card, Typography } from "@material-tailwind/react";
 
export function AreaList() {
  const [selected, setSelected] = React.useState(1);
  const setSelectedItem = (value) => setSelected(value);
 
  return (  
        <Card className="w-full h-full mx-2 ">
        <List>
            <ListItem className="flex-row justify-between" selected={selected === 1} onClick={() => setSelectedItem(1)}>
                <div>
                <Typography>
                    Logistic                    
                </Typography>
                <Typography>
                15 / 50 task completed
                </Typography>
            </div>

            <div>
                <Typography>
                    15 Proyectos
                </Typography>

            </div>
        </ListItem>

    
    
      </List>
    </Card>
  );
}

function AreaInfoRow(){

    return (

        <ListItem classname= "flex" selected={selected === 1} onClick={() => setSelectedItem(1)}>

            <div>
        

            </div>
            <div>


            </div>
          
        </ListItem>
    );

}


export default AreaList;