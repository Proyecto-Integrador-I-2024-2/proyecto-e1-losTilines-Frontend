import {
    Typography,
} from "@material-tailwind/react";
import React from "react";


export function CustomList({ children, sectionTitle, sectionSubtitle, isDistributedEvenly }) {
    return (
        <div className="max-h-2/3 pb-4 overflow-x-auto whitespace-nowrap no-scrollbar">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                {sectionTitle}
            </Typography>
            <Typography
                variant="small"
                className="font-normal text-blue-gray-500 mb-4"
            >
                {sectionSubtitle}
            </Typography>
            <div className="flex flex-row w-auto">
                <div className={`inline-flex gap-8 w-auto items-center ${isDistributedEvenly ? "justify-evenly" : ""}`}>
                    {children}
                </div>
            </div>
        </div>
    )
}

CustomList.defaultProps = {
    sectionTitle: 'Título por defecto',
    sectionSubtitle: 'Subtítulo por defecto',
    isDistributedEvenly: false
}

export default CustomList;
