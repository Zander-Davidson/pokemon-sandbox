import axios from "axios";

const API_URL = "/api/auth/";

const signup = (username, email, password) => {
    return axios.post(API_URL + "signup", {
        username,
        email,
        password,
    });
};

const login = (username, password) => {
    return axios
        .post(API_URL + "login", { username, password })
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
}

const logout = () => {
    localStorage.removeItem("user");
};

const authService =  {
    signup: signup,
    login: login,
    logout: logout
};

export default authService;