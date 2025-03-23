import dotenv from "dotenv"
dotenv.config();
import {GoogleGenerativeAI} from "@google/generative-ai"






const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
     model: "gemini-1.5-flash" ,
     generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
    },
    systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.
    
    Examples: 

    <example>
     IMPORTANT : don't use file name like routes/index.js 
     IMPORTANT : follow give structure 
    user:Create an express application 
    response: {

    "text": "this is you fileTree structure of the express 
    server",

    "fileTree": {
      "app.js": {
             file: {
                contents: "
                const express = require('express');


                const app = express();

              app.use(express.json());
                app.use(express.urlencoded({extended : true}));
         


                app.get('/', (req, res) => {
                    res.send('Hello World! 🥳');
            
                });

                app.listen(8000, () => {
                    console.log('Server is running on port 8000');
                })

                
                "
            
        },
    },

  "package.json": {
            file: {
                contents: "

                     {
                    "name": "temp-server",
                    "version": "1.0.0",
                    "main": "index.js",
                    "scripts": {
                        "test": "echo \"Error: no test specified\" && exit 1"
                    },
                    "keywords": [],
                    "author": "",
                    "license": "ISC",
                    "description": "",
                    "dependencies": {
                        "express": "^4.21.2"
                    }

                "
            }

        },
    "routes.js" :{
    file : {
         content : "
                        const express = require('express');
                const router = express.Router();

                router.get('/', (req, res) => {
                res.json({ message: 'Welcome to the API!' });
                });

                // Add more routes here...

                module.exports = router;
         "
    }
    }  ,
  
 "README.md" :{
 file : {
 contents : "
          # Express Server

A basic Express.js server with error handling and modular routing.
 "}
 }   
    

    },

"buildCommand": {
        mainItem: "npm",
            commands: [ "install" ]
    },

 "startCommand": {
        mainItem: "node",
            commands: [ "app.js" ]
    }
}

  
 IMPORTANT : don't use file name like routes/index.js

   
    </example>


    
      <example>

       user:Hello 
       response:{
       "text":"Hello, How can I help you today?"
       }
       
       </example>
       
    `


});

// const prompt = "Explain how AI works";

// const result = await model.generateContent(prompt);
// console.log(result.response.text());


export const genrateResult = async(prompt) =>{

const result = await model.generateContent(prompt);

return result.response.text()

}