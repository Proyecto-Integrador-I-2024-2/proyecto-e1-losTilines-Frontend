import { Card, Typography, IconButton, Tooltip } from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/20/solid";
import { EditButton } from "../buttons";
import { defaultExperiences } from "@/data";

export function ExperienceSection({ experiences, editable, onEdit }) {

    const experiencesToUse = experiences && experiences.length > 0 ? experiences : [];


    if (!(experiences && experiences.length > 0)) {
        return (
            <div className="h-full">
                <div className="flex flex-row items-center justify-between">
                    <Typography variant="h6" color="blue-gray" className="">
                        Work Experience
                    </Typography>
                    {editable && (<EditButton id="editButton1" toolTip="Edit Work Experience" onClick={onEdit} />)}
                </div>
                <Card shadow={true} className="p-6">
                    <Typography variant="h5" className="text-blue-gray-800">
                        No work experience provided
                    </Typography>
                </Card>
            </div>
        )
    }

    return (
        <div className="h-full">
            <div className="flex flex-row items-center justify-between">
                <Typography variant="h6" color="blue-gray" className="">
                    Work Experience
                </Typography>
                {editable && (<EditButton id="editButton2" toolTip="Edit Work Experience" onClick={onEdit} />)}
            </div>
            <div className="space-y-6 h-full overflow-y-auto no-scrollbar">
                {experiencesToUse.map((exp, index) => (
                    <Card key={index} shadow={true} className="p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <Typography variant="h5" className="text-blue-gray-800">
                                    {exp.occupation}
                                </Typography>
                                <Typography className="text-blue-gray-600">
                                    {exp.company} &bull; {exp.duration || `${exp.start_date} to ${exp.final_date || "Present"}`}
                                </Typography>
                            </div>
                            <IconButton id="iconButton" size="sm" className="bg-blue-500">
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
