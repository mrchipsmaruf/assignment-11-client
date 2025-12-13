import axios from "axios";

const saveUserToDB = async (userInfo) => {
    const res = await axios.post(
        "http://localhost:3000/users",
        userInfo
    );
    return res.data;
};

export default saveUserToDB;
