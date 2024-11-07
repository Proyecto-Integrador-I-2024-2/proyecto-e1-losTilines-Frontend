import React, { useState } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option,
    Button,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useProjects, useSkills } from "@/hooks";

export function CompanyInterestPopUp({ open, onOpen, companyId, handleInterest }) {
    const { data: projects, isLoading, refetch: projectsRefetch } = useProjects({ company: companyId });
    const [selectedProject, setSelectedProject] = useState(null);

    const handleSave = () => {
        handleInterest(selectedProject);
        setSelectedProject(null);
        onOpen(false);
    };


    return (
        <Dialog open={open} handler={onOpen} size="md" className="overflow-auto">
            <DialogHeader>Interested on this freelancer?</DialogHeader>
            <DialogBody divider className="max-h-96 overflow-y-auto">
                <Typography variant="h5">
                    Invite them to Freelance Now with one of your projects.
                </Typography>
                <div className="mt-4">
                    {
                        projects && (
                            <Select
                                label="Select one project to invite"
                                value={selectedProject}
                                onChange={(value) => setSelectedProject(value)}
                                disabled={isLoading}
                            >
                                {projects && projects.map((proj) => (
                                    <Option key={proj.id} value={proj.id.toString()}>
                                        {proj.name}
                                    </Option>
                                ))}
                            </Select>
                        )
                    }
                </div>
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={() => onOpen(false)} className="mr-2">
                    Cancel
                </Button>
                <Button variant="gradient" color="cyan" onClick={handleSave}>
                    Invite
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default CompanyInterestPopUp;