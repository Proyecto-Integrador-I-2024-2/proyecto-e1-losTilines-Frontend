import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Textarea,
    Button,
} from "@material-tailwind/react";


import { useState } from "react";


export function EditProfilePopUp({ profile, open, onOpen, onChange }) {


    const [formData, setFormData] = useState(
        profile
    );


    const handleOpen = () => onOpen((prev) => !prev);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        // Aquí puedes agregar la lógica para guardar los datos
        onChange(formData);
        console.log("Datos guardados:", formData);
        onOpen((prev) => !prev);
    };

    return (
        <Dialog open={open} handler={handleOpen} size="md">
            <DialogHeader>Edit Your Profile</DialogHeader>
            <DialogBody divider>
                <div className="grid gap-6">
                    {/* First Name */}
                    <Input
                        id="first_name"
                        label="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        size="lg"
                        required
                    />

                    {/* Last Name */}
                    <Input
                        id="last_name"
                        label="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        size="lg"
                        required
                    />

                    {/* Email */}
                    <Input
                        id="email"
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        size="lg"
                        required
                    />

                    {/* Phone Number */}
                    <Input
                        id="phone_number"
                        label="Phone Number"
                        name="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={handleChange}
                        size="lg"
                    />

                    {/* Description */}
                    {/* <Textarea
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        size="lg"
                    /> */}
                </div>
            </DialogBody>
            <DialogFooter className="justify-end">
                <Button id="cancel" variant="text" color="red" onClick={handleOpen} className="mr-2">
                    Cancel
                </Button>
                <Button id="save_changes" variant="gradient" color="cyan" onClick={handleSave}>
                    Save Changes
                </Button>
            </DialogFooter>
        </Dialog>
    );
};



export default EditProfilePopUp;
