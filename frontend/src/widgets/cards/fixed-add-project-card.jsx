import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button
} from "@material-tailwind/react";
import { AddProject } from "@/widgets/popUp";


export function FixedAddProjectCard({ userType, dialogOpen, setDialogOpen, handleOpen, handleNavigate }) {
    return (
        <div className="basis-[20%] pr-6">
            <Card color="white" shadow={true} className="w-full rounded-xl shadow-2xl">
                <CardHeader
                    color="transparent"
                    floated={true}
                    shadow={true}
                    className="mx-0 flex items-center pt-0 pb-8 justify-center m-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl"
                >
                    <Typography variant="h5" color="white" className="text-center font-semibold pt-5">
                        {userType === "Freelancer" ? "Buscar más proyectos" : "Añade un nuevo proyecto"}
                    </Typography>
                </CardHeader>
                <CardBody className="px-4 py-8 flex flex-col items-center">
                    <Typography color="gray" className="mb-4 text-center">
                        {userType === "Freelancer"
                            ? "Explora proyectos disponibles para unirte."
                            : "Si tienes una idea innovadora, no dudes en agregarla a nuestra lista de proyectos."}
                    </Typography>
                    {userType === "Freelancer" ? (
                        <Button variant="gradient" onClick={handleNavigate}>
                            Buscar Proyectos
                        </Button>
                    ) : (
                        <Button onClick={handleOpen} variant="gradient">
                            Crear Proyecto
                        </Button>
                    )}
                    {userType !== "Freelancer" && (
                        <AddProject open={dialogOpen} setOpen={setDialogOpen} color="purple" size="lg" ripple={true} className="rounded-full shadow-lg">
                            + Añadir Proyecto
                        </AddProject>
                    )}
                </CardBody>
            </Card>
        </div>
    )
}

export default FixedAddProjectCard
