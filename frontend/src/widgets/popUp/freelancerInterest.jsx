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
        handleInterest()
        onOpen(false);
    };

    return (
        <Dialog open={open} handler={onOpen} size="md" className="overflow-auto">
            <DialogHeader>Are you interest in this project?</DialogHeader>
            <DialogBody divider className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                    <Typography variant="h4" className="w-full text-center">
                        Are you sure you want to apply to {project.name}?
                    </Typography>
                </div>
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={() => onOpen(false)} className="mr-2">
                    Cancel
                </Button>
                <Button variant="gradient" color="cyan" onClick={handleSave}>
                    I'm interested
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default FreelancerInterestPopUp;
