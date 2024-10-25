import { ListRowWithImage } from "@/widgets/list";
import { Typography } from "@material-tailwind/react";
export function MidColumnRows({ contentInfo }) {
  const role = sessionStorage.getItem("role");

  return (
    <>
      {contentInfo && contentInfo.length > 0 ? (
        contentInfo.map((item, index) => {
          // Definimos las variables que serán pasadas como props
          let rowName;
          let avatar;
          let description;
          let chipValue1;

          // Lógica condicional basada en el rol
          if (role === "Business Manager" || role === "Area Admin") {
            rowName = `${item.first_name} ${item.last_name}`;
            avatar = item.profile_picture || "/img/people/noProfile1.jpg" ;
            description = item.email;
            chipValue1 = item.role;
          }

          if (role === "Project Manager") {
            rowName = "";
            avatar = "";
            description = "";
            chipValue1 = "";
          }

          if (role === "Freelancer") {
            rowName = "";
            avatar = "";
            description = "";
            chipValue1 = "";
          }

          return (
            <ListRowWithImage
              avatar={avatar}
              rowName={rowName}
              description={description}
              chipValue={chipValue1}
            />
          );
        })
      ) : (
        <div className="flex flex-row justify-center items-center">
          <Typography>There aren't elements to show.</Typography>
        </div>
      )}
    </>
  );
}
