import { profile_pic } from "@/data/placeholder";
import { Chip, Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function SmallFreelancerCard({ freelancer, onCardClick }) {

    return (
        <Card
            className="w-48 max-w-xs p-3 shadow-lg rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
            onClick={() => onCardClick(freelancer?.user?.id)}
        >
            <div className="h-32 w-32 mx-auto mb-2 rounded-full overflow-hidden">
                <img
                    src={freelancer.image || profile_pic}
                    alt={`${freelancer?.user?.first_name || freelancer?.first_name || "John"} ${freelancer?.user?.last_name || freelancer?.last_name || "Doe"}`}
                    className="h-full w-full object-cover"
                />
            </div>
            <CardBody className="p-0 text-center">
                <Typography variant="h6" className="text-blue-gray-900 mb-2">
                    {`${freelancer?.user?.first_name || freelancer?.first_name || "John"} ${freelancer?.user?.last_name || freelancer?.last_name || "Doe"}`}
                </Typography>
                <div className="flex justify-center flex-wrap gap-2">
                    {freelancer?.skills && freelancer.skills.slice(0, 3).map((skill, index) => (
                        <Chip
                            key={index}
                            value={skill?.skill_name || skill || "Skill"}
                            variant="ghost"
                            className="text-blue-gray-800 rounded-full px-2 py-1 text-xs"
                        />
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}
