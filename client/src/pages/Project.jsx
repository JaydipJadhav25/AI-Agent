import {  useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import UserSelectionModal from "../components/UserSelectionModal";
import axiosInstance from "../config/axiosConfig";
import { ToastContainer , toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initSocket  , sendMeesage , receiveMessage} from "../config/socketIo";
import {useContext} from "react"
import { UserContext } from "../context/UserContext";
import gsap from "gsap"
import Markdown from 'markdown-to-jsx'






function Project() {
  const location = useLocation();
  const navigate = useNavigate()
  const project = location.state?.project;
  const [isOpen, setIsOpen] = useState(false);
  const[projectUsers , setProjectUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users , setUsers] = useState([]);
  const [message, setMessage] = useState(""); // Current message input
  const [messages, setMessages] = useState([]); // Unified chat messages state
  // const[remoteUser , setRemoteUser] = useState(null);
  const[onlineUsers , setOnlineUsers] = useState(0);




const {user } = useContext(UserContext);
// console.log("current user : " , user);
    
// if(!user){
//   localStorage.clear("token")
//   localStorage.clear("userId" )
//  return navigate("/login")
// }
  

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


    // console.log("Response : " , response.data);

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


  
  const userId = localStorage.getItem("userId");

  useEffect(() => {

    if (!project) return; // Ensure project is defined
  
    setProjectUsers(project?.users || []);

    handleShowUser();
  
    // Initialize socket connection
    console.log("projectId : " , project._id)
    initSocket(project._id);

     sendMeesage("joinProject" , project._id , userId);



    //get online user

    receiveMessage("updateUsers" , (data)=>{
      //  console.log("received: count", data);
       console.log("received count", data.users.length);
       setOnlineUsers(data.users.length);

    })

  
   


  
    // Listen for incoming messages
    receiveMessage("message", (data) => {
      // console.log("Message received:", data);
      // setRemoteUser(data.from);

      setMessages((prev) => [...prev, { text: data.message, sender: data.from }]);
    });


  //  receiveMessage("online" , (data)=>{
  //   console.log("online users : " , data);
  //   setOnlineUsers(data);
  //  })
  
  return () => {
    // Notify server that the user left the project
    // socket.emit("leaveProject", { userId, projectId });
    console.log("User left project:");
    sendMeesage("leaveProject",project._id , userId)
};


  }, [project, userId]);









  
//    // Notify the server when the user leaves the page
//    document.addEventListener("visibilitychange", () => {
//     if (document.visibilityState === "hidden") {
//         // User left the page (or switched tabs)
//         // socket.emit("leaveProject", { userId: "user123", projectId: "project456" });
//         console.log("User left the project page.");
//     } else if (document.visibilityState === "visible") {
//         // User came back to the page
//         // socket.emit("joinProject", { userId: "user123", projectId: "project456" });
//         console.log("User joined the project page.");
//     }
// });




  //online

  useEffect(() => {
    const handleVisibilityChange = () => {
        // const currentPath = location.pathname;
        // const projectId = currentPath.split("/")[2];

        if (document.visibilityState === "hidden") {

          sendMeesage("leaveProject",project._id , userId)
            // socket.emit("leaveProject", { userId, projectId });
            console.log("User is inactive (tab hidden).");

        } else if (document.visibilityState === "visible") {
     sendMeesage("joinProject" , project._id , userId);
              
            // socket.emit("joinProject", { userId, projectId });

            console.log("User is active (tab visible).");
        }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
}, [location, project._id, userId]);












const toggleSidePanel = () => {
  setIsOpen(!isOpen);
  // Animate side panel sliding effect
  gsap.to(".side-panel", { x: isOpen ? "-100%" : "0", duration: 0.5, ease: "power2.out" });

};

   // Example user list
  //  const users = [
  //   { email: "user1@example.com" },
  //   { email: "user2@example.com" },
  //   { email: "user3@example.com" },

//listen event and add event using socket

const handlUserMessageSend = async()=>{
  // console.log("message:" , message ,);
     sendMeesage("message" , message, localStorage.getItem("userId"));

    setMessages((prev) => [...prev, { text: message, sender: "client" }]); // Update client messages
    setMessage(""); // Reset input field

}


// console.log(messages)

 // Create a ref for the chat container
 const messageBoxRef = useRef(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };
  
    // Scroll to the bottom when messages change
    useEffect(() => {
      scrollToBottom();
    }, [messages]); // Trigger scroll when messages array changes

  return (
   <>
    <main className="w-full h-screen flex">
      {/* 1 */}
<div className="w-[30%] h-screen flex">
 
      {/* Side Panel */}
      <div
        className={`side-panel fixed top-0 left-0 h-full w-[350px] bg-white shadow-lg transform transition-transform duration-300 ${
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
         <div className="flex justify-center p-1">
          <h1
          onClick={()=>{
            window.location.reload();
          }}
          className="bg-green-500 rounded-lg cursor-pointer p-1 hover:bg-orange-600"
          >Active Users :({onlineUsers})</h1>
         </div>
 
        {/* Chat Messages */}
        <div className="h-[75%] p-4 overflow-y-auto space-y-4">
          {/* User's message */}

            {/* <div className="flex flex-col items-end">
            <span className="text-sm text-gray-700">user@example.com</span>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-[75%]">
             {message}
            </div>
          </div> */}
          

          {/* Other user's message */}
         {/* <div className="flex flex-col items-start">
           <span className="text-sm text-gray-700">otheruser@example.com</span>
           <div className="bg-yellow-100 text-black px-4 py-2 rounded-lg max-w-[75%]">
           {message}
           </div>
         </div> */}
         

         {/* all messages */}

         <div 
  ref={messageBoxRef}
  className="scroll-container h-[480px] overflow-y-scroll pr-4 pl-4"
>
  {messages.map((msg, i) => (
    <div
      key={i}
      className={`flex flex-col ${
        msg.sender === "client" ? "items-end" : "items-start"
      }`}
    >
      <span className="text-sm text-black">
        {msg.sender === "client" ? "You" : msg.sender}
      </span>

      <div
        className={`px-4 py-2 rounded-lg max-w-[75%] ${
          msg.sender === "client"
            ? "bg-blue-500 text-white"
            : msg.sender === "@Ai"
            ? "bg-purple-500 text-black font-bold overflow-auto" // Highlight AI messages
            : "bg-yellow-100 text-black"
        }`}
      >
        {msg.sender == "@Ai" 
        ?
        <Markdown>{msg.text}</Markdown>
        : msg.text
        
        }
      </div>
    </div>
  ))}
</div>




         </div>

        {/* Input Field */}
          <form  onSubmit={(e)=>{
            e.preventDefault();
            handlUserMessageSend()
          }}
className="h-[10%] flex items-center bg-orange-200"
          >
      
          <input
          value={message}
onChange={(e)=>{
  setMessage(e.target.value);
}}

  type="text"
  className="flex-grow h-4/5 border-none focus:outline-none placeholder-gray-400 px-3"
  placeholder="Enter Message"
/>
<button className="text-3xl p-1 text-blue-500 hover:text-blue-700 focus:outline-none">
  <i className="ri-send-plane-fill"></i>
</button>
    
          </form>
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
