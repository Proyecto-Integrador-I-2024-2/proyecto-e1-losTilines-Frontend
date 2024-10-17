import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

// Función para realizar el PATCH a la API
const patchDelete = async ({ id }) => {

    // Define la ruta basada en el session storage y asegurarse del manejo adecuado de los IDs
    var route = "experience";
    const url = `${route}/${id}/`;

    // Realiza la mutación a través de la API
    const { data } = await apiClient.delete(url);
    return data;
}

// Hook que usa useMutation para editar el perfil de un trabajador
export const useDeleteFreelancerExperience = () => {
    const queryClient = useQueryClient(); // Necesitamos el queryClient para invalidar queries

    return useMutation(patchDelete, {
        onSuccess: () => {
            console.log("Experiencia eliminada con éxito");

            // Invalida todas las queries que tengan el ID 'Freelancer'
            queryClient.invalidateQueries(['Freelancer']);
        },
        onError: (error) => {
            console.error("Error al eliminar la exxperiencia:", error);
        },
        retry: 2,  // Reintenta la mutación 2 veces en caso de fallo
    });
}

export default useDeleteFreelancerExperience;
