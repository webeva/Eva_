import SettingBar from "../../components/SettingBar"
import style from "../../styles/Settings.module.css"
import { useEffect, useState } from "react"

export default function Extensions() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(()=> {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    if(vw < 505){
           
      setIsMobile(true)
  }
  },[])
  return (
    <>
    <div  className="pageIdentify">
    <img className={style.back} onClick={()=> history.back()}  src="/Svg/back.svg" width={30} height={30}/>
            <p id="pageidentify" style={{display:"inline"}}>Settings</p>
            
        </div>
        {isMobile ? <div></div>: <SettingBar/>}
    </>
  )
}
