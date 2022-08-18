/* This is a dynamic url which is used
to show the relevant users for whatever 
the user queried. This page is rendered 
dependant from whether or not the user 
is logged in */


//Import components
import SearchBar from "../../../components/SearchBar"
import BuyCoinModal from "../../../components/BuyCoinModal.js"
//Import from react and next 
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
//Import the deso api
import DesoApi from "../../../Functions/Desoapi"
//Import the style
import style from "../../../styles/Search.module.css"
//Import recoil and the buy creator coin modal state
import { useRecoilState } from "recoil";
import { CreatorState } from "../../../atom/modalAtom";
//Import profile picture
import ProfilePic from "../../../components/ProfilePic"

export default function Discover() {

    const router = useRouter()
    const deso = new DesoApi()
    const [Posts, setPosts] = useState("")
    const {id} = router.query
    const [currentUser, SetCurrentUser] = useState("")
    const [following, setFollowing] = useState([])

    const followingArray = []

    //Set the state of the modal ie: open or close
    const [open, setOpen] = useRecoilState(CreatorState);
    useEffect(()=>{
       //Get the current user and set it as currentUser
        const user = localStorage.getItem("deso_user_key")
        SetCurrentUser(user)
        //Loads if the url link is available. 
        if(id){
          getUsers(id, user)
        }

        async function getUsers(id, user){
          
            //Get the users
            const result = await deso.searchUsername(id.replace(/\s/g, ''), 40, user)

            //If we got a response load this
            if(result){
              
                    setPosts(result.ProfilesFound)
                    var promises= result.ProfilesFound.map(function(value, label){
                       
                        return isFollow(value.PublicKeyBase58Check)
                        
                    })  
                    Promise.all(promises).then(function(results) {
                      
                       setFollowing(results)
                    })
                   

            }
            
           
        }
        
        
    },[id])
    function goToProfile(id){
        router.push(`/profile/${id}`)
    }
    async function isFollow(id){
    if(localStorage.getItem("deso_user_key")){
     if(localStorage.getItem("deso_user_key") != id){
     
      const Following = await deso.checkFollow(localStorage.getItem("deso_user_key"), id)
      if(Following.data.IsFollowing == false){
       
        return "Follow"
      }else{
       
        return "Unfollow"
      }
      
     }else{
      return "Edit"
     }
       
      
    }else{
      return "Log in"
    }
    }

    async function FollowEdit(id){

      if(currentUser == id){
        //This is the user's profile page
        router.push("/settings/account")
      }else{
        if(localStorage.getItem("deso_user_key")){
          const Following = await deso.checkFollow(currentUser, id)
          //The user is logged in
          //This is not the user's profile page
          let isUnfollow = false
        
          if(Following.data.IsFollowing == true){
            isUnfollow = true
            document.getElementById("followingState" + id).innerText = "Follow"
           
          }else{
          
            document.getElementById("followingState" + id).innerText = "Unfollow"
          
          }   
          
          const response = await deso.followUser(localStorage.getItem("deso_user_key") , id , isUnfollow)
        }else{
          //The user is not logged in 
          router.push("/auth") 
        }
        
        
        
      }
   }
    return ( 
      <>
      <SearchBar></SearchBar>
      <BuyCoinModal></BuyCoinModal>
      <div className={style.body}>
      
          {Posts.length > 0 ? (
            Posts.map(function(value,index){
              
              /*Destruct the properties that we need to make our code
              look better and remove the value. before every property
              to add a new property add its name to the object list 
              below. */
  
              const {IsReserved, Username, PublicKeyBase58Check} = value
              
              
                
                
                
              
              return(
  
               <>
                 {IsReserved ?
                   <></>
                 :
                 
                 <div key={index} className={style.container}>
                     <div style={{display:"inline-block"}}>
                   
                        <ProfilePic profile={PublicKeyBase58Check} username={Username} size={50} IsNFT={value.ExtraData ? value.ExtraData.NFTProfilePictureUrl:null}></ProfilePic>
                        <button onClick={()=> FollowEdit(PublicKeyBase58Check)} className={style.follow} style={{display:"inline-block", position:"absolute", top:"10px", right:"85px"}}>
                        
                          <p style={{lineHeight:"0px"}} id={"followingState" + PublicKeyBase58Check}>{following[index]}</p></button>

                        <button onClick={()=> setOpen(!open)} className={style.buy}  style={{display:"inline-block", position:"absolute", top:"10px", right:"5px"}}>Buy</button>
                        <div onClick={()=> goToProfile(Username)} style={{display:"inline-block"}}>
                            <strong  style={{display:"inline", marginLeft:"1vw"}}>{Username}  </strong>
                        </div>
                    </div>
                   
                 </div>
                
  
                 }
                
                </>
              )
             })
          ):(
            <div></div>
          )
          }
        

        
      </div>
      
              </>
    )
  }
  