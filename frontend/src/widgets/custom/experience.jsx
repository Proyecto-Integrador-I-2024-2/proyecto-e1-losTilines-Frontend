import { Card, Typography, IconButton } from "@material-tailwind/react";

const defaultExperiences = [
    {
        role: "Frontend Developer",
        company: "Tech Solutions Inc.",
        duration: "Jan 2022 - Present",
        description:
            "Developed and maintained user interfaces using React and Tailwind CSS. Collaborated with backend developers to integrate REST APIs and optimize performance.",
    },
    {
        role: "UI/UX Designer",
        company: "Creative Minds Studio",
        duration: "Jun 2020 - Dec 2021",
        description:
            "Designed user-friendly interfaces and enhanced user experience for multiple web applications. Worked closely with clients to deliver pixel-perfect designs.",
    },
    {
        role: "UI/UX Designer",
        company: "Creative Minds Studio",
        duration: "Jun 2020 - Dec 2021",
        description:
            "Designed user-friendly interfaces and enhanced user experience for multiple web applications. Worked closely with clients to deliver pixel-perfect designs.",
    },
    {
        role: "Full Stack Developer",
        company: "Innovatech",
        duration: "Mar 2018 - May 2020",
        description:
            "Built full-stack web applications using Node.js, React, and PostgreSQL. Collaborated in an Agile environment, focusing on delivering new features.",
    },
];

export function ExperienceSection({ experiences }) {

    const experiencesToUse = experiences && experiences.length > 0 ? experiences : defaultExperiences;

    return (
        <div className="h-full">
            <Typography variant="h6" color="blue-gray" className="mb-4">
                Work Experience
            </Typography>
            <div className="space-y-6 h-full overflow-y-auto no-scrollbar">
                {experiencesToUse.map((exp, index) => (
                    <Card key={index} shadow={true} className="p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <Typography variant="h5" className="text-blue-gray-800">
                                    {exp.occupation}
                                </Typography>
                                <Typography className="text-blue-gray-600">
                                    {exp.company} &bull; {exp.duration || `${exp.start_date} to ${exp.final_date}`}
                                </Typography>
                            </div>
                            <IconButton size="sm" className="bg-blue-500">
                                <i className="fas fa-briefcase"></i>
                            </IconButton>
                        </div>
                        <Typography className="text-blue-gray-700 mt-4">
                            {exp.description ? exp.description : "No description provided"}
                        </Typography>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default ExperienceSection;
