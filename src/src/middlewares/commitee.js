import axios from 'axios';
import { API_URL } from '../config/api';
import { useDispatch, useSelector } from 'react-redux';
import { setCommittees } from '../store/committeeSlice/committeeSlice';

export const GetAdminCommittees = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/admin/allCommittees`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        return response
    } catch (error) {
        console.log(error);
    }
}

export const GetUserCommittees = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/user/allCommittees`)
        return response
    } catch (error) {
        console.log(error);
    }
}

export const GetUserallCommittees = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/user/userCommittee`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        return response
    } catch (error) {
        console.log(error);
    }
}