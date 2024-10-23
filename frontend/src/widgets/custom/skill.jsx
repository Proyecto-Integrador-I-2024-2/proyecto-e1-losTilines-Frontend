import { Card, Typography, Progress, IconButton, Tooltip } from "@material-tailwind/react";
import { FaJs, FaReact, FaNodeJs, FaPaintBrush, FaCode, FaPython, FaJava, FaDatabase, FaHtml5, FaCss3Alt, FaGitAlt, FaDocker } from 'react-icons/fa';
import { DiLinux, DiDjango, DiRuby, DiPhp, DiAngularSimple, DiMongodb } from 'react-icons/di';
import { PencilIcon } from "@heroicons/react/20/solid";
import { EditButton } from "../buttons";

const defaultSkills = [
    { skill_name: "JavaScript", icon: <FaJs />, level: 90 },
    { skill_name: "React", icon: <FaReact />, level: 85 },
    { skill_name: "Node.js", icon: <FaNodeJs />, level: 70 },
    { skill_name: "Linux", icon: <DiLinux />, level: 60 },
    { skill_name: "TypeScript", icon: <FaJs />, level: 75 },
    { skill_name: "Django", icon: <DiDjango />, level: 70 },
    { skill_name: "UI/UX Design", icon: <FaPaintBrush />, level: 80 },
    { skill_name: "Python", icon: <FaPython />, level: 80 },
    { skill_name: "Java", icon: <FaJava />, level: 75 },
    { skill_name: "SQL", icon: <FaDatabase />, level: 70 },
    { skill_name: "HTML", icon: <FaHtml5 />, level: 90 },
    { skill_name: "CSS", icon: <FaCss3Alt />, level: 85 },
    { skill_name: "Git", icon: <FaGitAlt />, level: 80 },
    { skill_name: "Docker", icon: <FaDocker />, level: 70 },
    { skill_name: "Ruby", icon: <DiRuby />, level: 65 },
    { skill_name: "PHP", icon: <DiPhp />, level: 60 },
    { skill_name: "Angular", icon: <DiAngularSimple />, level: 70 },
    { skill_name: "MongoDB", icon: <DiMongodb />, level: 75 }
];



const skillsIconMap = {
    "JavaScript": <FaJs />,
    "React": <FaReact />,
    "Node.js": <FaNodeJs />,
    "Linux": <DiLinux />,
    "TypeScript": <FaJs />,
    "Django": <DiDjango />,
    "UI/UX Design": <FaPaintBrush />,
    "Python": <FaPython />,
    "Java": <FaJava />,
    "SQL": <FaDatabase />,
    "HTML": <FaHtml5 />,
    "CSS": <FaCss3Alt />,
    "Git": <FaGitAlt />,
    "Docker": <FaDocker />,
    "Ruby": <DiRuby />,
    "PHP": <DiPhp />,
    "Angular": <DiAngularSimple />,
    "MongoDB": <DiMongodb />
};

const getSkillIcon = (skillName) => {
    const skillKey = Object.keys(skillsIconMap).find(key => key.toLowerCase() === skillName.toLowerCase());
    return skillsIconMap[skillKey] || <FaCode />;
};



export function SkillsSection({ sectionName, skills, editable, onEdit }) {
    // const skillsToUse = skills && skills.length > 0 ? skills : defaultSkills;
    const isThereSkills = skills && skills.length > 0
    const skillsToUse = skills;
    return (
        <div className="h-full">
            <div className="flex flex-row items-center justify-between">
                <Typography variant="h6" color="blue-gray" className="">
                    {sectionName}
                </Typography>
                {editable && (<EditButton toolTip="Edit Skills" onClick={onEdit} />)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full overflow-y-auto p-2 no-scrollbar">
                {isThereSkills ? (skillsToUse.map((skill, index) => (
                    <Card key={index} shadow={true} className="p-6 flex items-center max-h-min">
                        <div className="text-blue-500 text-3xl mr-4 pb-4">{skill.icon ? skill.icon : getSkillIcon(skill?.skill_name || skill?.skill?.name)}</div>
                        <div className="w-full">
                            <div className="flex justify-between mb-2">
                                <Typography variant="h6" className="text-blue-gray-800">
                                    {skill?.skill_name || skill?.skill?.name}
                                </Typography>
                                <Typography variant="small" className="text-blue-gray-600">
                                    {skill.level || skill.average_level}%
                                </Typography>
                            </div>
                            <Progress value={skill.level || skill.average_level} color="blue" />
                        </div>
                    </Card>
                ))) : <div className="flex flex-col items-center justify-start h-full">
                    <Typography variant="h6" color="blue-gray" className="text-center">
                        No skills added yet
                    </Typography>
                </div>}
            </div>
        </div>
    );
}

export default SkillsSection;
