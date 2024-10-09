import React, { useState } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Button,
    IconButton,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export function EditSkillsPopup({ open, onOpen, skills, setSkills }) {
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [newSkill, setNewSkill] = useState({
        skill_name: "",
        level: "",
    });

    const handleSave = () => {
        if (selectedSkill !== null) {
            // Editar habilidad existente
            const updatedSkills = skills.map((skill, index) =>
                index === selectedSkill ? newSkill : skill
            );
            setSkills(updatedSkills);
        } else {
            // Agregar nueva habilidad
            setSkills([...skills, newSkill]);
        }
        setNewSkill({ skill_name: "", level: "" });
        setSelectedSkill(null);
        onOpen(false);
    };

    const handleEdit = (index) => {
        setSelectedSkill(index);
        setNewSkill(skills[index]);
        onOpen(true);
    };

    const handleDelete = (index) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSkill({ ...newSkill, [name]: value });
    };

    return (
        <Dialog open={open} handler={onOpen} size="md" className="overflow-auto">
            <DialogHeader>Editar Habilidades</DialogHeader>
            <DialogBody divider className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                    {skills.map((skill, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
                            <div>
                                <p className="font-bold">{skill.skill_name}</p>
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
                <div className="mt-6 space-y-4">
                    <Input
                        label="Nombre de la Habilidad"
                        name="skill_name"
                        value={newSkill.skill_name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Nivel (%)"
                        name="level"
                        type="number"
                        min="0"
                        max="100"
                        value={newSkill.level}
                        onChange={handleChange}
                        required
                    />
                </div>
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={() => onOpen(false)} className="mr-2">
                    Cancelar
                </Button>
                <Button variant="gradient" color="green" onClick={handleSave}>
                    {selectedSkill !== null ? "Guardar Cambios" : "Agregar Habilidad"}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default EditSkillsPopup;
