import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';

const login = async ({email, password}) => {

    const {data} = await apiClient.post("/auth/", {email, password});

    return data;
}


const useLogin = () => {

    const queryClient = useQueryClient();

    return useMutation(login, {

        onSuccess: (data) => {

            sessionStorage.setItem('token', data.token);
            queryClient.invalidateQueries(['User']);
            alert('Login successful!');
    
        },
        onError: (error) => {

            console.error('Login failed:', error.response.data);
            alert('Login failed! Check your credentials.');
        }
        
    })

}

export default useLogin;

