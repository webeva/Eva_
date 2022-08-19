/* This is a dynamic url which displays
whatever username is written after 
profile/ in the url. This page will be rendered
dependent of whether the user is logged in or not.
If an unlogged user tries to follow this user
they will be redirected to the /auth page */


import Head from "next/head"
import style from "../../styles/Profile.module.css"
//Import Deso Api 
import DesoApi from '../../Functions/Desoapi';
//Import from React 
import { useEffect, useState } from "react";
//Import Useroute from next
import {useRouter} from "next/router"
//Import Messages in feed
import MessageInFeed from "../../components/MessageInFeed"
import dynamic from "next/dynamic";
const CommentModal = dynamic(() => import('../../components/CommentModal'))
const BuyCoinModal = dynamic(() => import("../../components/BuyCoinModal.js/index.js"))
const CreateNft = dynamic(()=> import("../../components/CreateNFT"))
const EditPost = dynamic(()=> import("../../components/EditPostModal"))
//Import recoil and the buy creator coin modal state
import { useRecoilState } from "recoil";
import { CreatorState } from "../../atom/modalAtom";


export default function Profile(username, res){
  const deso  = new DesoApi()
  const router = useRouter()
  //Get the current post id
  const {id} = username.username
  const [info, setInfo] = useState({})
  const [profile, setProfile] = useState("/images/profile.png")
  const [pageExist, setPageExist] = useState(true)
  const [userPage, setUserPage] = useState(false)
  const [isFollowing, setIsFollowing] = useState("Loading")
  const [banner, setBanner] = useState("/images/Banner.webp")
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [media, setMedia] = useState("fake")
  //Set the state of the modal ie: open or close
  const [open, setOpen] = useRecoilState(CreatorState);
  const [isLogged, setIsLogged] = useState(true)
  

   useEffect(()=>{
    async function getInfo(id){
      try{
        const response = await deso.getSingleProfileByUsername(id)
        const currentUser = localStorage.getItem("deso_user_key")
        if(currentUser){
          setIsLogged(true)
        }else{
          setIsLogged(false)
        }
       
        setInfo(response.Profile)
        //Get the followers and following amount
        let followeramount = Object.values(await deso.getFollowers(id))[1]
        let followingamount = Object.values(await deso.getFollowing(id))[1]
        setFollowers(followeramount)
        setFollowing(followingamount)
       
        

        //Get the user banner if they have one
        try{
          if(response.Profile.ExtraData.FeaturedImageURL){
            setBanner(response.Profile.ExtraData.FeaturedImageURL)
          }else{
            setBanner("/images/Banner.webp")
          }
          
        }catch(error){
          setBanner("/images/Banner.webp")
          
        }
       
        getProfile(response.Profile.PublicKeyBase58Check) 
        checkIfFollow(currentUser, id)
        

      }catch(error){
        console.log(error)
        setPageExist(false)
      }
    }
    async function checkIfFollow(currentUser, username){
      if(localStorage.getItem("deso_user_key")){
        //The user is logged in
        const id = await deso.PublicKeyByUsername(username)
        if(currentUser == id){
          setUserPage(true)
        }else{
          setUserPage(false)
          const Following = await deso.checkFollow(currentUser, id)
          if(Following.data.IsFollowing == true){
            //Is following
            setIsFollowing("Unfollow")
          }else{
            //Is not following
            setIsFollowing("Follow")
          }
        
        }
      }else{
        setUserPage(false)
        setIsFollowing("Log in")
      }
      

    }
    async function getProfile(id){
     
      const response = await deso.getSingleProfile(id)
      try{
        if(response.Profile.ExtraData.NFTProfilePictureUrl){
          setProfile(response.Profile.ExtraData.NFTProfilePictureUrl)
        }else{
          const response = await deso.getSingleProfilePicture(id)
          setProfile(response)
        }
      }catch(error){
        
        const response = await deso.getSingleProfilePicture(id)
        setProfile(response)
      }
      
     
      
    }
    
      if(id){
        getInfo(id)
        
      }
      
   }, [id])

   /* This function will follow/unfollow if the page is not 
   the user's page and will bring you to the edit profile page
   if it is */

   async function FollowEdit(state){
      if(state){
        //This is the user's profile page
        router.push("/settings/account")
      }else{
        if(localStorage.getItem("deso_user_key")){
         
          //The user is logged in
          //This is not the user's profile page
          
          let isUnfollow;
          if(isFollowing == "Unfollow"){
           
            isUnfollow = true
            document.getElementById("followState").innerText = "Follow"
            setIsFollowing("Follow")
          }else if(isFollowing == "Log in"){
            router.push("/auth")
          }else{
            
            isUnfollow = false
            document.getElementById("followState").innerText = "Unfollow"
            setIsFollowing("Unfollow")
          }   
          
          const publickKey = await deso.PublicKeyByUsername(id)
         
          const response = await deso.followUser(localStorage.getItem("deso_user_key") , publickKey , isUnfollow)
        }else{
          //The user is not logged in 
          router.push("/auth") 
        }
      }
   }
   function renderTags(content){
    if(content){
      let innerText = content.replace(/(@(?:[^\x00-\x7F]|\w)+)/g, mention => {
        return `<a  href="/profile/${mention.substring(1)}" >${mention}</a>`;
      })
      innerText = innerText.replace(/(#(?:[^\x00-\x7F]|\w)+)/g, hashtags => {
        return `<a  href="/search/post/${hashtags.substring(1)}" >${hashtags}</a>`;
      })
      innerText = innerText.replace(/([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gm, links => {
        if(links.includes("http")){
          return `<a  href="${links}" >${links}</a>`;
         }else{
          return `<a  href="https://${links}" >${links}</a>`;
         }
      })
      
      
      return <div dangerouslySetInnerHTML={{__html: innerText}}></div> 
    }
     
  }

    return (
        
        <>
        <Head>
            <title>{info.Username} on Eva</title>
            <meta charset="UTF-8"></meta>
            <meta property="og:title" content={info.Username}/>
            <meta name="description"  content={info.Description} data-rh = "true"/>
            <meta name="robots" content="index, archive" />
            <meta name="twitter:title" content={info.Username}/>
            <meta name="twitter:description" content={info.Description}/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </Head>
        
        <div  className="pageIdentify">
              <img className={style.back} onClick={()=> history.back()}  src="/Svg/back.svg" width={30} height={30} alt="back"/>
              <p id="pageidentify" style={{display:"inline"}}>{info.Username}</p>
              <div style={{marginLeft:"55vw", display:"inline-block"}} className="details"></div>
            </div>
        <CommentModal/>
        <BuyCoinModal></BuyCoinModal>
        <CreateNft></CreateNft>
        <EditPost></EditPost>
        <img loading="lazy" alt="profilebanner" id="profileBanner" className={style.profileBanner} src={banner ? banner : "/images/banner.webp" }></img>
        <div className={style.pfpContainer}>
          <img loading="lazy" alt={style.profilepfp} id="profilePFP" className={style.profilePFP} src={profile}></img>
          <div id="profileName" className={style.profileName} style={{display:"inline"}}>@{info.Username} (≈ {Number(info.CoinPriceDeSoNanos/1000000000).toFixed(3)} Deso){info.IsVerified ? <img width={22} height={22} style={{display:"inline-block", marginLeft:"5px", verticalAlign:"middle"}} alt="Verified" src="/Svg/verify.svg"/> : ``}</div>
          <div className={style.profileWallet}>{info.PublicKeyBase58Check}</div>
         
              <div id="followState" onClick={()=> FollowEdit(userPage)} className={style.profileEdit}>{userPage ? "Edit": isFollowing }</div>
              <div onClick={()=> setOpen(!open)} className={style.buy}>Buy</div>
          
              <div><div id="profileBio" className={style.profileBio}>{renderTags(info.Description)}<br></br><br></br>
          </div> </div>
          <div id="profileinfo" style={{marginTop:"10px"}} className={style.profileBio}>
            <p className={style.followers}>{followers}</p><p className={style.text}>Followers</p>
            <p className={style.followers} style={{marginLeft:"10px"}}>{following} </p><p className={style.text}>Following</p>
            <br></br><br></br>
            <a href={"https://www.openprosper.com/u/" + info.Username} className={style.blockchain} >View on blockchain</a>
            <a href={"https://" + info.Username + ".nftz.me"} className={style.blockchain} style={{marginLeft:"2vw"}}>View NFTs</a>
          </div>
          
            <div className={style.line}></div>
          <div className={style.profileTabs}>
              <div className={style.profileTab}>
                <a onClick={()=>setMedia("fake")}>Posts</a>
                <a onClick={()=>setMedia("true")}>Media</a>
                <a >Exlusive Content (Coming Soon) </a>
              </div>
             
          </div>
          <div className={style.line}></div>
          <div className={style.Message}>
            {isLogged ? 
          <MessageInFeed feed={`#/profile/:${info.PublicKeyBase58Check}${media}`}></MessageInFeed>

        : <div style={{color:"var(--color-white)", width:"98%", textAlign:"center", backgroundColor:"var(--color-primary)",lineHeight:"20vh", borderRadius:"10px"}}>To view these messages you must be logged in</div>
           }

          </div>
         
        </div>
        
        </>

    )
}
export async function getServerSideProps(context) {
  return { props: { username: context.params} };
};