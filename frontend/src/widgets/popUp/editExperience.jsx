import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Input, Textarea, Button, IconButton } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export const EditExperiencePopup = ({ open, onOpen, experiences, editExperience, addExperience, deleteExperience }) => {
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [newExperience, setNewExperience] = useState({
        occupation: "",
        start_date: "",
        final_date: "",
        description: "",
    });

    const handleSave = () => {
        if (selectedExperience !== null) {
            // const updatedExperiences = experiences.map((exp, index) =>
            //     index === selectedExperience ? newExperience : exp
            // );

            let selectedCurrentExperience;
            for (let i = 0; i < experiences.length; i++) {
                if (i === selectedExperience) {
                    selectedCurrentExperience = experiences[i];
                    break;
                }
            }
            editExperience(selectedCurrentExperience.id, newExperience);
        } else {
            addExperience(newExperience);
        }
        setNewExperience({ occupation: "", start_date: "", final_date: "", description: "" });
        setSelectedExperience(null);
        onOpen(false);
    };

    const handleEdit = (index) => {
        setSelectedExperience(index);
        setNewExperience(experiences[index]);
        onOpen(true);
    };

    const handleDelete = (index) => {
        deleteExperience(experiences[index].id);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewExperience({ ...newExperience, [name]: value });
    };

    return (
        <Dialog open={open} handler={onOpen} size="md">
            <DialogHeader>Edit Work Experience</DialogHeader>
            <DialogBody divider className="max-h-[500px] overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 gap-4">
                    {experiences.map((exp, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
                            <div className="pr-4">
                                <p className="font-bold">{exp.occupation}</p>
                                <p>{exp.duration || `${exp.start_date} - ${exp.final_date || "Present"}`}</p>
                                <p>{exp.description}</p>
                            </div>
                            <div className="flex space-x-2">
                                <IconButton variant="outlined" size="sm" onClick={() => handleEdit(index)}>
                                    <PencilIcon className="h-4 w-4 text-blue-gray-500" />
                                </IconButton>
                                <IconButton variant="outlined" size="sm" onClick={() => handleDelete(index)}>
                                    <TrashIcon className="h-4 w-4 text-red-500" />
                                </IconButton>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 space-y-4">
                    <Input
                        label="Occupation"
                        name="occupation"
                        value={newExperience.occupation}
                        onChange={handleChange}
                        required
                    />
                    <div className="flex space-x-4">
                        <Input
                            label="Start Date"
                            name="start_date"
                            type="date"
                            value={newExperience.start_date}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Final Date"
                            name="final_date"
                            type="date"
                            value={newExperience.final_date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <Textarea
                        label="Description"
                        name="description"
                        value={newExperience.description}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={() => onOpen(false)} className="mr-2">
                    Cancel
                </Button>
                <Button variant="gradient" color="cyan" onClick={handleSave}>
                    {selectedExperience !== null ? "Save Changes" : "Add Experience"}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default EditExperiencePopup;
