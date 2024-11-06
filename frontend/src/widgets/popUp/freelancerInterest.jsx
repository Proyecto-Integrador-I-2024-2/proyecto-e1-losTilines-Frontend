import React from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
} from "@material-tailwind/react";

export function FreelancerInterestPopUp({ open, onOpen, handleInterest, project }) {
    const handleSave = () => {
        handleInterest();
        onOpen(false);
    };

    return (
        <Dialog open={open} handler={onOpen} size="md" className="overflow-auto rounded-lg shadow-lg">
            <DialogHeader className="text-center text-xl font-bold text-gray-800">
                Do you want to <span className="text-cyan-500"> &nbsp; Freelance Now?</span>
            </DialogHeader>

            <DialogBody divider className="max-h-96 overflow-y-auto bg-gray-50 p-6">
                <div className="flex justify-center items-center">
                    <Typography variant="h5" className="w-full text-center text-gray-700">
                        Are you sure you want to apply to <span className="font-semibold">{project.name}</span>?
                    </Typography>
                </div>
            </DialogBody>
            <DialogFooter className="bg-gray-100 p-4">
                <Button variant="text" color="red" onClick={() => onOpen(false)} className="mr-2">
                    Cancel
                </Button>
                <Button variant="gradient" color="cyan" onClick={handleSave}>
                    I'm interested
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

export default FreelancerInterestPopUp;
