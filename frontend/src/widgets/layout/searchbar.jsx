import { Input } from "@material-tailwind/react";

export function SearchBar({setSearchTerm, searchTerm, children}) {
  return (
    <header className="flex flex-col w-full h-auto md:flex-row md:justify-between md:items-center  ">
      <section className="w-full md:w-3/4 md:mr-4">
        <Input
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>
      <section className="flex flex-row my-2 md:mt-0 justify-evenly md:justify-between h-10 w-full md:w-auto md:h-full">
        {children}
      </section>
    </header>
  );
}
