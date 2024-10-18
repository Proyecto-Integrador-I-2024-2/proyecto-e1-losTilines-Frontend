import { useAdminAvailables } from "@/hooks";
import { PopUp } from "@/widgets/popUp";
import { Avatar, Typography, Checkbox } from "@material-tailwind/react";
import { SpinnerCustom } from "@/widgets/layout";
import { useState } from "react";
export function PopUpChangeAreaAdmin({
  currentAdmin,
  openPopup,
  setOpenPopup,
  handleOpenPopUp,
}) {
  const { data: adminsAvailable, isLoading: isLoadingAdminAvailable } =
    useAdminAvailables();


  const [currentAdminInfo, setCurrentAdminInfo] = useState(currentAdmin);

  const [selectedId, setSelectedId] = useState(null); //State to handle the selected available admin

  const handleSelect = (id) => {
    if (selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
      setCurrentAdminInfo(adminsAvailable.find((admin) => admin.id === id));
    }
  };

  const handleChangeAreaAdim = async () => {


    if(selectedId != null ) {

      //Here must go the logic to change the area admin




    }
  }



  const TABLE_HEAD_AVAILABLE_ADMINS = ["Worker", "Area in charge", "Select"];

  return (
    <PopUp
      title={"Area admin selected"}
      submitFunc={{}}
      open={openPopup}
      setOpen={setOpenPopup}
      handleOpen={handleOpenPopUp}
    >
      <main className="flex flex-col w-2/3 items-center justify-start mt-2">
        <Avatar src="/img/people/persona2.avif" size="xxl" />{" "}
        {/*Here must go current admin picture*/}
        <section className="flex flex-col w-full  items-center justify-start my-4 ">
          <Typography color="gray">{`${currentAdminInfo.first_name} ${currentAdminInfo.last_name}`}</Typography>
          <Typography color="gray">{`${currentAdminInfo.email}`}</Typography>
          <div className="w-1/2 mt-4 border-b-2 border-gray-500"></div>
        </section>
        <Typography color="black">Select the area admin to change:</Typography>
        {!isLoadingAdminAvailable ? (
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD_AVAILABLE_ADMINS.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoadingAdminAvailable ? (
                <SpinnerCustom />
              ) : adminsAvailable.length > 0 ? (
                adminsAvailable.map(
                  ({ id, email, first_name, last_name }, index) => {
                    const isLast = index === adminsAvailable.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={id}>
                        <td className={classes}>
                          <div className="flex flex-col ">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {`${first_name} ${last_name}`}
                            </Typography>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {email}
                            </Typography>
                          </div>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {id}
                          </Typography>
                        </td>

                        <td className={classes}>
                        <div className="w-max">
                          <Checkbox
                            checked={selectedId === id}
                            onChange={() => handleSelect(id)}
                          />
                        </div>
                      </td>
                      </tr>
                    );
                  }
                )
              ) : (
                
                <tr >


                  <td colSpan={3} className="text-center my-4">

                  <Typography>No admins available</Typography>

                  </td>

                </tr>
                
                
              )}
            </tbody>
          </table>
        ) : (
          <SpinnerCustom />
        )}
      </main>
    </PopUp>
  );
}
