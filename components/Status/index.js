//Import the style
import style from "./Status.module.css"
//Import userecoil state and response atom
import { useRecoilState } from "recoil"
import { Response } from "../../atom/modalAtom"
import { useEffect, useState } from "react";
export default function Status() {
   const [response, setResponse] = useRecoilState(Response);
   const [text, setText] = useState("Success")
  
   useEffect(()=>{
    if(response){
      if(Object.values(response)[1].status == 400){
        let message = JSON.parse(Object.values(response)[1].responseText).error
        if(message == "SubmitPost: Error validating body bytes: SubmitPost: Body or Image or Video is required if not reposting."){
            setText("Post cannot be empty.")
        }else if(message.includes("SubmitPost: Problem creating transaction: CreateSubmitPostTxn: Problem adding inputs: : AddInputsAndChangeToTransaction: Sanity check failed:")){
          setText("Insufficient amount of Deso.")
        }else{
          setText(message)
        }
      }else{
        setText("Success")
      }
      const hidestatus = setTimeout(closeStatus, 2000)
        return () => {
          clearTimeout(hidestatus);
        };
    }
   }, [response])

   function closeStatus(){
    setResponse(null)

   }
  //Return the status Jsx
  return (
    <>
        {response && 
            <div className={style.modal}>{text}</div>
        }
    </>
  )
}
//End of status component 
