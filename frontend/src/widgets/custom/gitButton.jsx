import {
    Button,
} from "@material-tailwind/react";


export function GitButton({ URL }) {
    const urlToUSe = URL ? URL : 'https://github.com';
    const handleButtonClick = () => {
        window.open(urlToUSe, '_blank');
    };

    return (
        <div className="flex flex-wrap items-center gap-2 mt-4">
            <Button
                id="Github"
                variant="outlined"
                className="border-gray-300 flex items-center gap-2"
                onClick={handleButtonClick}
            >
                <i className="fa-brands fa-github text-base" />
                Github
            </Button>
        </div>
    )
}

export default GitButton
