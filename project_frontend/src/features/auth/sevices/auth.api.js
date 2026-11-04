// this api is used to register the user in the database 
// the data is sent to the backend using axios post request
// the response is then sent to the context 
// withCredentials:true is used to send the credentials to the backend   

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

export async function registerUser({ username, email, password }) {
    try {
        const response = await api.post("/api/auth/register", { username, email, password },
        );
        return response.data;
    }
    catch (err) {
        console.log(err);
        throw err
    }
}

export async function loginUser({ email, password }) {
    try {
        const response = await api.post("/api/auth/login",
            { email, password },
        );
        return response.data;
    }
    catch (err) {
        console.log(err);
         throw err
    }
}

export async function logout() {
    try {
        const response = await api.post("/api/auth/logout")
        return response.data;
    }
    catch (err) {
        console.log(err);
         throw err
    }

}

export async function getProfile() {
    try {
        const response = await api.get("/api/auth/get-me")
        return response.data;
    }
    catch (err) {
        console.log(err);
         throw err
    }
}

