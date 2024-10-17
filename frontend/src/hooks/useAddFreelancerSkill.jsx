import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

// Función para realizar el PATCH a la API
const addFreelancerSkill = async ({ body }) => {

    // Define la ruta basada en el session storage y asegurarse del manejo adecuado de los IDs
    const id = sessionStorage.getItem("id");
    var route = "freelancer-skills";
    const url = `${route}/`;
    body["freelancer"] = id;
    // Realiza la mutación a través de la API
    const { data } = await apiClient.post(url, body);
    return data;
}

// Hook que usa useMutation para editar el perfil de un trabajador
export const useAddFreelancerSkill = () => {
    const queryClient = useQueryClient(); // Necesitamos el queryClient para invalidar queries

    return useMutation(addFreelancerSkill, {
        onSuccess: () => {
            console.log("Habilidad agregada con éxito");

            // Invalida todas las queries que tengan el ID 'Freelancer'
            queryClient.invalidateQueries(['Freelancer']);
        },
        onError: (error) => {
            console.error("Error al agregar la habilidad:", error);
        },
        retry: 2,  // Reintenta la mutación 2 veces en caso de fallo
    });
}

export default useAddFreelancerSkill;
