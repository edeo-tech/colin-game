import axiosConfig from '../../../lib/axios';
import type { RegisterUser } from '../../../_interfaces/users/auth';

const BASE_PATH = '/app/users/auth';

class UsersAuthApi {
    register(body: RegisterUser) {
        return axiosConfig.unprotectedApi.post(`${BASE_PATH}/register`, body);
    }
}

const usersAuthApi = new UsersAuthApi();
export default usersAuthApi;