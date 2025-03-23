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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import hljs from 'highlight.js';
import "highlight.js/styles/atom-one-dark.css"; // VS Code-like theme
import {getWebContainer } from "../config/webContainer"






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
  const[mode , setMode] = useState("public");
  const[fileTree , setFileTree] = useState({});
  const[currentFile , setCurrectFile] = useState(null);
  const [openFiles, setopenFiles] = useState([]);
  const [webContainer, setWebContainer] = useState(null);
  const[cureentProcess , setCureentProcess ] = useState(null);
  const [logs, setLogs] = useState([]);
  const logRef = useRef(null);
  const[iFreamUrl , setIfreamUrl] = useState(null);
  const[runProcess , setRunProcess] = useState(null);




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

  //getProject Deatils
 async function getProjectDetails (projectId){

  const responce = await axiosInstance.get(`/project/get/${projectId}`,{
    headers :{

        Authorization: `Bearer ${localStorage.getItem("token")}`
     
    }
  });

  console.log("reponse of  getProjectDetails : " , responce.data);
  
  setFileTree(responce.data.fileTree || {});


  }

  
  const userId = localStorage.getItem("userId");

  useEffect(() => {

    if (!project) return; // Ensure project is defined
  
    setProjectUsers(project?.users || []);
    handleShowUser();
    getProjectDetails(project._id);
  
    // Initialize socket connection
    console.log("projectId : " , project._id);
    initSocket(project._id);


    //create to check exsiting webContainers
    if (!webContainer) {
      getWebContainer()
        .then((container) => {
            setWebContainer(container);
            // alert("webCotainer created successfully..........")
        })
        .catch((err) => {
            console.error("Web container creation error!", err);
        });
    }

     sendMeesage("joinProject" , project._id , userId);

    //get online user

    
    receiveMessage("updateUsers" , (data)=>{
      //  console.log("received: count", data);
      //  console.log("received count", data.users.length);

       setOnlineUsers(data.users.length);

    })

  
   


  
    // Listen for incoming messages
    receiveMessage("message", async(data) => {
      // console.log("Message received:", data);
      // setRemoteUser(data.from);

      //convert into json formate

      console.log("incomming message : " , data)
     
          const messageObj = await JSON.parse(data.message);

          // const messageObj = await JSON.parse(data.message.trim());


          console.log("messageObj :", messageObj);

          console.log("filetree : " , messageObj.fileTree);

          // if(messageObj.fileTree){

          //   setFileTree(messageObj.fileTree);
          // }

          if (messageObj?.fileTree && typeof messageObj.fileTree === "object") {

            //mount the file strucher in webcontainer
            webContainer?.mount(messageObj.fileTree);

            setFileTree(messageObj.fileTree);

          }
          

        
      
          // console.log("Text inside messageObj:", messageObj.text);
      

      // setMessages((prev) => [...prev, { text: data.message, sender: data.from }]);// normal la/string
      setMessages((prev) => [...prev, { text: messageObj.text , sender: data.from }]);
    });


  //  receiveMessage("online" , (data)=>{
  //   console.log("online users : " , data);
  //   setOnlineUsers(data);
  //  })
  
  return () => {
    // Notify server that the user left the project
    // socket.emit("leaveProject", { userId, projectId });
    // console.log("User left project:");
    sendMeesage("leaveProject",project._id , userId)
};


  }, [project, userId ]);


//checking for webcontainer vlaue is updatinng
  useEffect(() => {
    if (webContainer) {
      console.log("Updated web container:", webContainer);
      // alert("Web container created successfully!");
    }
  }, [webContainer]);


  //////////////////// project log process
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight; // Auto-scroll
    }
  }, [logs]);
  

  
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
     sendMeesage("message" ,   message, localStorage.getItem("userId") , mode);

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

