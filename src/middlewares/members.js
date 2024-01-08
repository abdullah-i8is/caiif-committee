import axios from "axios";
import { API_URL } from "../config/api";

export const GetAllMembers = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/admin/getAllUsers`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        return response
    } catch (error) {
        console.log(error);
    }
}