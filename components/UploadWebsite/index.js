//Import Modal
import Modal from "react-modal";
//Import style
import style from "./UploadWebsite.module.css";
//Import atom and the modal state
import { useRecoilState } from "recoil";
import { UploadWesite } from "../../atom/modalAtom";
import {useState, useEffect} from 'react';
import DesoApi from "../../Functions/Desoapi";
export default function BuyCoinModal() {
  //Set the state of the modal ie: open or close
  const [open, setOpen] = useRecoilState(UploadWesite);
  const [selectedFile, setSelectedFile] = useState();
  const html = []
  const images = []
  const final = []
  const deso = new DesoApi()
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [fr, setFr] = useState("")
    const [pic, setPic] = useState("/images/profile.png")
    const [bg, setBg] = useState("/images/Banner.webp")
    const [web, setWeb] = useState("")
	
  //Custom style to set the z-index of the modal
  const customStyles = {
    overlay: {
      background: "rgba(0,0,0,0.8)",
      zIndex: 1000,
    }
  };

  const changeHandler = (event) => {
		setSelectedFile(event.target.files);
	};
	const handleSubmission =() => {
    

    document.getElementById("upload").style.display = "none"
    document.getElementById("uploading").style.display = "block"

      
    
    
      Object.keys(selectedFile).forEach(i =>{
        let fr = new FileReader()
        if(selectedFile[i].type.includes("image")){
          let file = selectedFile[i];
          uploadimage(selectedFile[i].name, file)
          
        }else{
          
          fr.readAsText(selectedFile[i]);
          fr.onload = function () {
            if(selectedFile[i].name.includes(".html")){
              html.push(fr.result)

            }else{
              console.log(selectedFile[i].name, fr.result)
              final.push({[selectedFile[i].name]: fr.result})
            }
            
          }
        }
        
        
      })
      setTimeout(() => {
        document.getElementById("uploading").style.display = "none"
        document.getElementById("submit").style.display = "inline-block"
      }, 7000); 
      
    }
    async function uploadimage(imagename, file){
      const user = localStorage.getItem("deso_user_key")
      const jwt = deso.getJwt(user)
      const response = await deso.uploadImage(user, jwt, file)
      
      const image = {[imagename]: `${response.ImageURL}`}
      images.push(image);
    }
    async function compress(){
      
      
      for (let i = 0; i < html.length; i++) {
        for (let k = 0; k < images.length; k++) {
          const element = images[k];
          Object.keys(element).forEach(key =>{
           
            console.log(element[key])
            let find = `images/${key}`
            let string = html[i].replace(new RegExp(find,'g'), element[key])
            final.push({[selectedFile[i].name]: string})
           
          })
        } 
       
      }

      const user = localStorage.getItem("deso_user_key")
      const name = await deso.UsernameByPublickey(user)
     
      const response = await deso.hostWebsite(user, name, final)
      setWeb(response.submittedTransactionResponse.PostEntryResponse.PostHashHex)
      saveWebsite()
    }


    async function saveWebsite(){
      const user = localStorage.getItem("deso_user_key")
      const response = await deso.getSingleProfile(user)
      try{
        const value = response.Profile
    
        if(value.Username){
            setUsername(value.Username)
        }
        if(value.Description){
            setBio(value.Description)
        }
        if(value.CoinEntry.CreatorBasisPoints){
            setFr(value.CoinEntry.CreatorBasisPoints) 
        }
        if(value.ExtraData.FeaturedImageURL){
            setBg(value.ExtraData.FeaturedImageURL)
        }
        
    const CurrentPic = await deso.getSingleProfilePicture(user)

    getBase64FromUrl(CurrentPic)

    
    
    }catch(error){
        return 
    }
    }
    const getBase64FromUrl = async (url) => {
   
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = () => {
          const base64data = reader.result;  
          setPic(base64data)
          
          
        }
        saveInfo()
      });
      
    }
    async function saveInfo(){
      const user = localStorage.getItem("deso_user_key")
     
      const result = await deso.addToWeb(user, username, bio, fr, pic, bg, web)
      setOpen(false)
    }
    useEffect(()=>{
      saveInfo()
    }, [pic])
    
    
    
 
	;
  //Return the html
  return (
    <Modal
      isOpen={open}
      onRequestClose={() => setOpen(false)}
      ariaHideApp={false}
      style={customStyles}
      className={style.modal}
    >
      <h1>Upload your folder</h1>
      <p>Download <a href="#"  style={{color:"var(--color-primary)"}}  onClick={()=> window.location.replace("https://drive.google.com/drive/folders/1mNqOj8CLhwTKN7cKZxO4ImCyePWLqdOs?usp=sharing")}>this</a> example folder</p>
      <div>
        <div className={style.dragArea}>
          <input type="file" name="file" onChange={changeHandler} webkitdirectory = "true" multiple />
        </div>
			
			<div>
				<button id="upload" className={style.dragButton} onClick={handleSubmission}>Upload</button>
        <p id="uploading" style={{display:"none"}}>Uploading...</p>
        <button id="submit" className={style.dragButton} style={{display:"none"}}   onClick={()=> compress()}>Submit</button>
			</div>
      
		</div>

      
    </Modal>
  );
}
