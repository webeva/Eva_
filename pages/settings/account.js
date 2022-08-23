import SettingBar from "../../components/SettingBar"
import { useState, useEffect, useRef } from "react"
import DesoApi from "../../Functions/Desoapi"
import style from "../../styles/Settings.module.css"
import { useRecoilState } from "recoil"
import { HasAccount } from "../../atom/AppStateAtom"
import { Response } from "../../atom/modalAtom"
//Import dynamic loading from next
import dynamic from "next/dynamic";
const Status = dynamic(()=> import("../../components/Status"))


export default function Account() {
    const deso = new DesoApi()
    //Set up all the values the user can change
    const [username, setUsername] = useState("")
    const [bio, setBio] = useState("")
    const [fr, setFr] = useState("")
    const [pic, setPic] = useState("/images/profile.png")
    const [bg, setBg] = useState("/images/Banner.webp")
    const [isMobile, setIsMobile] = useState(false)
    const ProfileinputFile = useRef(null);
    const BannerinputFile = useRef(null);
    const [HasAnAccount] = useRecoilState(HasAccount)
    const [response, setResponse] = useRecoilState(Response)
    //Get the current user information
    useEffect(()=>{
        const user = localStorage.getItem("deso_user_key")
        if(user){
            getProfile(user)
        }
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        if(vw < 700){
           
            setIsMobile(true)
        }

    }, [])

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
            setFr(value.CoinEntry.CreatorBasisPoints/100) 
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
        });
      }
    //Save the updated information

    async function updateProfile(){
        //Check the fr to make sure it is valid
        let checkedFr = parseInt(fr)
        if(checkedFr > 100){
            alert("Fr cannot be greater then 100")
        }else{
            checkedFr = checkedFr * 100
        }
        const response = await deso.updateInfo(localStorage.getItem("deso_user_key"), username, bio, checkedFr, pic, bg)
        setResponse(response)
            
    }
    //Clicks the banner upload image input
    function clickBanner(){
        BannerinputFile.current.click()
    }
    //Clicks the profile picture upload image input
    function clickProfile(){
        ProfileinputFile.current.click()
    }

    const changeProfile = (event) => {
        //Get the selected image
        const img = event.target.files[0];
        var reader = new FileReader();
        reader.onloadend = function() {
            setPic(reader.result)
        }
        reader.readAsDataURL(img);
    }


      const changeBanner = (event) => {
        //Get the selected image
        const img = event.target.files[0];
        setBanner(img)
    }
    async function setBanner(result){
        const user = localStorage.getItem("deso_user_key")
        const JWT = await deso.getJwt(user)
        const link = await deso.uploadImage(user, JWT, result)
        setBg(link.ImageURL)
      }
    function buyDeso(){
        window.location.replace("https://diamondapp.com/buy-deso")
    }
    function starterDeso(){
        const user = localStorage.getItem("deso_user_key")
        window.open('https://identity.deso.org/verify-phone-number?public_key=' + user)
    }
  return (
    <>
    <Status></Status>
    <div  className="pageIdentify">
    <img alt="back" className={style.back} onClick={()=> history.back()}  src="/Svg/back.svg" width={30} height={30}/>
            <p id="pageidentify" style={{display:"inline"}}>Settings</p>
            
        </div>
        {isMobile ? <div></div>: <SettingBar/>}
        
    <div  className={style.content}>
    {HasAnAccount? <div></div>: <div className={style.buyDeso} >
        <h2 style={{color:"var(--color-white)"}}>To Create A Profile You Need Some DeSo</h2>
        <p style={{color:"var(--color-white)", paddingRight:"100px"}}>DeSo is a cryptocurrency used on Eva. To get started you only need 0.001 DeSo or around $0.01 USD</p>
        <button onClick={()=> starterDeso()}  style={{color:"var(--color-white)", borderRadius:"15px", background:"var(--color-primary)", width:"fit-content", paddingLeft:"2vw", paddingRight:"2vw", height:"8vh", cursor:"pointer", fontSize:"15px", marginBottom:"4vh"}}>Get Free Deso</button>
        <button onClick={()=>buyDeso()} style={{color:"var(--color-white)", borderRadius:"15px", background:"var(--color-primary)", width:"fit-content", paddingLeft:"2vw", paddingRight:"2vw", height:"8vh", cursor:"pointer", fontSize:"15px", marginLeft:"1vw"}}>Buy $Deso</button>
        
        
        </div>}
        <input alt="uploadedProfileImage" type="file" accept="image/*" ref={ProfileinputFile} style={{display:"none"}} onChange={changeProfile}/>
        <input alt="uploadedBannerImage" type="file" accept="image/*" ref={BannerinputFile} style={{display:"none"}} onChange={changeBanner}/>



        <img  onClick={()=> clickBanner()} src={bg} alt="CurrentBanner" className={style.banner} loading="eager"></img>
        <img id="currentProfile" onClick={()=> clickProfile()} src={pic} alt="CurrentImage" loading="lazy" className={style.profileBig}></img>
        <div className={style.inputAccount}>
            <input onChange={e => setUsername(e.target.value)} value={username} placeholder="Change your Username" style={{color: "var(--color-white)",fill: "white",fontSize: "16px",fontWeight: 400,letterSpacing: "0px",lineHeight: "24px",backgroundColor: "transparent",overflow: "hidden",transition: "all 0.1s ease-out 0s",width: "35vw"}}/>
        </div>
       
            
        <textarea onChange={e => setBio(e.target.value)} value={bio} placeholder="Change your Bio" rows={6}  style={{padding: "8px 8px", marginTop:"5vh", color: "var(--color-white)",fill: "rgb(104, 115, 141)",fontSize: "16px",fontWeight: 400,lineHeight: "24px",backgroundColor: "transparent",transition: "all 0.1s ease-out 0s",width: "100%", outline: "var(--color-primary) solid 1px", borderRadius:"10px", resize: "none"}}/>
        <div style={{lineHeight: 1,marginTop:"5vh",borderRadius: "16px",display: "flex",maxWidth: "100%",minWidth: "fit-content",outline: "var(--color-primary) solid 1px",position: "relative",transition: "all 0.1s linear 0s",height: "40px",padding: "8px 16px",}}>
            <input type="number" min={1} max={100} maxLength={3} onChange={e => setFr(e.target.value)} value={fr}  placeholder="Founder Reward Percentage" style={{color: "var(--color-white)",fill: "rgb(104, 115, 141)",fontSize: "16px",fontWeight: 400,letterSpacing: "0px",lineHeight: "24px",backgroundColor: "transparent",overflow: "hidden",transition: "all 0.1s ease-out 0s",width: "35vw"}}/>

        </div>
        

        <button onClick={()=>updateProfile()} className={style.button}>Update</button>
    </div>
    
    </>
  )
}
