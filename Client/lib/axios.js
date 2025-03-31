import axios from "axios";

//conection with backend
export const api = axios.create({
    baseURL: 'http://localhost:3000'
})