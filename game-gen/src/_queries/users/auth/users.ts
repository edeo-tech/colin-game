import { useMutation } from '@tanstack/react-query';
import usersAuthApi from '../../../_api/users/auth/users';
import type { RegisterUser } from '../../../_interfaces/users/auth';

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: (data: RegisterUser) => usersAuthApi.register(data),
    });
};