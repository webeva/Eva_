import style from "./MobileSideBar.module.css"
import Link from "next/link"
import { useRecoilState } from "recoil"
import { SideBarMobile } from "../../atom/modalAtom"
import DesoApi from "../../Functions/Desoapi"
import { NotifiImage, NotificationAmount } from "../../atom/notificationAtom"
import { useEffect, useState } from "react"


export default function MobileSideBar() {
    const [open, setOpen] = useRecoilState(SideBarMobile)
    const [notifiImage] = useRecoilState(NotifiImage);
    const [NotificationAmounts] = useRecoilState(NotificationAmount)
    const [user, setUser] = useState()
    const deso = new DesoApi()
  
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
        <Link  href="/posts/687fa29feb599f140ac25a2f794d5b38ababb969adee726362ba55db9b7e92ee">
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
                src="/Svg/language.svg"
              />
              Community</div></Link>
        <Link  href="/notifications">
            <div className={style.link}>
            <img
             className={style.menuImgs}
                alt="notifications"
                src={notifiImage ? "/Svg/bell-on.svg" : "/Svg/bell.svg"}
              />
              Notification
              {NotificationAmounts}</div></Link>
        <Link  href={`/profile/${user}`}>
            <div className={style.link}>
            <img
                   className={style.menuImgs}
                  alt="profile"
                  src="/Svg/user.svg"
                />
                Your Profile</div></Link>
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
