//Import Modal
import Modal from "react-modal";
//Import style
import style from "./Createcommunity.module.css";
//Import atom and the modal state
import { useRecoilState } from "recoil";
import { Community } from "../../atom/modalAtom";
import DesoApi from "../../Functions/Desoapi"
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

export default function CreateNFTModal() {
  //Set the state of the modal ie: open or close
  const [open, setOpen] = useRecoilState(Community)
  const router = useRouter()
  const deso = new DesoApi()
  const inputFile = useRef(null);
  const [banner, setBanner] = useState()
  const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [fr, setFr] = useState("")
    const [pic, setPic] = useState("/images/profile.png")
    const [bg, setBg] = useState("/images/Banner.webp")
    const [list, setList] = useState("")
  
  //Custom style to set the z-index of the modal
  const customStyles = {
    overlay: {
      background: "rgba(0,0,0,0.8)",
      zIndex: 1000,
    }
  };

  useEffect(()=>{
    const user = localStorage.getItem("deso_user_key")
    getProfile(user)
  },[])
  async function getProfile(user){
        
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
    if(value.ExtraData.CommunityList){
      setList(value.ExtraData.CommunityList)
      
    }
    const CurrentPic = await deso.getSingleProfilePicture(user)

    getBase64FromUrl(CurrentPic)

    
    
    }catch(error){
        return 
    }
}
    
  async function createCommunity(){
    const name = document.getElementById("name").value
    const description = document.getElementById("description").value
    if(name.length > 0 && name != null && description.length > 0 && description != null && banner){
        alert("Creating community...")
        setOpen(false)
        
        const response = await deso.createCommunity(localStorage.getItem("deso_user_key"), name, description, banner).then(async function update(res){
        let listupdate;
        if(list){
          let value = list
          setList(value.concat(`,${res.submittedTransactionResponse.PostEntryResponse.PostHashHex}`))
         listupdate = value.concat(`,${res.submittedTransactionResponse.PostEntryResponse.PostHashHex}`)
        }else{
          setList(res.submittedTransactionResponse.PostEntryResponse.PostHashHex)
          listupdate = res.submittedTransactionResponse.PostEntryResponse.PostHashHex
        }
         updateUserList(listupdate)
      })
      
    }
  }
  async  function updateUserList(listupdate){
    
    let communitylist = listupdate.split(",")
    let latestCommunityList = communitylist[communitylist.length - 1]

    const response = await deso.addToCommunityList(localStorage.getItem("deso_user_key"), username, bio, fr, pic, bg, listupdate)
    router.push(`/community/${latestCommunityList}`)
    
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
    });
  }
  //On image button click, click on the input field.
  //Set the selected file as the image url
  const changeHandler = (event) => {
    //Get the selected image
    const img = event.target.files[0];
    getImageUrl(img)
    
  };
  async function getImageUrl (result){
    const user = localStorage.getItem("deso_user_key")
    const JWT = await deso.getJwt(user)
    const link = await deso.uploadImage(user, JWT, result)
    alert("Image uploaded")
    setBanner(link.ImageURL)
  }
  //Return the html
  return (
    <Modal
      isOpen={open}
      onRequestClose={() => setOpen(false)}
      ariaHideApp={false}
      style={customStyles}
      className={style.modal}
    >
     <h1>Create A Community!</h1>
     <input id="name" className={style.name} placeholder="Name"/><br></br>
     <textarea id="description" rows={7} className={style.description} placeholder="Description"/><br></br>
     <label className={style.label} htmlFor="file-upload" >
        Upload a banner
     <input id="file-upload" style={{display:"none"}}  alt="uploadImage"
          type="file"
          accept="image/*"
          name="file"
          ref={inputFile}
          onChange={changeHandler}/><br></br>
     </label>
     <button onClick={()=> createCommunity()} className={style.button}>Create</button>
     
      
    </Modal>
  );
}
