import { useContext } from "react";
import { AuthContext } from "../providers/AuthContext";

const useAuth=()=> useContext(AuthContext);

export default useAuth;