/* The sidebar for mobile users. Is loaded when
the user is using a phone or when the viewpoint
is small enough. Is displayed on the bottom of 
the phone and displays different content depending
on if the user is logged into the website */

import style from "../../styles/Phone.module.css";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { AppState, HasAccount} from "../../atom/AppStateAtom";
import { NotifiImage } from "../../atom/notificationAtom";
import DesoApi from "../../Functions/Desoapi";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";


export default function MobileBottomBar() {
  const [logged, setLogged] = useRecoilState(AppState);
  const [notifiImage] = useRecoilState(NotifiImage);
  const [isAuth, setIsAuth] = useState(false)
  const deso = new DesoApi();
  const router = useRouter();
  const [hasAnAccount] = useRecoilState(HasAccount);
  //Logs the user in and sets logged to true
  async function login() {
    const response = await deso.login();
    setLogged(true);
    router.push("/");
  }
  //Route the user to their profile page
  async function routeProfile() {
    //Get the current user's public key
    const publicKey = localStorage.getItem("deso_user_key");
    //Convert that publickey to their username
    const Username = await deso.UsernameByPublickey(publicKey);
    //Go to /profile + user's username
    router.push(`/profile/${Username}`);
  }
  

  useEffect(() =>{
    if(router.pathname){
      if (router.pathname == "/auth" || router.pathname == "/terms") {
        setIsAuth(true)
      }else{
        setIsAuth(false)
      }
    }
  }, [router])

  async function prepareNotifi() {
    //Use nextjs's router to route
    router.push("/notifications");
    /* Tries to get the json web token. Sometimes fells as Next 
    uses server side rendering. In that case log the error */
    try {
      //Get the json web token
      const jwt = await deso.getJwt(localStorage.getItem("deso_user_key"));
      //Send the response
      const value = await deso.getUnreadNotifications(localStorage.getItem("deso_user_key"))
      const index = value.LastUnreadNotificationIndex
      const response = await deso.sawNotifications(localStorage.getItem("deso_user_key"), jwt, index);
     
    } catch (error) {
      //Logs the errors.

      console.log(error);
    }
  }

  return (
    <>
    {isAuth == false && 
      <div className={style.bar}>
      <Link href="/">
        <img
          className={logged ? style.item : style.hide}
          style={{ marginLeft: "15vw" }}
          alt="Home"
          src="/Svg/home.svg"
        />
      </Link>
      <Link href="/discover">
        <img
          className={logged ? style.item : style.hide}
          style={{ marginLeft: "5vw" }}
          alt="Discover"
          src="/Svg/discover.svg"
        />
      </Link>
      <Link href="/posts/687fa29feb599f140ac25a2f794d5b38ababb969adee726362ba55db9b7e92ee">
        <img
          className={logged ? style.item : style.hide}
          style={{ marginLeft: "5vw" }}
          alt="Debate"
          src="/Svg/megaphone.svg"
        />
      </Link>
      <Link href="/community">
        <img
          className={logged ? style.item : style.hide}
          style={{ marginLeft: "5vw" }}
          alt="Community"
          src="/Svg/Language.svg"
        />
      </Link>
      <div style={{display:"inline-block"}} onClick={() => prepareNotifi()}>
        <img
          className={logged ? style.item : style.hide}
          style={{ marginLeft: "5vw" }}
          alt="Notifications"
          src={notifiImage ? "/Svg/bell-on.svg" : "/Svg/bell.svg"}
        />
      </div>
      
      {hasAnAccount ? (
          <div onClick={() => routeProfile()}  className={logged ? style.item : style.hide}>
            
              <img
                style={{
                  width: "30px",
                  height: "30px",
                  display: "inline-block",
                  marginLeft:"3vw"
                  
                  
                }}
                alt="profile"
                src="/Svg/user.svg"
              />
              
          </div>
        ) : (
          <></>
        )}
    
      
      <button
        onClick={() => login()}
        className={logged ? style.hide : style.btn}
        style={{ marginLeft: "9vw" }}
      >
        Sign Up
      </button>
      <button
        onClick={() => login()}
        className={logged ? style.hide : style.btn}
      >
        Log in
      </button>
    </div>
}     
    </>
  );
}
//End of the mobile bottom bar
