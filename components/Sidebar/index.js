/* This file contains the sidebar component.Which
is used to navigate through the Eva website. Displays
different content if the user is logged in or not.
Also includes a function to logout. This component is
used almost everywhere except the auth and terms page and
mobile devices. For mobile devices check out the mobile
bottom bar component. */

//Import nextjs's link 
import Link from "next/link";
//Importing the stylsheet as style
import style from "./Sidebar.module.css";
//Import useRouter from Next
import { useRouter } from "next/router";
//Import from react
import { useEffect} from "react";
//Import Deso Api
import DesoApi from "../../Functions/Desoapi";
//Import Recoil and atoms
import { useRecoilState } from "recoil";
import { NotifiImage, NotificationAmount } from "../../atom/notificationAtom";
import { AppState, HasAccount } from "../../atom/AppStateAtom";

const Sidebar = () => {
  //Intialize the deso api
  const deso = new DesoApi();
  const [notificationAmount, setNotificationAmount] = useRecoilState(NotificationAmount); /* Unread notification count */
  const [notifiImage, setNotifiImage] = useRecoilState(NotifiImage); /* Src of the corresponding svg that needs to be displayed */
  const [logged, SetLogged] = useRecoilState(AppState); /* User's auth state */
  const [hasAnAccount] = useRecoilState(HasAccount); 

  //Async function that logs the user out 
  async function logout() {
    
    //Get the user's public key 
    const request = localStorage.getItem("deso_user_key");
    //Logout the user 
    const response = await deso.logout(request);
    //If sucess tell the page that we have logged out
    if (response) {
      localStorage.setItem("deso_user_key", "");
      SetLogged(false);
      router.push("/auth")
    }
  }
  //Set up the nextjs router
  const router = useRouter();

  //Route the user to their profile page
  async function routeProfile() {
    //Get the current user's public key
    const publicKey = localStorage.getItem("deso_user_key");
    //Convert that publickey to their username
    const Username = await deso.UsernameByPublickey(publicKey);
    //Go to /profile + user's username
    router.push(`/profile/${Username}`);
  }
  //Route the user back to the home page
  function goHome() {
    router.push("/");
  }
  /* This useffect is used to get the notification amount 
  and if the user has any notifications in the first play. 
  It will later save it as an atom so that it can be used
  by the mobile bottom bar (Sidebar for mobile user's). */

  useEffect(() => {
    async function getnoti() {
      //First check if a user is currently logged in 
      if (localStorage.getItem("deso_user_key")) {
        //If so get the unread notification count
        const response = await deso.getUnreadNotifications(localStorage.getItem("deso_user_key"));
        //Runs if the user has more than 0 unread notifications
        if (response.NotificationsCount > 0) {
          //If unread notifications is greater than 9 set it to 9
          if (response.NotificationsCount > 9) {
            setNotificationAmount("(9+)");
          } else {
            setNotificationAmount("(" + response.NotificationsCount + ")");
          }
          //Tell the app that the user has notification and to use the current bell svg.
          setNotifiImage(true);
        }
      }
    }
    //Call the get notification function 
    getnoti();
  }, []);

  /* This function routes to the notification page and
  then tells Deso that this user has seen all his unread
  notifications (Doesn't seem to work well)*/

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

  //Returns the sidebar JSX
  return (
    <>
      <div className={style.siderContent}>
        <div className={style.menu}>
          <div className={style.details}>
            {/* Eva Logo */}
            <img 
              rel="preload"
              onClick={() => goHome()}
              src={"/images/favicon.png"}
              alt="Eva The Top decentralized social media platform" 
              width={50}
              height={50}/>
          </div>
          {/* Link to the home page */}
          <Link href="/" className={style.link} style={{ marginTop: 30 }}>
            <div className={logged ? style.menuItems : style.hide}>
              <img
                className={style.menuImgs}
                alt="home"
                src="/Svg/home.svg"
              />
              Home
            </div>
          </Link>
          {/* Link to the discover page */}
          <Link href="/discover" className={style.link}>
            <div className={style.menuItems}>
              <img
                 className={style.menuImgs}
                alt="discover"
                src="/Svg/discover.svg"
              />
              Discover
            </div>
          </Link>
          {/* Link to the weekly debate post */}
          <Link href="/posts/687fa29feb599f140ac25a2f794d5b38ababb969adee726362ba55db9b7e92ee" className={style.link}>
            <div className={style.menuItems}>
              <img
                 className={style.menuImgs}
                alt="debate"
                src="/Svg/megaphone.svg"
              />
              Debate
            </div>
          </Link>
          {/* Link to the community page */}
          <Link href="/community" className={style.link}>
            <div className={logged ? style.menuItems : style.hide}>
              <img
                 className={style.menuImgs}
                alt="Community"
                src="/Svg/Language.svg"
              />
              Community
            </div>
          </Link>
          {/* Link to the notification page */}
          <div onClick={() => prepareNotifi()} className={style.link}>
            <div className={logged ? style.menuItems : style.hide}>
              <img
                 className={style.menuImgs}
                alt="notifications"
                src={notifiImage ? "/Svg/bell-on.svg" : "/Svg/bell.svg"}
              />
              <div className={style.sidetext}>
                Notifi{" "}
                <p id="notificationamount" style={{ display: "inline" }}>
                  {notificationAmount}{" "}
                </p>
              </div>
            </div>
          </div>
          {/* Link to the profile page page */}
          {hasAnAccount ? (
            <div onClick={() => routeProfile()} className={style.link}>
              <div className={logged ? style.menuItems : style.hide}>
                <img
                   className={style.menuImgs}
                  alt="profile"
                  src="/Svg/user.svg"
                />
                Profile
              </div>
            </div>
          ) : (
            <div></div>
          )}
           {/* Link to the settings account page*/}
          <Link
            
            href="/settings/account"
            className={style.link}
          >
            <div className={logged ? style.menuItems : style.hide}>
              <img
                 className={style.menuImgs}
                alt="settings"
                src="/Svg/setting.svg"
              />
              Settings
            </div>
          </Link>
          {/* Logout link */}
          <div
            onClick={() => logout()}
            className={logged ? style.menuItems : style.hide}
          >
            <img
               className={style.menuImgs}
              alt="logout"
              src="/Svg/logout.svg"
            />
            Logout
          </div>
        </div>
      </div>
    </>
  );
};
//Export the sidebar
export default Sidebar;
//End of sidebar component