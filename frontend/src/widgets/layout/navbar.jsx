import React, { useEffect, useRef, useCallback, useState } from "react";
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
  Drawer,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronUpIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openNestedMenu, setOpenNestedMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");

  return (
    <>
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom" allowHover={true}>
        <MenuHandler>
          <Typography as="div" variant="small" className="font-semibold">
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              Options
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${isMenuOpen ? "rotate-180" : ""
                  }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${isMobileMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden rounded-xl lg:block">
          <Menu
            placement="right-start"
            allowHover
            offset={15}
            open={openNestedMenu}
            handler={setOpenNestedMenu}
          >
            <MenuHandler className="flex items-center justify-between">
              <MenuItem>
                Projects
                <ChevronUpIcon
                  strokeWidth={2.5}
                  className={`h-3.5 w-3.5 transition-transform ${
                    isMenuOpen ? "rotate-90" : ""
                  }`}
                />
              </MenuItem>
            </MenuHandler>
          </Menu>
          <MenuItem onClick={() => navigate(`/approvals/${(role === "Freelancer") ? "freelancer" : "project-management"}`)}>Approvals</MenuItem>
          <MenuItem onClick={() => navigate("/faq")}>FAQ</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}

function NavList() {
  const navigate = useNavigate();

  return (
    <List className="mb-6 mt-4 p-0 lg:mb-0 lg:mt-0 lg:flex-row lg:p-1">
      <ListItem className="flex items-center gap-2 py-2 pr-4" ripple={false} selected={false} onClick={() => navigate("/profile")}>
        <Typography variant="small" color="blue-gray" className="font-medium cursor-pointer" >
          Profile
        </Typography>
      </ListItem>
      <ListItem className="flex items-center gap-2 py-2 pr-4" ripple={false} selected={false} onClick={() => navigate("/dashboard")}>
        <Typography variant="small" color="blue-gray" className="font-medium cursor-pointer" >
          Dashboard
        </Typography>
      </ListItem>
      <ListItem className="flex items-center gap-2 py-2 pr-4" ripple={false} selected={false} onClick={() => navigate("/project/")}>
        <Typography variant="small" color="blue-gray" className="font-medium cursor-pointer" >
          Projects
        </Typography>
      </ListItem>
      <ListItem className="flex items-center gap-2 py-2 pr-4" ripple={false} selected={false} onClick={() => navigate("/search/")}>
        <Typography variant="small" color="blue-gray" className="font-medium cursor-pointer" >
          Search
        </Typography>
      </ListItem>
      <NavListMenu />
    </List>
  );
}

export function NavigationTopBar() {
  const [openNav, setOpenNav] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const socketRef = useRef(null); // Ref to store the WebSocket instance
  const [token, setToken] = useState(sessionStorage.getItem("token"));   // Establish token if it has changed
  
  // State to handle drawer opening function

  const [openDrawer, setOpenDrawer] = useState(false);

  const closeDrawerRight = () =>{ 
    
    setOpenDrawer(false)
    setNotifications([]);

  };

  function handleLogOut() {
    queryClient.clear();
    sessionStorage.clear();
    navigate("/");
  }



  //------------------Manage token based on session storage changes------------------//

  useEffect(() => {
    console.log("Check WS connection: ", socketRef.current);
  })

  useEffect(() => {
    const tokenChangeHandler = () => {
      const newToken = sessionStorage.getItem("token");
      console.log("Token updated:", newToken);
      setToken(newToken);
    };

    window.addEventListener("storage", tokenChangeHandler); 

    return () => {
      window.removeEventListener("storage", tokenChangeHandler);
    };
  }, []);


  //------------------Connect to WebSocket------------------//

  const connectWebSocket = useCallback(() => {
    if (!token) {

      socketRef.current?.close();
      console.log("No token available, skipping WebSocket connection");
      return;
    }

    // Evitar múltiples conexiones
    if (socketRef.current) {
      console.log("WebSocket already connected");
      return;
    }

    console.log("Connecting to WebSocket...");

    const socket = new WebSocket(
      `ws://localhost:29000/ws/notifications/?token=${token}`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data.message);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        data.message,
      ]);
    };

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed:", event);
      socketRef.current = null;
      setTimeout(connectWebSocket, 5000); // Reintentar conexión
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      socketRef.current = null;
      setTimeout(connectWebSocket, 5000); // Reintentar conexión
    };

    socketRef.current = socket;
  }, [token]);


  //------------------Connect to ws on Callback change by token------------------//

  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);


  //------------------Show notifications------------------//

  useEffect(() => {

    console.log("Notifications: ", notifications);  


  }, [notifications]);


  return (
    <>
      <Navbar className="mx-auto max-w-full px-4 py-2">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            variant="h6"
            className="mr-4 cursor-pointer py-1.5 lg:ml-2"
            onClick={() => navigate("/")}
          >
            Freelance Now
          </Typography>
          <div className="hidden lg:block">
            <NavList />
          </div>
          <div className="relative">
            {/* -------------------------Notifications icon------------------------- */}

            {token && (
              <IconButton
                variant="text"
                onClick={() => setOpenDrawer(!openDrawer)}
              >
                {notifications.length > 0 && (
                  <span className="absolute  right-0 top-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
                <BellIcon className="h-6 w-6" strokeWidth={2} />
              </IconButton>
            )}

            <Button
              variant="outlined"
              size="sm"
              onClick={token ? handleLogOut : () => navigate("/auth/sign-in")}
            >
              Log {token ? "out" : "in"}
            </Button>
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
            <Button
              size="sm"
              fullWidth
              onClick={() => navigate("/auth/sign-up")}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="sm"
              fullWidth
              onClick={() => navigate("/auth/sign-in")}
            >
              Log In
            </Button>
          </div>
        </Collapse>
      </Navbar>

      <Drawer
        placement="right"
        open={openDrawer}
        onClose={closeDrawerRight}
        className=" p-4 overflow-y-auto "
      >
        <div className="mb-6 flex items-center  justify-between">
          <Typography variant="h5" color="blue-gray">
            Notifications
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={closeDrawerRight}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>


        <List  >
        {notifications.length !== 0 ? (
          notifications.map((notification, index) => (
            <ListItem key={index} className="mb-2">
              {notification}
            </ListItem>
          ))
        ) : (
          <Typography>There aren't notifications yet.</Typography>
        )}

          
        </List>
        
        
      </Drawer>
    </>
  );
}

export default NavigationTopBar;
