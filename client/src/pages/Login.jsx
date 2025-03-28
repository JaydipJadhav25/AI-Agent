import {Link} from "react-router-dom"
import {useForm } from "react-hook-form"
import axiosInstance from "../config/axiosConfig";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { ToastContainer , toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";



export default function Login() {


  const {register , handleSubmit} = useForm();

  const {user , setUser} = useContext(UserContext);

  const navigate = useNavigate();

console.log("current user : " , user);

  const submitHandler = async(data)=>{
    // console.log("data : " , data);
   try {
    const responce = await  axiosInstance.post("/user/login" , {
       email :data.email,
       password : data.password
     })
 
     console.log("response : " , responce.data);
    //  setUser(responce.data.user);
     toast.success("login successful!", {
      position: "top-right",
      autoClose: 3000,
    });

     //set token
     localStorage.setItem("token" , responce.data.token);
     localStorage.setItem("userId" , responce.data.user._id)

    await setUser(responce.data.user);

    navigate("/")

   } catch (error) {

    console.log("error : " , error);
    toast.error(
      error.response?.data?.message || "Login failed. Please try again!",
      {
        position: "top-right",
        autoClose: 3000,
      }
    );
    
    // window.location.reload();


   }
    


  }




  return (
    <>
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    {/* <img className="mx-auto w-9 h-9" src="/public/user.png" alt="Your Company" /> */}


    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Login</h2>

  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form  
    onSubmit={handleSubmit(submitHandler)}

      className="space-y-6" >
      <div>
        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
        <div className="mt-2">
          <input
     {...register("email")}
          type="email" name="email" id="email" autoComplete="email" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
        </div>
      </div>


      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
          <div className="text-sm">

          </div>
        </div>
        <div className="mt-2">
          <input
  {...register("password")}
          type="password" name="password" id="password" autoComplete="current-password" required className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
        </div>
      </div>

      <div>
        <button

        type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login</button>

      </div>
    </form>

    <p className="mt-10 text-center text-sm/6 text-gray-500">
      Not a member?
      <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500"><Link to="/signup">Create Account</Link></a>
    </p>

  </div>
  <ToastContainer/>
</div>
    </>
  )
}
