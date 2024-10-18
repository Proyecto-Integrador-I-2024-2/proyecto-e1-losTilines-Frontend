import { Card, Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { SearchBar, SpinnerCustom } from "@/widgets/layout";
import { useQueryParams } from "@/hooks";
import { useWorkers } from "@/hooks/workers";
function Workers() {
  /*------------------------------------------------*/

  //Utils

  const { getParams, setParams } = useQueryParams();

  /*------------------------------------------------*/

  //Search states

  const [searchTerm, setSearchTerm] = useState(""); // This state is used for the search input.
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm); //This state is used to prevent unnecesary filters while  you areatyping

  /*------------------------------------------------*/

  //Fetch data

  const filters = Object.fromEntries(getParams()); // Get the query params from the URL

  console.log("Query params: ", filters);

  const {
    data: workers,
    error,
    isLoading: isLoadingWorkers,
    isError,
  } = useWorkers(filters, {
    onSuccess: (data) => {
      console.log("Fetch data done succesfully:", data);
    },
    onError: (error) => {
      console.error("Error fetching workers:", error);
    },
  });

  return (
    <Card className="flex  flex-col items-center h-full w-full p-2 md:w-8/12 md:mx-auto md:my-4">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
        <Button variant="text" className="p-1" onClick={() => {}}>
          Sort by name
        </Button>

        <Button variant="text" onClick={() => {}}>
          Create Worker
        </Button>
      </SearchBar>

      <main className="flex flex-col h-full w-full mt-2   overflow-y-auto">
        {isLoadingWorkers ? (
          <SpinnerCustom />

        ) : (

          console.log("Workers: ", workers)

        )}
      </main>
    </Card>
  );
}

export default Workers;
