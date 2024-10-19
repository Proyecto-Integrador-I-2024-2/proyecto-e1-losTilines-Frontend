import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Avatar,
  Typography,
  Input,
} from "@material-tailwind/react";
import { SearchBar, SpinnerCustom } from "@/widgets/layout";
import { useQueryParams } from "@/hooks";
import { useWorkers } from "@/hooks/workers";
import { ListCollapseGeneral } from "@/widgets/list";
import { useAreas } from "@/hooks/areas";
import { EditWorkerPopup } from "@/widgets/workersWidgets";

function Workers() {
  /*------------------------------------------------*/

  // Utils
  const { getParams, setParams } = useQueryParams();

  /*------------------------------------------------*/

  // Search states
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm); // Debounced search term

  /*------------------------------------------------*/
  const [areaNameAndId, setAreaNameAndId] = useState([]); // Stores name and id of areas

  const [selectedValue, setSelectedValue] = useState(""); // Selected area value

  const [selectedWorker, setSelectedWorker] = useState(); // Gets the id of the worker selected for editing

  const [selectedWorkerInfo, setSelectedWorkerInfo] = useState(null); // Has the information of the worker selected for editing

  /*------------------------------------------------*/
  // Popup manager
  const [openPopupEditProfile, setOpenPopupEditProfile] = useState(false); // Edit profile popup
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false); // Confirm delete popup
  const [workerToDelete, setWorkerToDelete] = useState(null); // Worker selected for deletion

  /*------------------------------------------------*/

  // Fetch data
  const filters = Object.fromEntries(getParams()); // Get query params from URL

  // Fetch workers
  const {
    data: workers,
    error,
    isLoading: isLoadingWorkers,
    isError,
  } = useWorkers(filters, {
    onSuccess: (data) => {
      console.log("Fetch data done successfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching workers:", error);
    },
  });

  // Fetch areas to allow selecting an area for a worker
  const { data: areas, isLoading: isLoadingAreas } = useAreas();

  useEffect(() => {
    if (!isLoadingAreas && areas) {
      const getAreaNameAndId = areas.map((area) => {
        return { id: area.id, value: area.name };
      });

      const sortedAreaNameAndId = getAreaNameAndId.sort((a, b) => {
        if (a.value < b.value) {
          return -1;
        }

        if (a.value > b.value) {
          return 1;
        }

        return 0;
      });

      setAreaNameAndId(sortedAreaNameAndId);

      console.log("Area name and id:", getAreaNameAndId);
    }
  }, [isLoadingAreas, areas]);

  /*------------------------------------------------*/

  useEffect(() => {
    console.log("Popup edit profile trigger", openPopupEditProfile);
  }, [openPopupEditProfile]);

  // Worker Selected for editing

  useEffect(() => {
    if (!isLoadingWorkers && workers && selectedWorker !== null) {
      const workerSelected = workers.find(
        (worker) => worker.id === selectedWorker
      );

      setSelectedWorkerInfo(workerSelected);

      console.log("Worker selected for editing:", workerSelected);
    }
  }, [selectedWorker, isLoadingWorkers, workers]);

  console.log("Selected Worker ID:", selectedWorker);
  console.log("Selected Worker Info:", selectedWorkerInfo);

  return (
    <div>
      <Card className="flex flex-col items-center h-full w-full p-2 md:w-8/12 md:mx-auto md:my-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
          <Button variant="text" className="p-1" onClick={() => {}}>
            Sort by name
          </Button>

          <Button variant="text" onClick={() => {}}>
            Create Worker
          </Button>
        </SearchBar>

        <main className="flex flex-col h-full w-full mt-2 overflow-y-auto">
          {isLoadingWorkers || isLoadingAreas ? (
            <SpinnerCustom />
          ) : isError ? (
            <Typography color="red">Error: {error.message}</Typography>
          ) : (
            workers.map((worker) => (
              <ListCollapseGeneral
              key={worker.id}
              rowName={`${worker.first_name} ${worker.last_name}`}
              chipValue1={`Projects: ${worker.projects}`}
              chipValue2={worker.role}
              description={worker.email}
              selectOptions={areaNameAndId}
              setSelectedValue={setSelectedValue}
              selectLabel={"Select an area"}
              setOpenPopup={setOpenPopupEditProfile} 
              setCurrentRow={setSelectedWorker}
              rowId={worker.id}
            />
            ))
          )}
        </main>
      </Card>

      <EditWorkerPopup
        open={openPopupEditProfile}
        setOpen={setOpenPopupEditProfile}
        currentWorker={selectedWorkerInfo ? selectedWorkerInfo : null}
      />
    </div>
  );
}

export default Workers;
