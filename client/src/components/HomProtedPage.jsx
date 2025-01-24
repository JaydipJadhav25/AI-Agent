import { useEffect } from "react";
import { useNavigate } from "react-router-dom";




export default function HomProtedPage({children}) {
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    useEffect(()=>{

        if(!token){
            navigate("/login")
        }



    },[navigate, token]);



  return (
    <>
    {children}
    </>
  )
}
