import { useMutation } from "@tanstack/react-query";
import apiClient from "@/services/apiClient";

const registerUser = async (userData) => {
  const response = await apiClient.post("/users/register/freelancer", userData);
  return response.data;
};

export const useRegister = () => {
  return useMutation(registerUser, {
    onSuccess: (data) => {
      console.log("Registration successful:", data);
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      throw error; 
    },
  });
};

export default useRegister;
