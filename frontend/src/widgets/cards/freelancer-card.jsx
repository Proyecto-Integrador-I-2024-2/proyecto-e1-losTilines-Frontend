import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
  Button
} from "@material-tailwind/react";

import { Link } from "react-router-dom";

const defaultImage = "https://i.pinimg.com/736x/f0/44/32/f044320d1fd50e8c806a2f92da661715.jpg";

export function FreelancerCard({ freelancer, isActive }) {
  return (
    <Card className={`w-96 transition-transform duration-300 ${isActive ? "scale-105" : "scale-100"} ${isActive ? "filter-none" : "filter blur-sm"}`}>
      <CardHeader floated={false} className="h-80">
        <img src={freelancer.image || defaultImage} alt="profile-picture" className={`${isActive ? "filter-none" : "filter blur-sm"}`} />
      </CardHeader>
      <CardBody className="text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          {`${freelancer.first_name} ${freelancer.last_name}` || "John Doe"}
        </Typography>
        <Typography color="blue-gray" className="font-medium" textGradient>
          {freelancer.email || "Not available"}
        </Typography>
        <Typography color="blue-gray" className="font-medium" textGradient>
          Freelancer
        </Typography>
      </CardBody>
      <CardFooter className="flex justify-center gap-7 pt-2">
        <Tooltip content="Github">
          <Typography as="a" href={"https://github.com/Domiciano/AppMoviles242"} variant="lead" color="blue" textGradient>
            <i className="fab fa-github" />
          </Typography>
        </Tooltip>
        <Tooltip content="Follow">
          <Typography as="a" href={"https://x.com/?lang=en"} variant="lead" color="light-blue" textGradient>
            <i className="fab fa-twitter" />
          </Typography>
        </Tooltip>
        <Tooltip content="Follow">
          <Typography as="a" href={"https://www.facebook.com/?locale=es_LA"} variant="lead" color="purple" textGradient>
            <i className="fab fa-instagram" />
          </Typography>
        </Tooltip>

        <Tooltip content="Details">
          <Link to={`/profile`}>
            <Button
              ripple={false}
              fullWidth={true}
              className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
            >
              Details
            </Button>
          </Link>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}
