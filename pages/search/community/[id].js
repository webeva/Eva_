import SearchBar from "../../../components/SearchBar"
import CommunityPost from "../../../components/CommunityPost"
import { useRouter } from "next/router"
import style from "../../../styles/Community.module.css"
import { useState, useEffect } from "react"

export default function SearchCommunity() {
  const router = useRouter()
  const {id} = router.query
  const [searchValue, setSearchValue] = useState()
  useEffect(()=>{
    if(id){
      setSearchValue(id.replace(/\s/g,''))
    }
  }, [id])
  

  return (
    <>
    <SearchBar/>
    <div className={style.mainWindow} style={{marginTop:"15vh"}}>
     <CommunityPost post={searchValue}/>
     
    </div>
    </>
  )
}
