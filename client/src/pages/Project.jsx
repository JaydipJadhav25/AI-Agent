import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserSelectionModal from "../components/UserSelectionModal";
import axiosInstance from "../config/axiosConfig";
import { ToastContainer , toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initSocket } from "../config/socketIo";



function Project() {
  const location = useLocation();
  const navigate = useNavigate()
  const project = location.state?.project;
  const [isOpen, setIsOpen] = useState(false);

  const[projectUsers , setProjectUsers] = useState([]);

  const [addedUsers, setAddedUsers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

    const [users , setUsers] = useState([]);



    
  
  

  const handleAddUser = async(data) => {

    // console.log("function call............" , data);

    // setAddedUsers((prevUsers) => [...prevUsers, ...data]);

  try {
    const response  = await axiosInstance.put("/project/adduser" , {
      projectId : project._id,
      users :  data
    },{
      headers :{
           Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })


    console.log("Response : " , response.data);

     toast.success("Add-Users  successful!", {
      position: "top-right",
      autoClose: 3000,
    });

    setTimeout(() => {
      // navigate("/home");
      //  // Replace "/home" with the correct route
      console.log("call................................")
      navigate("/");
    }, 1500);


   
    
  } catch (error) {
    console.log("error : " , error.message);
    toast.error(
      error.response?.data?.message || "Add-Users failed. Please try again!",
      {
        position: "top-right",
        autoClose: 3000,
      }
    );

    
  }


    // console.log("addusers function call : " , addedUsers);

  };


  // function demo(data){
  //   console.log("demo function call..................." , data);
  // }


  const handleShowUser = async()=>{
    const responce = await axiosInstance.get("/user/all" ,{
      headers :{

          Authorization: `Bearer ${localStorage.getItem("token")}`
       
      }
    });

    console.log("reponse : " , responce.data);
    setUsers(responce.data)
  }


  
  useEffect(()=>{

    //socket io connection
    const socket = initSocket(project._id);
  


    
    // console.log("project : ", project);
    setProjectUsers(project.users);
    handleShowUser()



},[project]);


  const toggleSidePanel = () => {
    setIsOpen(!isOpen);
  };

   // Example user list
  //  const users = [
  //   { email: "user1@example.com" },
  //   { email: "user2@example.com" },
  //   { email: "user3@example.com" },

  

  return (
   <>
    <main className="w-full h-screen flex">
      {/* 1 */}
<div className="w-[30%] h-screen flex">
  
      
      {/* Side Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[350px] bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
         <div className="w-full flex justify-between pr-4 bg-gray-200 pt-3">
            <h1 className="text-2xl font-bold w-[50%] text-center">Collabroters</h1>
         <h2 className="text-lg font-bold mb-4 cursor-pointer bg-slate-400 p-1 rounded-full px-3 active:bg-blue-600" onClick={toggleSidePanel}><i className="ri-arrow-left-long-line"></i></h2>      </div>
         <section className="w-full h-full">
      

        {/* User List */}
        <div className="h-[90%] p-4 overflow-y-auto space-y-4">
          
          {projectUsers.map((user, index) => (

            <div
              key={index}
              className="flex items-center space-x-4 bg-slate-300  p-3 rounded-lg shadow-sm"
            >
              {/* Dummy profile picture */}
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3tCR6ICfkzTmrIugDHksAzpKGe1y8wse7Sg&s"
                alt="User Profile"
                className="w-10 h-10 rounded-full"
              />
              {/* User email */}
              <span className="text-sm font-medium text-gray-800">
                {user.email}
              </span>
            </div>
          ))}
        </div>
        </section>
     

        </div>
      </div>

      {/* Main Chat Section */}
      <section className="left bg-slate-300 w-full h-full">
        {/* Header */}
        <header className="bg-gray-500 w-full h-[10%] flex justify-between p-5">
          
        <div
        onClick={()=>setIsModalOpen(true)}
        className="p-1 cursor-pointer rounded-lg active:border-2 border-white flex items-center">
          <i className="ri-add-fill text-lg font-semibold">Add Collebroter</i>
          </div>

          <i
            className="ri-group-line font-semibold text-lg cursor-pointer border-2 border-black p-3 flex justify-center items-center rounded-[50%] hover:bg-orange-500"
            onClick={toggleSidePanel}
          >{project.users.length}</i>
         
        </header>

        {/* Chat Messages */}
        <div className="h-[80%] p-4 overflow-y-auto space-y-4">
          {/* User's message */}
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-700">user@example.com</span>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-[75%]">
              Hi! This is my message.
            </div>
          </div>

          {/* Other user's message */}
          <div className="flex flex-col items-start">
            <span className="text-sm text-gray-700">otheruser@example.com</span>
            <div className="bg-yellow-100 text-black px-4 py-2 rounded-lg max-w-[75%]">
              Hello! This is a reply from another user.
            </div>
          </div>
        </div>

        {/* Input Field */}
        <div className="h-[10%] flex items-center">
          <input
            type="text"
            className="flex-grow h-4/5 border-none focus:outline-none placeholder-gray-400 px-3"
            placeholder="Enter Message"
          />
          <button className="text-3xl p-1 text-blue-500 hover:text-blue-700 focus:outline-none">
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>
      </section>
</div>

       {/* add user module */}
       {isModalOpen && (
        <UserSelectionModal  users={users}  handleAddUser={handleAddUser} addedUsers={ projectUsers }  setIsModalOpen={setIsModalOpen}  />
      )}


<ToastContainer/>
    </main>
 
   </>
  );
}

export default Project;
