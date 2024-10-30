import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Button,
  Avatar,
  Typography,
  Input,
} from "@material-tailwind/react";
import { SearchBar, SpinnerCustom } from "@/widgets/layout";
import { useQueryParams, useUser } from "@/hooks";
import { Identifiers, useEditWorker, useWorkers } from "@/hooks/workers";
import { useAreas } from "@/hooks/areas";
import { CreateWorkerPopup, EditWorkerPopup } from "@/widgets/workersWidgets";
import { ListCollapseGeneral } from "@/widgets/workersWidgets";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

function Workers() {
  /*------------------------------------------------*/

  // Utils
  const { getParams, setParams } = useQueryParams();

  /*------------------------------------------------*/

  // Search states
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm); // Used for debouncing the search term

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300 ms de retraso

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  /*------------------------------------------------*/
  const [areaNameAndId, setAreaNameAndId] = useState([]); // Stores name and id of areas

  const [selectedWorker, setSelectedWorker] = useState(); // Gets the id of the worker selected for editing

  const [selectedWorkerInfo, setSelectedWorkerInfo] = useState(null); // Holds information of the selected worker for editing

  /*------------------------------------------------*/
  // Popup manager

  const [openPopupEditProfile, setOpenPopupEditProfile] = useState(false); // Edit profile popup

  const [openCreateWorker, setCreateWorker] = useState(false); // Create worker popup

  /*------------------------------------------------*/

  //Get query params from URL in  object format

  const filters = Object.fromEntries(getParams()); // Get query params from URL

  console.log("Filters:", filters)

  /*------------------------------------------------*/

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

  /*------------------------------------------------*/

  // Filter workers to exclude Business Managers  

  let workersFilteredBM = [];
  if(workers != undefined){

    workersFilteredBM = workers.filter((worker) => worker.role != "Business Manager" && worker.role != null && worker.role != "Freelancer"); 

  }

  /*------------------------------------------------*/

  // Fetch areas to allow selecting an area for a worker

  const { data: user, isLoading: userLoading } = useUser()

  const { data: areas, isLoading: isLoadingAreas, error: areasError } = useQuery(
    [Identifiers.areas, { company: user?.company }],
    async () => {
      // Asegúrate de que `user.company` esté definido

      const { data } = await apiClient.get("areas/", { params: { company: user.company } });
      return data;
    },
    {
      enabled: !!user && !!user.company, // Solo ejecuta la consulta si `user` y `user.company` están definidos
      onSuccess: (data) => {
        console.log("Areas success:", data);
      },
      onError: (error) => {
        console.error("Error while fetching areas:", error);
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 30 * 60 * 1000, // 30 minutos
      retry: 2, 
    }
  );

  console.log("Areas:", areas);
  
  useEffect(() => {
    if (!isLoadingAreas && areas) {
      // Map areas to include id and name
      const getAreaNameAndId = areas.map((area) => {
        return { id: area.id, value: area.name };
      });

      // Sort areas alphabetically by name
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

      console.log("Area name and id:", sortedAreaNameAndId);
    }
  }, [isLoadingAreas, areas]);

  /*------------------------------------------------------------*/

  // Worker Selected for editing

  useEffect(() => {
    if (!isLoadingWorkers && workers && selectedWorker !== null) {
      // Find the selected worker by id
      const workerSelected = workers.find(
        (worker) => worker.id === selectedWorker
      );

      setSelectedWorkerInfo(workerSelected);
    }
  }, [selectedWorker, isLoadingWorkers, workers]);

  /*------------------------------------------------*/

  // Define priority for roles
  const rolePriority = {
    "Business Manager": 1,
    "Project Manager": 2,
    "Area Admin": 3,
    // Add more roles here if needed
  };

  // useMemo to sort workers by role based on defined priority
  const sortedWorkers = useMemo(() => {
    if (!workers) return [];

    // Trim and convert the search term to lowercase for case-insensitive comparison
    const trimmed = debouncedSearchTerm.trim().toLowerCase();

    // Start with the original list of workers
    let filteredWorkers = workersFilteredBM;

    // Apply filtering if there's a search term
    if (trimmed) {
      filteredWorkers = filteredWorkers.filter((worker) => {
        // Extract and lowercase relevant fields
        const firstName = worker.first_name?.trim().toLowerCase() || "";
        const lastName = worker.last_name?.trim().toLowerCase() || "";
        const email = worker.email?.trim().toLowerCase() || "";
        const role = worker.role?.trim().toLowerCase() || "";

        // Check if any of the fields include the search term

        console.log("Worker is BM", worker.role != "Business Manager");

        return (

          worker.role != "Business Manager" && (
          firstName.includes(trimmed) ||
          lastName.includes(trimmed) ||
          email.includes(trimmed) ||
          role.includes(trimmed) )
        );
      });
    }
    // Sort the filtered workers based on role priority and then by name
    return filteredWorkers.sort((a, b) => {
      const priorityA = rolePriority[a.role] || 100; // Assign a high priority number for undefined roles
      const priorityB = rolePriority[b.role] || 100;

      if (priorityA < priorityB) return -1;
      if (priorityA > priorityB) return 1;

      // If roles have the same priority, sort alphabetically by full name
      const nameA = `${a.first_name} ${a.last_name}`.toUpperCase();
      const nameB = `${b.first_name} ${b.last_name}`.toUpperCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }, [workers, debouncedSearchTerm, rolePriority]);
  /*------------------------------------------------*/

  useEffect(() => {
    console.log("Open Create Worker", openCreateWorker);
  }, [openCreateWorker]);

  /*------------------------------------------------*/

  return (
    <div>
      <Card className="flex flex-col items-center h-full w-full p-2 md:w-8/12 md:mx-auto ">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
          {/* 
            Button to create a new worker.
            Currently, the onClick handler is empty and should be implemented as needed.
          */}
          <Button variant="text" onClick={() => setCreateWorker(true)}>
            Create Worker
          </Button>
        </SearchBar>

        <main className="flex flex-col h-full w-full mt-2 overflow-y-auto">
          {isLoadingWorkers || isLoadingAreas ? (
            // Show spinner while loading data
            <SpinnerCustom />
          ) : isError ? (
            // Display error message if there's an error fetching data
            <Typography color="red">Error: {error.message}</Typography>
          ) : (
            // Map through sorted workers and display each worker
            sortedWorkers.map((worker) => (
              <ListCollapseGeneral
                key={worker.id}
                rowName={`${worker.first_name} ${worker.last_name}`}
                chipValue1={`Projects: ${worker.related_projects.length}`}
                chipValue2={worker.role}
                // Set chip color based on role
                colorChip2={
                  worker.role === "Business Manager"
                    ? "indigo"
                    : worker.role === "Area Admin"
                    ? "blue"
                    : "cyan"
                }
                description={worker.email}
                setOpenPopup={setOpenPopupEditProfile}
                setCurrentRow={setSelectedWorker}
                rowId={worker.id}
                imageRow={worker.profile_picture}
              >
                <section className="flex flex-col w-full space-y-2 justify-start items-center mb-6">
                  {/* 
                    Header for the projects summary table.
                    Displays the worker's full name.
                  */}

                  <Typography variant="h6" className="mb-6">
                    Projects in charge
                  </Typography>

                  {/* Generate the table here */}
                  {worker.related_projects &&
                  worker.related_projects.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                      <table className="min-w-full bg-white border ">
                        <thead>
                          <tr>
                            {/* Table headers */}
                            <th className="py-2 px-4 border-b">Project Name</th>
                            <th className="py-2 px-4 border-b">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Map through related_projects to create table rows */}
                          {worker.related_projects.map((project) => (
                            <tr key={project.id} className="text-center">
                              <td className="py-2 px-4 border-b">
                                {project.name}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {project.status === 1 ? "Active" : "Inactive"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    // Display a message if there are no related projects
                    <Typography variant="body1" className="text-gray-500 ">
                      No related projects available.
                    </Typography>
                  )}
                </section>
              </ListCollapseGeneral>
            ))
          )}
        </main>
      </Card>

      {/* 
        Popup component for editing a worker's profile.
        Passes the selected worker's information if available.
      */}
      <EditWorkerPopup
        open={openPopupEditProfile}
        setOpen={setOpenPopupEditProfile}
        currentWorker={selectedWorkerInfo ? selectedWorkerInfo : null}
        areas={areaNameAndId}
      />

      {/*Create Worker Popup */}

      <CreateWorkerPopup
        open={openCreateWorker}
        setOpen={setCreateWorker}
        areas={areaNameAndId}
      />
    </div>
  );
}

export default Workers;
