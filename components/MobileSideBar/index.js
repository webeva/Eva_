import style from "./MobileSideBar.module.css"
import Link from "next/link"
import { useRecoilState } from "recoil"
import { SideBarMobile } from "../../atom/modalAtom"
import DesoApi from "../../Functions/Desoapi"
import { NotifiImage, NotificationAmount } from "../../atom/notificationAtom"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { HasAccount } from "../../atom/AppStateAtom"


export default function MobileSideBar() {
    const [open, setOpen] = useRecoilState(SideBarMobile)
    const [notifiImage] = useRecoilState(NotifiImage);
    const [NotificationAmounts] = useRecoilState(NotificationAmount)
    const [account] = useRecoilState(HasAccount)
    const [user, setUser] = useState()
    const deso = new DesoApi()
    const router = useRouter()
  
    //Async function that logs the user out 
  async function logout() {
    
    //Get the user's public key 
    const request = localStorage.getItem("deso_user_key");
    //Logout the user 
    const response = await deso.logout(request);
    //If sucess tell the page that we have logged out
    if (response) {
      localStorage.setItem("deso_user_key", "");
      router.push("/auth")
    }
  }
  useEffect(()=>{
    const id = localStorage.getItem("deso_user_key")
    getUserKey(id)
  }, [])
  async function getUserKey(id){
    const value = await deso.UsernameByPublickey(id)
    setUser(value)
  }
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
    <div className={open? style.background: style.hide}>
    <div className={style.sideMenu}>
        <div className={style.btnClose} onClick={()=> setOpen(false)}>&times;</div>
        <img src="/images/favicon.png" alt="Eva" width={56} height={56} style={{marginLeft:"35%", marginBottom:"2vh"}}></img>
        <Link href="/" >
        
            <div className={style.link}>
            <img
                className={style.menuImgs}
                alt="home"
                src="/Svg/home.svg"
              />
              Home</div>
        </Link>
        <Link  href="/discover">
            <div className={style.link}>
            <img
                 className={style.menuImgs}
                alt="discover"
                src="/Svg/discover.svg"
              />
              Discover</div></Link>
        <Link  href="/posts/5e95586572be344a95a5c0b5d00394fb723db4210c4b229eebc8e71efcc07938">
            <div className={style.link}>
            <img
                 className={style.menuImgs}
                alt="debate"
                src="/Svg/megaphone.svg"
              />
              Debate</div></Link>
        <Link  href="/community">
            <div className={style.link}>
            <img
                 className={style.menuImgs}
                alt="debate"
                src="/Svg/Language.svg"
              />
              Community</div></Link>
        <div onClick={() => prepareNotifi()}>
            <div className={style.link}>
            <img
             className={style.menuImgs}
                alt="notifications"
                src={notifiImage ? "/Svg/bell-on.svg" : "/Svg/bell.svg"}
              />
              Notification
              {NotificationAmounts}</div></div>
        
        {account ? (
        <Link  href={`/profile/${user}`}>
            <div className={style.link}>
            <img
                   className={style.menuImgs}
                  alt="profile"
                  src="/Svg/user.svg"
                />
                Your Profile</div></Link>
        ):(
          <div></div>
        )}
        <Link  href="/settings">
            <div className={style.link}>
            <img
                 className={style.menuImgs}
                alt="settings"
                src="/Svg/setting.svg"
              />
              Settings</div></Link>
        <div onClick={()=> logout()} className={style.link}>
        <img 
               className={style.menuImgs}
              alt="logout"
              src="/Svg/logout.svg"
            />
            Logout</div>
    </div>
    </div>
  )
}
