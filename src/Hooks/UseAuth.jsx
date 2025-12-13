import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext/AuthContext";

const UseAuth = () => {
    return useContext(AuthContext);
};

export default UseAuth;
