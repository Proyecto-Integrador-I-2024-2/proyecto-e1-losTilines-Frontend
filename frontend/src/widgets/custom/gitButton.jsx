import {
    Button,
} from "@material-tailwind/react";


export function GitButton() {
    return (
        <div className="flex flex-wrap items-center gap-2 mt-4">
            <Button
                variant="outlined"
                className="border-gray-300 flex items-center gap-2"
            >
                <i className="fa-brands fa-github text-base" />
                Github
            </Button>
            <Button
                variant="outlined"
                className="border-gray-300 flex items-center gap-2"
            >
                <i className="fa-brands fa-twitter" />
                Twitter
            </Button>
            <Button
                variant="outlined"
                className="border-gray-300 flex items-center gap-2"
            >
                <i className="fa-brands fa-medium" />
                Medium
            </Button>
        </div>
    )
}

export default GitButton
