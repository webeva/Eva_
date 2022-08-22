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
//Import Deso
import Deso from "deso-protocol";


export default function MobileBottomBar() {
  const [logged, setLogged] = useRecoilState(AppState);
  const [notifiImage] = useRecoilState(NotifiImage);
  const deso = new DesoApi();
  const router = useRouter();
  const [hasAnAccount] = useRecoilState(HasAccount);
  //Logs the user in and sets logged to true
  async function login() {
    const response = await deso.login();
    setLogged(true);
    router.push("/auth");
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
  async function logout() {
    const deso = new Deso();
    //Get the user's public key 
    const request = localStorage.getItem("deso_user_key");
    //Logout the user 
    const response = await deso.identity.logout(request);
    //If sucess tell the page that we have logged out
    if (response) {
      localStorage.setItem("deso_user_key", "");
      setLogged(false);
      router.push("/")
    }
  }

  return (
    <>
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
        <Link href="/posts/25a688ce6c52c5b08217154c2343abc10f839f99bf2ab91e4bb82216071ee0fb">
          <img
            className={logged ? style.item : style.hide}
            style={{ marginLeft: "5vw" }}
            alt="Debate"
            src="/Svg/megaphone.svg"
          />
        </Link>
        <Link href="/notifications">
          <img
            className={logged ? style.item : style.hide}
            style={{ marginLeft: "5vw" }}
            alt="Notifications"
            src={notifiImage ? "/Svg/bell-on.svg" : "/Svg/bell.svg"}
          />
        </Link>
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
            <div></div>
          )}
        <Link href="/settings">
          <img
            className={logged ? style.item : style.hide}
            style={{ marginLeft: "5vw" }}
            alt="Settings"
            src="/Svg/setting.svg"
          />
        </Link>
        <img 
          onClick={()=> logout()}
          className={logged ? style.item : style.hide}
          style={{ marginLeft: "5vw" }}
          alt="Logout"
          src="/Svg/logout.svg"
        />
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
    </>
  );
}
//End of the mobile bottom bar
