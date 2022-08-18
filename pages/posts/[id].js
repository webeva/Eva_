/* This is a dynamic url which takes in 
the post id following the post/ section in 
the url and is used to display a single post.
This page is rendered whenever somebody clicks
on a post and is loaded even if the user is not
logged in */

//Import the router from next
import {useRouter} from "next/router"

//Import the styles
import style from "../../styles/Post.module.css"
//Import the singlpost
import SinglePost from "../../components/SinglePost"
//Import auth state
import { useRecoilState } from "recoil"
import {AppState} from "../../atom/AppStateAtom"


import dynamic from 'next/dynamic'
import PostComments from "../../components/PostComments"
//Import message comment modal dynamicaly so that we only load it when we need it.
const CommentModal = dynamic(() => import('../../components/CommentModal'))
const BuyNFTModal = dynamic(()=> import("../../components/BuyNFTModal"))
const InputField = dynamic(()=> import("../../components/InputField"))
const CreateNft = dynamic(()=> import("../../components/CreateNFT"))
const EditPost = dynamic(()=> import("../../components/EditPostModal"))
//Export the post page
export default function Post() {
    const router = useRouter()
    //Get the current post id
    const {id} = router.query
    //Get the current auth state
    const [logged] = useRecoilState(AppState)

  return (
    <>
    <div  className="pageIdentify">
            <img className={style.back} onClick={()=> history.back()}  src="/Svg/back.svg" width={30} height={30}/>
            <p id="pageidentify" style={{display:"inline"}}>Post</p>
            <div style={{marginLeft:"55vw", display:"inline-block"}} className="details"></div>
    </div>
    <CommentModal></CommentModal>
    <BuyNFTModal></BuyNFTModal>
    <CreateNft></CreateNft>
    <EditPost></EditPost>
        <div className={style.wrapper}>
        <SinglePost postId={id}/>
        {logged && <InputField postId={id}/>}
        
        <PostComments postId={id}/>
        </div>
        
    </>
    
  )
}
