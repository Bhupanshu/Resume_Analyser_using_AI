// this api is used to register the user in the database 
// the data is sent to the backend using axios post request
// the response is then sent to the context 
// withCredentials:true is used to send the credentials to the backend   

import axios from "axios";

export async function registerUser({ username, email, password }) {
    try {
        const response = await axios.post("http://localhost:3000/api/auth/register", { username, email, password },
            { withCredentials: true }
        );
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function loginUser({ email, password }) {
    try {
        const response = await axios.post("http://localhost:3000/api/auth/login",
            { email, password },
            { withCredentials: true }
        );
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

export async function logout() {
    try {
        const response = await axios.post("http://localhost:3000/api/auth/logout", {}, {
            withCredentials: true
        })
        return response.data;
    }
    catch (err) {
        console.log(err);
    }

}

export async function getProfile() {
    try {
        const response = await axios.get("http://localhost:3000/api/auth/get-me", {
            withCredentials: true
        })
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}

