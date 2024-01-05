import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../config/api";
import { setApproveMembers } from "../store/membersSlice/membersSlice";

export async function getMembers() {
    const token = useSelector((state) => state.common.token)
    const dispatch = useDispatch()
    try {
        const response = await axios.get(`${API_URL}/admin/getAllUsers`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        if (response.status === 200) {
            console.log(response);
            dispatch(setApproveMembers(response.data.users))
        }
    } catch (error) {
        console.log(error);
    }
}