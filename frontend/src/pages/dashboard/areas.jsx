import { CollapseCustom, PopoverCustom, SelectCustom } from "@/widgets/buttons";
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { CreateAreaPopUp } from "@/widgets/areaWidgets";
import { ListAreasCollapse } from "@/widgets/areaWidgets";
import { useCustomFethc, useUser } from "@/hooks";
import { SearchBar, SpinnerCustom } from "@/widgets/layout";
import { useEffect, useState, useMemo } from "react";
import apiClient from "@/services/apiClient";

function Areas() {
  const [openCreateaArea, setOpenCreateArea] = useState(false); //This state is for open  the create area popUp

  const [projectsByArea, setProjectsByArea] = useState([]);

  //Search states
  // This state is used for the search input.
  const [searchTerm, setSearchTerm] = useState("");
  //This state is used to prevent unnecesary filters while  you areatyping
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  /*--------------------------------------------*/

  const [sortOrder, setSortOrder] = useState("asc"); // State to handle the sort order

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  /*--------------------------------------------*/

  const { data: user, isLoading: isLoadingUser } = useUser();

  const { data: areas, isLoading: isLoadingAreas } = useCustomFethc(
    "Areas",
    "areas/",
    { company: user?.company },
    { enabled: !!user }
  );

  useEffect(() => {
    //Fetch projects by area

    if (!isLoadingAreas && areas.length > 0) {
      const fetchProjects = async () => {
        const fetchPromises = areas.map((area) => {
          const fetchProject = async () => {
            const { data } = await apiClient.get("projects/", {
              params: { area: area.id },
            });
            return data;
          };
          return fetchProject();
        });

        const projectData = await Promise.all(fetchPromises);

        const projectMap = {};

        areas.forEach((area, index) => {
          projectMap[area.id] = projectData[index];
        });

        setProjectsByArea(projectMap);
      };

      fetchProjects();
    }
  }, [isLoadingAreas]);

  // Logic to search effectevly the areas by searchBar
  /*--------------------------------------------*/

  // Debounce the search term so that it only gives us the final value after the user has stopped typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300 ms de retraso

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  /*--------------------------------------------*/
  // Filter areas by search term and sort them by name

  const filteredAreas = useMemo(() => {
    if (isLoadingAreas || isLoadingUser) return [];
    let result = areas;

    const trimmed = debouncedSearchTerm.trim().toLowerCase();
    if (trimmed) {
      result = result.filter((area) =>
        area.name.toLowerCase().includes(trimmed)
      );
    }

    // Order areas by name.
    result = result.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
      if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [debouncedSearchTerm, areas, sortOrder]);

  /*--------------------------------------------*/

  return (
    <div>
      <Card
        className="flex  flex-col items-center 
      h-full w-full p-2   
      md:w-8/12 md:mx-auto md:my-4"
      >
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
          <Button id="sort" variant="text" className="p-1" onClick={toggleSortOrder}>
            Sort by area name
          </Button>

          <Button
            id="createArea"
            variant="text"
            onClick={() => setOpenCreateArea(!openCreateaArea)}
          >
            Create Area
          </Button>
        </SearchBar>

        <main className="flex flex-col h-full w-full mt-2   overflow-y-auto">
          {isLoadingUser || isLoadingAreas ? (
            <SpinnerCustom />
          ) : (
            filteredAreas.map((area) => (
              <ListAreasCollapse
                key={area.id}
                areaId={area.id}
                title={area.name}
                projects={projectsByArea[area.id]}
                chipValue2={1000000}
                currentAreaAdmin={area.user}
              ></ListAreasCollapse>
            ))
          )}
        </main>
      </Card>

      <CreateAreaPopUp
        open={openCreateaArea}
        setOpen={setOpenCreateArea}
        handleOpen={() => setOpenCreateArea(!openCreateaArea)}
      />
    </div>
  );
}

export default Areas;
