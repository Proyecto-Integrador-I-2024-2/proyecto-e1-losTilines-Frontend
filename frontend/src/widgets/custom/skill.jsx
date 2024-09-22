import { Card, Typography, Progress } from "@material-tailwind/react";
import { FaReact, FaJs, FaNodeJs, FaPaintBrush } from "react-icons/fa";
import { DiDjango, DiLinux } from "react-icons/di";

const skills = [
    { name: "JavaScript", icon: <FaJs />, level: 90 },
    { name: "React", icon: <FaReact />, level: 85 },
    { name: "Node.js", icon: <FaNodeJs />, level: 70 },
    { name: "Linux", icon: <DiLinux />, level: 60 },
    { name: "TypeScript", icon: <FaJs />, level: 75 },
    { name: "Django", icon: <DiDjango />, level: 70 },
    { name: "UI/UX Design", icon: <FaPaintBrush />, level: 80 },
];



export function SkillsSection({ sectionName }) {
    return (
        <div className="h-full">
            <Typography variant="h6" color="blue-gray" className="mb-6 font-bold">
                {sectionName}
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full overflow-y-auto p-2 no-scrollbar">
                {skills.map((skill, index) => (
                    <Card key={index} shadow={true} className="p-6 flex items-center">
                        <div className="text-blue-500 text-3xl mr-4 pb-4">{skill.icon}</div>
                        <div className="w-full">
                            <div className="flex justify-between mb-2">
                                <Typography variant="h6" className="text-blue-gray-800">
                                    {skill.name}
                                </Typography>
                                <Typography variant="small" className="text-blue-gray-600">
                                    {skill.level}%
                                </Typography>
                            </div>
                            <Progress value={skill.level} color="blue" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default SkillsSection;
