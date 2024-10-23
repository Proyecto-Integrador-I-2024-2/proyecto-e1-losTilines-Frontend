import React, { useEffect } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { Link } from "react-router-dom"; // Importa Link


function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);



  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        placement="bottom"
        allowHover={true}
      >
        <MenuList className="hidden rounded-xl lg:block">

          <MenuItem>React</MenuItem>
          <MenuItem>Freelance Now</MenuItem>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>
          <Menu
            placement="bottom"
            allowHover
            offset={6}
            open={{}}
            handler={{}}
          >
            <MenuHandler className="flex items-center justify-between">
              <MenuItem>
                Figma
                <ChevronUpIcon
                  strokeWidth={2.5}
                  className={`h-3.5 w-3.5 transition-transform ${isMenuOpen ? "rotate-90" : ""
                    }`}
                />
              </MenuItem>
            </MenuHandler>

          </Menu>
          <MenuItem>React</MenuItem>
          <MenuItem>TailwindCSS</MenuItem>
        </Collapse>
      </div>
    </React.Fragment>
  );
}

function NavList() {
  const navigate = useNavigate(); // Obtén la función navigate

  return (
    <List className="mb-6 mt-4 p-0 lg:mb-0 lg:mt-0 lg:flex-row lg:p-1">
      <Typography
        as="a"
        variant="small"
        color="blue-gray"
        className="font-medium cursor-pointer"
        onClick={() => navigate('/profile')} // Redirige a la URL de Home
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">Profile</ListItem>
      </Typography>
      <Typography
        as="a"
        variant="small"
        color="blue-gray"
        className="font-medium cursor-pointer"
        onClick={() => navigate('/dashboard')} // Redirige a la URL de Dashboard
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4" >
          Dashboard
        </ListItem>
      </Typography>

      <Typography
        as="a"
        variant="small"
        color="blue-gray"
        className="font-medium cursor-pointer"
        onClick={() => navigate('/project/')} // Redirige a la URL de Home
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">Projects</ListItem>
      </Typography>
      <NavListMenu />

    </List>
  );
}

export function NavigationTopBar() {
  const [openNav, setOpenNav] = React.useState(false);
  const navigate = useNavigate(); // Obtén la función navigate
  const token = sessionStorage.getItem("token");

  function handleLogOut() {
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem("token");
    navigate("/");
  }
  function handleLogIn() {
    navigate("/auth/sign-in");
  }

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  return (
    <Navbar className="mx-auto max-w-full px-4 py-2">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Link to="/">
          <Typography
            variant="h6"
            className="mr-4 cursor-pointer py-1.5 lg:ml-2"
          >
            Freelance Now
          </Typography>
        </Link>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <div className="hidden gap-2 lg:flex">
          <Button variant="outlined" size="sm" onClick={token ? handleLogOut : handleLogIn}>Log {token ? "out" : "in"}</Button> {/* Redirige a /login */}
        </div>
        <IconButton
          variant="text"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
        <div className="flex w-full flex-nowrap items-center gap-2 lg:hidden">
          <Button size="sm" fullWidth onClick={() => navigate('/auth/sign-up')}>Get Started</Button> {/* Redirige a /signup */}
          <Button variant="outlined" size="sm" fullWidth onClick={() => navigate('/auth/sign-in')}>Log In</Button> {/* Redirige a /login */}
        </div>
      </Collapse>
    </Navbar>
  );
}

export default NavigationTopBar;
