/* The sidebar for mobile users. Is loaded when
the user is using a phone or when the viewpoint
is small enough. Is displayed on the bottom of 
the phone and displays different content depending
on if the user is logged into the website */

import style from "../../styles/Phone.module.css";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { AppState} from "../../atom/AppStateAtom";
import { NotifiImage } from "../../atom/notificationAtom";
import DesoApi from "../../Functions/Desoapi";
import { useRouter } from "next/router";

export default function MobileBottomBar() {
  const [logged, setLogged] = useRecoilState(AppState);
  const [notifiImage] = useRecoilState(NotifiImage);
  const deso = new DesoApi();
  const router = useRouter();
  //Logs the user in and sets logged to true
  async function login() {
    const response = await deso.login();
    setLogged(true);
    router.push("/auth");
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
        <Link href="/">
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
        <Link href="/settings">
          <img
            className={logged ? style.item : style.hide}
            style={{ marginLeft: "5vw" }}
            alt="Settings"
            src="/Svg/setting.svg"
          />
        </Link>
        <img
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
