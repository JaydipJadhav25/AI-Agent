import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import axiosInstance from "../config/axiosConfig";
import { toast , ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  
  const {user } = useContext(UserContext);
    console.log("current user : " , user);

const[projectPanel , setProjectPanel] = useState(false);
const [projectName, setProjectName] = useState("");


const token  = localStorage.getItem("token");

const handleCreate = async() => {
try {
  
const response = await axiosInstance.post("/project/create", {
  name: projectName
}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
console.log("respone : " , response);
toast.success("Project created successful!", {
  position: "top-right",
  autoClose: 3000,
});
setProjectPanel(false);



// alert(`Project "${projectName}" created!`);

} catch (error) {

  console.log("error : " , error);
  toast.error(
    error.response?.data?.message || "Create Project Error. Please try again!",
    {
      position: "top-right",
      autoClose: 3000,
    }
  );

  
}finally{
  setProjectName(""); 
}



  // Clear the input field
};

const handleCancel = () => {
  setProjectName(""); // Clear the input field
};





  return (
   <>
    <main className="p-4">

<div className="p-4">

          <button
          onClick={()=>setProjectPanel(true)}
          className="border-2 p-3 rounded-md active:bg-yellow-400"
          >New Project 
          <i  className="ri-link font-semibold"></i>
          </button>
     
   {
    projectPanel &&
    <div className="bg-black bg-opacity-50 fixed inset-0 h-screen flex justify-center items-center">
    
      <div className="bg-white shadow-lg rounded-lg p-6 w-[90%] max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create Project</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          handleCreate();
          }}
        >
          <div className="mb-4">
            <label
              htmlFor="projectName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name of Project
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Create
            </button>
            <button
              type="button"
             onClick={()=>
              {
                setProjectPanel(false)
             handleCancel()
             }}
              className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

     
   }

</div>

<ToastContainer/>

</main>
 
   </>
  )
}
