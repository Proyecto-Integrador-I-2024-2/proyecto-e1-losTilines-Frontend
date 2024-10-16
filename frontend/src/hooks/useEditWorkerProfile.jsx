import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

// Función para realizar el PATCH a la API
const patchWorker = async (body) => {
    const id = sessionStorage.getItem("id");

    // Define la ruta basada en el session storage y asegurarse del manejo adecuado de los IDs
    var userType = "workers";
    const url = `${userType}/${id}/`;

    console.log("URL: " + url);

    // Realiza la mutación a través de la API
    const { data } = await apiClient.patch(url, body);
    return data;
}

// Hook que usa useMutation para editar el perfil de un trabajador
export const useEditWorkerProfile = () => {
    const queryClient = useQueryClient(); // Necesitamos el queryClient para invalidar queries

    return useMutation(patchWorker, {
        onSuccess: () => {
            console.log("Perfil editado con éxito");

            // Invalida todas las queries que tengan el ID 'Freelancer'
            queryClient.invalidateQueries(['Freelancer']);
        },
        onError: (error) => {
            console.error("Error al editar el perfil:", error);
        },
        retry: 2,  // Reintenta la mutación 2 veces en caso de fallo
    });
}

export default useEditWorkerProfile;
