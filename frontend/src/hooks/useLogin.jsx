import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';

const login = ({email, password}) => {

    const {data} = apiClient.post("/auth/", {email, password});

    return data;
}


const useUser = () => {

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
