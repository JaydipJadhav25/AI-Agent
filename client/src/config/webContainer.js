import { WebContainer } from '@webcontainer/api';

let webcontainerInstance = null;


export const getWebContainer = async() =>{
    console.log("webcontainer is  befor: " , webcontainerInstance === null , webcontainerInstance);
    if(webcontainerInstance === null){
    console.log("webcontainer is creating................: ");
        
        webcontainerInstance = await WebContainer.boot();

    }
    console.log("webcontainer is after: " , webcontainerInstance);

    return webcontainerInstance;

}
