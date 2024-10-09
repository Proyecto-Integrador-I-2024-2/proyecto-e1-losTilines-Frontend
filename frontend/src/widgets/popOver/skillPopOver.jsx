import React, { useState } from 'react';
import { Input, Button } from "@material-tailwind/react";

export function SkillEditorPopover({ skill, onSave, onCancel }) {
    const [editedSkill, setEditedSkill] = useState(skill);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedSkill({ ...editedSkill, [name]: value });
    };

    const handleSave = () => {
        onSave(editedSkill);
    };

    return (
        <div className="absolute z-10 bg-white p-4 shadow-lg rounded-md w-full">
            <Input
                label="Nombre de la Habilidad"
                name="skill_name"
                value={editedSkill.skill_name}
                onChange={handleChange}
                className="mb-2"
            />
            <Input
                label="Nivel (%)"
                name="level"
                type="number"
                min="0"
                max="100"
                value={editedSkill.level}
                onChange={handleChange}
                className="mb-2"
            />
            <div className="flex justify-end space-x-2">
                <Button variant="text" color="red" onClick={onCancel}>Cancelar</Button>
                <Button variant="gradient" color="green" onClick={handleSave}>Guardar</Button>
            </div>
        </div>
    );
};
export default SkillEditorPopover;