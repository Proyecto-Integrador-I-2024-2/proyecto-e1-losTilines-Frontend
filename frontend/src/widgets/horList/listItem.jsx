import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Avatar,
    Typography,
    Tooltip,
    Button,
} from "@material-tailwind/react";

import { Link } from "react-router-dom";


export function CustomListItem({ img, title, tag, description, members, route }) {
    return (
        <Card key={title} color="transparent" shadow={false} className="w-96">
            <CardHeader
                floated={false}
                color="gray"
                className="mx-0 mt-0 mb-4 h-64 xl:h-40"
            >
                <img
                    src={img}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </CardHeader>
            <CardBody className="py-0 px-1">
                <Typography
                    variant="small"
                    className="font-normal text-blue-gray-500"
                >
                    {tag}
                </Typography>
                <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mt-1 mb-2 overflow-hidden"
                >
                    {title}
                </Typography>
                <Typography
                    variant="small"
                    className="font-normal text-blue-gray-500 overflow-hidden"
                >
                    {description}
                </Typography>
            </CardBody>
            <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                <Link to={route}>
                    <Button variant="outlined" size="sm">
                        View details
                    </Button>
                </Link>
                {/* <div>
                    {members.map(({ img, name }, key) => (
                        <Tooltip key={name} content={name}>
                            <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${key === 0 ? "" : "-ml-2.5"
                                    }`}
                            />
                        </Tooltip>
                    ))}
                </div> */}
            </CardFooter>
        </Card>
    )
}

export default CustomListItem;
