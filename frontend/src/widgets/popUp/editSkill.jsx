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
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useSkills } from "@/hooks";

export function EditSkillsPopup({ open, onOpen, skills, editSkill, addSkill, deleteSkill }) {
    const { data: skillsData, isLoading: isSkillsLoading, refetch: skillsRefetch } = useSkills();

    const [skillToAdd, setSkillToAdd] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [newSkill, setNewSkill] = useState({
        skill_name: "",
        level: "",
    });

    const handleSave = () => {
        if (selectedSkill !== null) {
            const selectedCurrentSkill = skills[selectedSkill];
            editSkill(selectedCurrentSkill.id, newSkill);
        } else {
            if (skillToAdd) {
                const selectedSkillData = skillsData.find(skill => skill.id === parseInt(skillToAdd));
                const skillToAddData = {
                    skill: selectedSkillData.id,
                    level: newSkill.level, // Nivel introducido por el usuario
                };

                console.log("Skill to add: ", skillToAddData);
                addSkill(skillToAddData);
            }
        }
        setNewSkill({ skill_name: "", level: "" });
        setSelectedSkill(null);
        setSkillToAdd(null);
        onOpen(false);
    };


    const handleEdit = (index) => {
        if (selectedSkill === index) {
            setSelectedSkill(null);
            setNewSkill({ skill_name: "", level: "" });
            return;
        }
        setSelectedSkill(index);
        setNewSkill(skills[index]);
        onOpen(true);
    };

    const handleDelete = (index) => {
        deleteSkill(skills[index].id);

    };

    const handleChange = (e) => {
        if (e.target.name === "level") {
            if (e.target.value < 0) {
                e.target.value = 0;
            } else if (e.target.value > 100) {
                e.target.value = 100;
            }
        }
        const { name, value } = e.target;
        setNewSkill({ ...newSkill, [name]: value });
    };

    return (
        <Dialog open={open} handler={onOpen} size="md" className="overflow-auto">
            <DialogHeader>Edit Skills</DialogHeader>
            <DialogBody divider className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                    {skills.map((skill, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
                            <div>
                                <p className="font-bold">{skill?.skill_name || skill?.skill?.name}</p>
                                <p>Nivel: {skill.level}%</p>
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
                {
                    (selectedSkill !== null) && (
                        <div className="mt-6 space-y-4">
                            <Input
                                label={skills[selectedSkill]?.skill_name || skills[selectedSkill]?.skill?.name}
                                name="level"
                                type="number"
                                min="0"
                                max="100"
                                value={selectedSkill?.skill?.name}
                                disabled
                            />
                        </div>
                    )
                }
                <div className="mt-6 space-y-4">
                    <Input
                        label="Nivel (%)"
                        name="level"
                        type="number"
                        min="0"
                        max="100"
                        step="5"
                        value={newSkill.level}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mt-4">
                    {
                        (skillsData && !((selectedSkill !== null))) && (
                            <Select
                                label="Selecciona una habilidad para agregar"
                                value={skillToAdd}
                                onChange={(value) => setSkillToAdd(value)}
                                disabled={isSkillsLoading}
                            >
                                {skillsData && skillsData.map((skill) => (
                                    <Option key={skill.id} value={skill.id.toString()}>
                                        {skill.name} - {skill.type}
                                    </Option>
                                ))}
                            </Select>
                        )
                    }

                </div>

            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={() => onOpen(false)} className="mr-2">
                    Cancelar
                </Button>
                <Button variant="gradient" color="cyan" onClick={handleSave}>
                    {selectedSkill !== null ? "Save changes" : "Add skill"}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default EditSkillsPopup;
