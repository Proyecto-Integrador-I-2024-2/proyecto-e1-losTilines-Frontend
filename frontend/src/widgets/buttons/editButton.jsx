import { IconButton, Tooltip } from "@material-tailwind/react"
import { PencilIcon } from "@heroicons/react/24/solid"

export function EditButton({ toolTip, onClick }) {
    return (
        <Tooltip content={toolTip} >
            <IconButton variant="text" onClick={onClick}>
                <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500" />
            </IconButton>
        </Tooltip>
    )
}

export default EditButton
