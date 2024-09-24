import { useMutation } from "@tanstack/react-query";
import apiClient from "../services/apiClient"; 

const registerUser = async (userData) => {
  const endpoint = userData.role === "freelancer" 
    ? "/users/register/freelancer/" 
    : "/users/register/business-manager/";  // Cambia el endpoint según el rol

  const response = await apiClient.post(endpoint, userData);
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
