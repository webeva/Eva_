/* This file contains the rightbar component which
is displayed in medium to large sized devices. 
The righbar displays the user's profile picture
and deso user key without them having to navigate
to the profile page. Displays different content 
if the user is not logged in */


//Import useState and useEffect from react
import { useEffect, useState } from "react";
//Import the styles
import styles from "./Rightbar.module.css";
//Import the Deso Api
import DesoApi from "../../Functions/Desoapi";
//Import nextjs's router
import { useRouter } from "next/router";
//Import Recoil State for auth status
import { useRecoilState } from "recoil";
import { AppState, HasAccount } from "../../atom/AppStateAtom";
//Import Spinner
import LoadingSpinner from "../Spinner";
//Import Profile picture
import ProfilePic from "../ProfilePic";
//Import Nextjs Links
import Link from "next/link"

const Rightbar = () => {

  const [profile, setprofile] = useState("/images/profile.png") /* The current users's profile picture */
  const [username, setUsername] = useState("") /* The current user's username */
  const [wallet, setWallet] = useState("") /* The current user's deso user key */
  const [desoAmount, setDeso] = useState("") /* The current user's deso amount */
  const [desoValue, setDesoValue] = useState() /* The current price of Deso */
  const [logged, IsLogged] = useRecoilState(AppState) /* The auth status of the user */
  const [HasAnAccount, setHasAccount] = useRecoilState(HasAccount) /* If the user has made his profile */
  //Set up nextjs's router
  const router = useRouter() 
  //Set up the deso api 
  const deso = new DesoApi()

  //A function that logs the user in 
  async function login(){
    const response = await deso.login()
    checkIfAuth()
    
  } 
  //On first render check if the user is authenticated
  useEffect(()=>{
    checkIfAuth()
  }, [])
  //Every time the login value changes, check the auth state of the user

  useEffect(()=>{
    checkIfAuth()
  }, [logged])
 
  //Function that checks if the user is logged in
  function checkIfAuth(){
    let user = localStorage.getItem("deso_user_key")
    if(user){
      //User is logged in
      document.getElementById("notauth").style.display = "none"
      document.getElementById("auth").style.display = "block"
      getAuthInfo(user)
      IsLogged(true)

    }else{  
      //User is not logged in
      document.getElementById("notauth").style.display = "block"
      document.getElementById("auth").style.display = "none"
      IsLogged(false)
    }
  }

  //Get's the user's information if they are logged in
  async function getAuthInfo(user){
    //Get the user's profile picture
    setprofile(await deso.getSingleProfilePicture(user))
    //Set the user's deso user adress
    setWallet(user.slice("38"))

    try{
      const value = Object.values(await deso.getSingleProfile(user))[0]
      setDeso((value.DESOBalanceNanos/1000000000))
      const desoPrice = await deso.getDeso(user)
      setDesoValue(desoPrice)
      localStorage.setItem("desoPrice", desoPrice )
      setUsername(value.Username)

    }catch(error){
      setHasAccount(false)
    }
  }
  //Function that routes user to a user's page
  function goToUser(id){
    router.push(`/profile/${id}`)
  }

  //Used to set the user's image to the default image if an error occurs
  function setProfile(src){
    document.getElementById("profileimgo").src = src
  }
  //Function that opens the get starter deso iframe in a new window.
  function getStartDeso(){
    const user = localStorage.getItem("deso_user_key");
    window.open(
      "https://identity.deso.org/verify-phone-number?public_key=" + user
    );
  }
  //Return the rightbar jsx
  return (
    <>
    <div className={styles.rightbarContent}>
    <div className={styles.details}>
        <div id="notauth" style={{display:"none"}} className={styles.noAuth}>
          <h1 style={{ fontSize:"20px"}}>Welcome aboard Eva!</h1>
          <p>Decentralised social media is here!</p>
          <button className={styles.login} onClick={login}>Login / Sign Up</button> <br></br>
          <small style={{paddingTop:"15px",marginLeft:"15px", fontSize:"12px"}}>By signing up, you agree to our <a href="#" className={styles.agree}>Terms</a>.</small>
        </div>
        <div id="auth" style={{display:"none"}}>
          <img rel="preload" alt="ProfilePictureOfUser" id="profileimgo" onError={() =>setProfile("/images/profile.png")} src={profile ? profile : "/images/profile.png"} className={styles.profilePic}></img>
            <div className={styles.profile}>
              <div className={styles.who}>
                {username ? username : "New User"}
              </div>
              <div className={styles.accWhen}>
                {wallet}
              </div>
            </div>
          </div>
        </div>
        {HasAnAccount ? (
         
          desoAmount ? (
            
            <div className={logged? styles.trends: styles.hide}>
            
            <h3 className={styles.balance}>Balance: {Number(desoAmount).toFixed(3)} ≈ ${Number(desoAmount * desoValue).toFixed(3)}</h3>
            <h3 className={styles.balance}>$Deso Value: ${desoValue}</h3>
          </div>
          ):(
              <LoadingSpinner/>
          )
        ):(
          <>
          
          <div  style={{marginTop:"4vh"}} className={styles.buy} onClick={()=> getStartDeso()}>Get Free Starter Deso</div>
          </>
        )}
      {HasAnAccount ? <a className={styles.buy} href="https://www.coinbase.com/price/decentralized-social">{logged? "Withdraw": "Buy"} $Deso</a>: <div></div> }
      <div className={styles.trends}>
        <h1 className={styles.categorytitle} >Who To Follow</h1>
        <div className={styles.category} onClick={()=> goToUser("dharmesh")} style={{marginTop:30}}><ProfilePic profile={"BC1YLianxEsskKYNyL959k6b6UPYtRXfZs4MF3GkbWofdoFQzZCkJRB"} username={"dharmesh"} size={40}></ProfilePic> <p  className={styles.text}>dharmesh</p></div>
        <div className={styles.category} onClick={()=> goToUser("Krassenstein")}><ProfilePic profile={"BC1YLj3a3xppVPtAoMAzh1FFYtCTiGomjaA5PRcqS1PVRk8KqDw385y"} username={"Krassenstein"} size={40}></ProfilePic> <p  className={styles.text}>Krassenstein</p></div>
        <div className={styles.category} onClick={()=> goToUser("EvaSocial")}><ProfilePic profile={"BC1YLhNySXmFdZDyuwT9V115PbbSB2dfx2Y4mKowBwGDYx7KDDE2Ycb"} username={"EvaSocial"} size={40}></ProfilePic> <p  className={styles.text}>EvaSocial</p></div>
      </div>
      <Link href="/terms" className={styles.terms}>Terms and Conditions</Link> <a href="#" className={styles.terms}>Privacy Policy</a>
    </div>
    </>
  );
};
//Export the rightbar
export default Rightbar;
//End of the rightbar component