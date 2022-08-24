/* This is a dynamic url which is used
to show the relevant posts for whatever 
the user queried. This page is rendered 
dependant from whether or not the user 
is logged in */

import SearchBar from "../../../components/SearchBar"
import MessageInFeed from "../../../components/MessageInFeed"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { AppState } from "../../../atom/AppStateAtom"
import dynamic from 'next/dynamic'
import style from "../../../styles/Search.module.css"
//Import message comment modal dynamicaly so that we only load it when we need it.
const CommentModal = dynamic(() => import('../../../components/CommentModal'))
const BuyNFTModal = dynamic(()=> import("../../../components/BuyNFTModal"))
const CreateNFT = dynamic(()=> import("../../../components/CreateNFT"))
const EditPost = dynamic(()=> import("../../../components/EditPostModal"))
export default function Discover() {
   const router = useRouter()
   const {id} = router.query
   const [feed, setFeed] = useState("")
   const [logged] = useRecoilState(AppState)
   useEffect(()=>{
    if(id){
      setFeed(id.replace(/\s/g, '').toLowerCase())
    }

   }, [id])
    return ( 
      <>
      <SearchBar></SearchBar>
      <CommentModal></CommentModal>
      <CreateNFT></CreateNFT>
      <EditPost></EditPost>
      <BuyNFTModal></BuyNFTModal>
      <div className={style.searchWindow}>
      {logged ? <MessageInFeed feed={feed}/> : <div style={{color:"var(--color-white)", width:"100%", textAlign:"center"}}>Login To View these posts</div>}
      </div>
      
      </>
    )
  }
  