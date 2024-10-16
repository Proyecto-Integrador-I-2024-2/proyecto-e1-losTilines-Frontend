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
    const { data, isLoading, error, refetch } = onChange(formData);


    const handleOpen = () => onOpen((prev) => !prev);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        // Aquí puedes agregar la lógica para guardar los datos
        refetch();
        console.log("Datos guardados:", formData);
        setOpen(false);
    };

    return (
        <Dialog open={open} handler={handleOpen} size="md">
            <DialogHeader className="text-xl font-semibold text-center">Edit Your Profile</DialogHeader>
            <DialogBody divider>
                <div className="grid gap-6">
                    {/* First Name */}
                    <Input
                        label="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        size="lg"
                        required
                    />

                    {/* Last Name */}
                    <Input
                        label="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        size="lg"
                        required
                    />

                    {/* Email */}
                    <Input
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
                <Button variant="text" color="red" onClick={handleOpen} className="mr-2">
                    Cancel
                </Button>
                <Button variant="gradient" color="cyan" onClick={handleSave}>
                    Save Changes
                </Button>
            </DialogFooter>
        </Dialog>
    );
};



export default EditProfilePopUp;
