import { Card, Typography, Progress } from "@material-tailwind/react";
import { FaJs, FaReact, FaNodeJs, FaPaintBrush, FaCode, FaPython, FaJava, FaDatabase, FaHtml5, FaCss3Alt, FaGitAlt, FaDocker } from 'react-icons/fa';
import { DiLinux, DiDjango, DiRuby, DiPhp, DiAngularSimple, DiMongodb } from 'react-icons/di';


const defaultSkills = [
    { name: "JavaScript", icon: <FaJs />, level: 90 },
    { name: "React", icon: <FaReact />, level: 85 },
    { name: "Node.js", icon: <FaNodeJs />, level: 70 },
    { name: "Linux", icon: <DiLinux />, level: 60 },
    { name: "TypeScript", icon: <FaJs />, level: 75 },
    { name: "Django", icon: <DiDjango />, level: 70 },
    { name: "UI/UX Design", icon: <FaPaintBrush />, level: 80 },
    { name: "Python", icon: <FaPython />, level: 80 },
    { name: "Java", icon: <FaJava />, level: 75 },
    { name: "SQL", icon: <FaDatabase />, level: 70 },
    { name: "HTML", icon: <FaHtml5 />, level: 90 },
    { name: "CSS", icon: <FaCss3Alt />, level: 85 },
    { name: "Git", icon: <FaGitAlt />, level: 80 },
    { name: "Docker", icon: <FaDocker />, level: 70 },
    { name: "Ruby", icon: <DiRuby />, level: 65 },
    { name: "PHP", icon: <DiPhp />, level: 60 },
    { name: "Angular", icon: <DiAngularSimple />, level: 70 },
    { name: "MongoDB", icon: <DiMongodb />, level: 75 }
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
    const skillKey = Object.keys(skillsIconMap).find(key => key.toLowerCase().includes(skillName.toLowerCase()));
    return skillsIconMap[skillKey] || <FaCode />;
};



export function SkillsSection({ sectionName, skills }) {
    const skillsToUse = skills || defaultSkills;
    return (
        <div className="h-full">
            <Typography variant="h6" color="blue-gray" className="mb-6 font-bold">
                {sectionName}
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full overflow-y-auto p-2 no-scrollbar">
                {skillsToUse.map((skill, index) => (
                    <Card key={index} shadow={true} className="p-6 flex items-center">
                        <div className="text-blue-500 text-3xl mr-4 pb-4">{skill.icon ? skill.icon : getSkillIcon(skill.name)}</div>
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
