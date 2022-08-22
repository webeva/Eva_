
import SettingBar from "../../components/SettingBar"
import style from "../../styles/Settings.module.css"
import { useState, useEffect } from "react"
export default function Display() {
    const [fontSizeActive, setFontSizeActive] = useState(Array(5).fill(null))
    const [isMobile, setIsMobile] = useState(false)
    
   useEffect(()=>{
    try{
        if(localStorage){
            if(localStorage.getItem("primaryColor")){
                
                document.getElementById(localStorage.getItem("primaryColor")).classList.add("activeColor")
              }else{
               
                document.getElementById("blue").classList.add("activeColor")
              }
        }
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        if(vw < 700){
           
            setIsMobile(true)
        }
    }catch(error){
        
    }
    
    


  
    try{
      if(localStorage.getItem("theme")){
        document.getElementById(localStorage.getItem("theme")).classList ="active"
      }else{
        document.getElementById("vortex").classList ="active"
      }
    }catch(error){
        document.getElementById("vortex").classList ="active"
    }
})

    function setColor(color){
        if(color){
            
            localStorage.setItem("primaryColor", color)
            var elements = document.getElementsByClassName("activeColor")
               while(elements.length > 0){
             
                    elements[0].classList.remove("activeColor")
                }  
            
                document.getElementById(color).classList.add("activeColor")
                window.location.reload()
        }   
    }
    function setTheme(theme){
        if(theme){
            //Save the theme to local storage
            localStorage.setItem("theme", theme)
            //Clear the selectors
            var elements = document.getElementsByClassName("active")
               while(elements.length > 0){
             
                    elements[0].classList.remove("active")
                }  
                //Activate the specific color selector
          
                document.getElementById(theme).classList ="active"

                //Reload the page
                window.location.reload()
            
        }
    }
    
    function setFontSize(number){
        let fontSizeActive = Array(5).fill(null)
        fontSizeActive[number] = true
        setFontSizeActive(fontSizeActive)
    }
  return (
    <>
    <div  className="pageIdentify">
    <img alt="back" className={style.back} onClick={()=> history.back()}  src="/Svg/back.svg" width={30} height={30}/>
        <p id="pageidentify" style={{display:"inline"}}>Settings</p>      
    </div>
    {isMobile ? <div></div>: <SettingBar/>}
    <div className={style.content}>
                <div className={style.customizeTheme}>
                    <h2>Customize your view</h2>
                    <p className={style.dim}>Manage your primary color, and background</p>
                    {/* ==========Font Size ========== 
                    <div className={style.fontSize}>
                        <h3>Font Size</h3>
                        <div>
                            <h6>Eva</h6>
                            
                            <div className={style.chooseSize}>
                                {fontSizeActive?.map(function(value, index){
                                   
                                    return(
                                        
                                        
                                        <span key={"fontSize" + index} onClick={()=> setFontSize(index)} className={value ? style.active: style.nothing}></span>
    
                                    )
                                })
                            }   
                               
                            </div>
                            <h3>Eva</h3>
                        </div>
                    </div> */}
                    {/* ========== Primary Colors ========== */}
                    <div className={style.color}>
                        <h4>Primary Color</h4>
                        <div className={style.chooseColor}>
                            <span id="blue" key={"Blue"} onClick={()=> setColor("blue")} className={style.blue}></span>
                            <span id="purple"  key={"Purple"} onClick={()=> setColor("purple")} className={style.purple}></span>
                            <span id="yellow" key={"Yellow"} onClick={()=> setColor("yellow")} className={style.yellow}></span>
                            <span id="orange" key={"Orange"} onClick={()=> setColor("orange")} className={style.orange}></span>
                            <span id="green" key={"Green"} onClick={()=> setColor("green")} className={style.green}></span>
                        </div>
                    </div>
                    {/* ========== Background Theme ========== */}
                    <div className={style.background}>
                        <h4>Theme</h4>
                        <div className={style.chooseBg}>
                            
                            <div id="vortex" onClick={() =>setTheme("vortex")}>
                                <span></span>
                                <h5 >Vortex</h5>
                            </div>
                            <div id="abyss" onClick={() =>setTheme("abyss")}>
                                <span></span>
                                <h5 >Abyss</h5>
                            </div>
                            
                        </div>
                    </div>
                    

                </div> 
                </div>   
            
    </>
  )
}