//handle update / save in database --- filetree

 async function saveFileTree(filetree){

  // console.log("filetree : " , filetree)

  if(!fileTree) {

    toast.error("their is not file to save it!",
      {
        position: "top-right",
        autoClose: 3000,
      }
    );

    return ;

  }
 
  try {
    const response  = await axiosInstance.put("/project/updatefiletree" , {
      projectId : project._id,
      fileTree :  filetree
    },{
      headers :{
           Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })


    console.log("Response : " , response.data);

    
    toast.success(" save code suceessfully ..!", {
      position: "top-right",
      autoClose: 3000,
    });


   
    
  } catch (error) {

    console.log("error : " , error.message);

    toast.error(
      error.response?.data?.message || "updatefiletree failed. Please try again!",
      {
        position: "top-right",
        autoClose: 3000,
      }
    );

    
  }


 }



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

              <div>
                <label htmlFor="public" className="text-lg font-semibold p-2">Public</label>
                <input type="radio"  value="public" name="mode"  id="public"   onClick={(e)=>{
                  console.log("btn cliked : " , e.target.value)
                  setMode(e.target.value);
                }}/>
                <label htmlFor="personal" className="text-lg font-semibold p-2">personal</label>
                <input type="radio"  value="personal" name="mode"  id="personal"   onClick={(e)=>{
                  console.log("btn cliked : " , e.target.value)
                  setMode(e.target.value);
              
                }}/>
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
              {msg.sender === "@Ai" 
              ?
              // <Markdown>{msg.text}</Markdown>
            
              
              <Markdown
              options={{
                overrides: {
                  code: {
                    component: ({ children, className }) => {
                      const language = className ? className.replace("lang-", "") : "javascript";
                      return (
                        <SyntaxHighlighter language={language} style={materialDark}>
                          {children}
                        </SyntaxHighlighter>
                      );
                    },
                  },
                },
              }}
            >
              { msg.text }

            </Markdown>

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

         {/* 2 */}
    <section className="right h-screen flex flex-grow w-[30%]">

    {/* expolrer */}
        <div className="expolere h-full max-w-64 min-w-52 bg-slate-200">
           <div className="file-tree w-full">
              {
                Object.keys(fileTree).map((file , index)=>(
                  <div key={index} className="tree-element cursor-pointer p-2 px-3 flex flex-col gap-2 bg-slate-300 active:bg-slate-400">
                  <p className="font-semibold text-lg" 
                  onClick={()=>{
                    setCurrectFile(file); //file name set
                    // setopenFiles([...openFiles , file]) //repated file also push
                    setopenFiles([ ...new Set([ ...openFiles, file ]) ]); //array
                  }}
                  >{file}</p>
                </div>
                ))
              }
           </div>
        </div>

        {/* codeEditer */}
 
             {/* {
            currentFile && ( */}


              <div className="code_editor flex flex-col flex-grow h-full w-full">

              {/* top */}
            <div className="top flex justify-between w-full">
                  <div className="file flex">

                          {
                            openFiles.map((file , index)=>(
                              <button
                              key={index}
                              onClick={() => setCurrectFile(file)} //setcurrect filename
                              className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-500' : ''}`}>
                              <p
                                  className='font-semibold text-lg'
                              >{file}
                      <i className="ri-close-line px-2" onClick={()=>{
                        // alert("hii.................")
                        //    let index = openFiles.indexOf(file);
                        //    if (index !== -1) {
                          //     openFiles.splice(index, 1); 
                          
                          // }
                          
                        }}></i> 
                              </p>
                          </button>
                            ))
                          }
                   {/* <p className="text-lg font-semibold p-2">{currentFile} */}
            

                   {/* <i className="ri-close-line px-2" onClick={()=>{
                    setCurrectFile(null)
                    }}></i>  */}
                    {/* </p>  */}
                    </div>

                    <div className="action">

                      <button
                       onClick={async()=>{

                        //mount the filetree
                          await webContainer?.mount(fileTree);

                          //check files
                      //   const isProcess = await webContainer?.spawn('ls');
                      //  //
                      //   isProcess.output.pipeTo(new WritableStream({
                      //     write(data) {
                      //       console.log("data of files : " ,data);
                      //       // alert("data of files : " ,data)
                      //     }
                      //   }));
                        //

                        //install imp
                        const installProcess = await webContainer?.spawn("npm" , ["install"]);
                        installProcess.output.pipeTo(new WritableStream({
                          write(chunk) {
                            console.log("installProcess : " ,chunk);
                            // setCureentProcess(data);    
                            setLogs((prevLogs) => [...prevLogs, chunk]); // Append logs                    
                          }
                        }));


                      


                       }}

                      className="p-2 px-4 bg-slate-100 text-lg font-semibold"
                      >setUp</button>

                      <button
                       onClick={async()=>{

                          await webContainer?.mount(fileTree);


                          if(runProcess){

                            runProcess.kill();

                          }

                        //runprocess
                        const tempRunProcess = await webContainer?.spawn("npm" , ["start"]);
                        tempRunProcess.output.pipeTo(new WritableStream({
                          write(data) {
                            console.log("runProcess : " ,data);
                            // setCureentProcess(data);
                            setLogs((prevLogs) => [...prevLogs, data]); // Append logs
                          }
                        }));
                        setRunProcess(tempRunProcess);

                        //server run after trigger iframe using events
                        webContainer?.on("server-ready" , (port , url)=>{
                          console.log("port : " , port , "Url : " , url);
                          setIfreamUrl(url);
                        })

                       }}
                      className="p-2 px-4 bg-slate-100 text-lg font-semibold"
                      >Run</button>
                      
                     {
                      fileTree && webContainer&& currentFile&&  <button
                      className="p-2 px-4 bg-slate-100 text-lg font-semibold"
                      onClick={()=>{
                         saveFileTree(fileTree);//save file in database
                        
                      }}
                      >
                        Save
                      </button>
                     }


                    </div>

               </div>

                      {/* bottom    */}
                       <div className="bottom flex flex-grow max-w-full overflow-auto">
                    {
                      fileTree[currentFile] //currect file all aceess
                      && (

                        // <textarea
                        // name="" id=""
                        // className="w-full h-full bg-slate-200 outline-none p-2"
                        // value={fileTree[currentFile].content}
                        // onChange={(e) =>{
                        //   setFileTree({
                        //     ...fileTree ,
                        //     [currentFile]:{
                        //       content :e.target.value
                        //     }
                        //   })
                        // }}
                        // >
                        // </textarea>
         <div className="code-editor-area h-full overflow-auto flex-grow bg-gray-900 text-white p-4 rounded-lg shadow-lg border border-gray-700">
    <pre className="hljs h-full p-4 rounded-lg overflow-auto text-sm leading-6 font-mono">
        <code
            className="hljs h-full outline-none"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
                const updatedContent = e.target.innerText;
                const ft = {
                  ...fileTree , 
                  [currentFile] : {
                    file : {
                      contents: updatedContent,
                    }
                  }
                }
                // setFileTree((preFileTree) => ({
                //     ...preFileTree,
                //     [currentFile]: {
                //        file :{
                //         ...preFileTree[currentFile].file,//all prefile content
                //         contents: updatedContent,
                //        }
                //     },
                // }));

                setFileTree(ft);//set file tree in state
               // saveFileTree(ft);//save file in database




            }}
            dangerouslySetInnerHTML={{
                __html: hljs.highlight(fileTree[currentFile].file.contents, { language: "javascript" }).value,
            }}
            style={{
                whiteSpace: "pre-wrap",
                paddingBottom: "25rem",
                counterSet: "line-numbering",
                outline: "none",
            }}
        />
    </pre>



    {/* show running process */}

    <div 
      ref={logRef}
      // className="bg-black text-green-400 p-4 h-64 overflow-y-auto rounded-lg font-mono overflow-hidden"
      className="bg-black text-green-400 p-4 h-64 rounded-lg font-mono overflow-hidden"
    >
 {logs.map((log, index) => (
        <div key={index}>{log}</div>
      ))} 
    </div>
       
</div>

                      )
                    }    
                       </div>
              </div>

                 {/* )} */}



       {/* output showw */}

     
      {
        iFreamUrl &&  (

          <div className="flex flex-col h-full w-[60%] overflow-hidden">
          <div className="addres-bar">
            <input
              type="text"
              value={iFreamUrl}
              onChange={(e) => setIfreamUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded hover:bg-yellow-200"
            />
          </div>
          <iframe
            src={iFreamUrl}
            className="w-full h-full border-none p-4"
            scrolling="no"
          ></iframe>
        </div>
        
        )
       } 
    
              


      </section>  


<ToastContainer/>
    </main>
 
   </>
  );
}

export default Project;
