import { ListRowStructure } from "@/widgets/list";
import { Typography } from "@material-tailwind/react";

export function LeftColumnRows({ setSelectedId, contentInfo }) {
  const role = sessionStorage.getItem("role");

  return (
    <>
      {contentInfo && contentInfo.length > 0 ? (
        contentInfo.map((item, index) => {
          // Definimos las variables que serán pasadas como props
          let rowName;
          let chipValue ;
          let chipValue2 ;

          // Lógica condicional basada en el rol
          if (role === "Business Manager") {
            rowName = item.name;
            chipValue = item.user;

          } else {
            rowName = item.name;
            chipValue = item.budget;
            chipValue2 = item.status;
          }

          return (
            <ListRowStructure
              key={index}
              rowName={rowName}
              chipValue={chipValue}
              chipValue2={chipValue2}
              setSelected={() => setSelectedId(item.id)}
            />
          );
        })
      ) : (
        <div className="flex flex-row justify-center items-center">

        <Typography>
          There aren't elements to show.
        </Typography>


        </div>
            
      )}
    </>
  );
}
