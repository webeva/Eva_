/* This component is a modal that the users uses to reply
to people's post. When the user has sent the post they are
redirect to the post page. Is displayed whenever the user clicks
on the comment modal. The state of this modal is saved in an atom */

import {useRecoilState} from "recoil"
import {modalState, postIdState, quoteState} from "../../atom/modalAtom"
import Modal from "react-modal"
import style from "./Modal.module.css"
import Messagestyle from "../../styles/MessageInFeed.module.css"
import { useEffect, useState } from "react"
import DesoApi from "../../Functions/Desoapi"
import InputField from "../InputField"
import ProfilePic from "../ProfilePic"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
const YoutubeEmb = dynamic(()=> import("../YoutubeEmb"))
const CommentModal = () => 
{
    const [open,setOpen] = useRecoilState(modalState);
    const [postId] = useRecoilState(postIdState);
    const [post, setPost] = useState({})
    const [quote, setQuote] = useRecoilState(quoteState)
    const deso = new DesoApi()
    const router = useRouter()

    useEffect(()=>{
      
        
        if(postId){
         
          getpost(postId)
        }
    }, [postId])
    async function getpost(postId){
      const response = await deso.getSinglePost(postId)
      setPost(response.PostFound)
  }

    //This function returns the time since a specific date
    function timeSince(date) {
      //Find the second the post was sent
      const secondsOfPost = Math.round((date)/1000000000.0)
      //Find the time difference between the two in seconds
      var seconds =((new Date().getTime()/ 1000) - secondsOfPost);
      //Find the difference in terms of days
      var d = Math.floor(seconds / (3600*24));
      //Find the difference in terms of hours
      var h = Math.floor(seconds % (3600*24) / 3600);
      //Find the difference in terms of minutes
      var m = Math.floor(seconds % 3600 / 60);

      var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
     
      var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";

      var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
      
      if(d == 1){
        dDisplay = "Yesterday"
        hDisplay = ""
        mDisplay = ""
      }
      if(dDisplay){
        return dDisplay
      }else if(hDisplay){
        return hDisplay
      }else if(mDisplay){
        return mDisplay
      }else{
        return "A few seconds ago"
      }
            
    }
      function renderTags(content){
      
        let innerText = content.replace(/(@+[a-zA-Z0-9A-Za-zÀ-ÖØ-öø-ʸ(_)]{1,})/g, mention => {
          return `<a  href="/profile/${mention.substring(1)}" >${mention}</a>`;
        })
        innerText = innerText.replace(/(#(?:[^\x00-\x7F]|\w)+)/g, hashtags => {
          return `<a  href="/search/post/${hashtags.substring(1)}" >${hashtags}</a>`;
        })
        innerText = innerText.replace(/([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gm, links => {
          return `<a  href="${links}" >${links}</a>`;
        })
        
        
        return <div dangerouslySetInnerHTML={{__html: innerText}}></div>  
      }
      const customStyles = {
        overlay: {zIndex: 1000},
        
        
      };
      //Hides the video if there is an error
    function HideVideo(id){
      document.getElementById(id).style.display = "none"
    }
    function routeProfile(id){
      router.push(`/profile/${id}`)
    } 
    function routePost(id){
      router.push(`/posts/${id}`)
    } 

    return(
        <>
          {Object.keys(post).length > 0 &&
            open && (
              <Modal ariaHideApp={false} style={customStyles} isOpen={open} onRequestClose={()=> {setQuote(false), setOpen(false)} } className={style.modal}>
                     
                      <div style={{width:"100%", padding:"2vh 1vw", marginLeft:"1vw"}}>
                      <div onClick={()=>{setQuote(false), setOpen(false)}} className={style.closemodal}>
                          <img alt="Close modal" src="/Svg/x-grey.svg" width={22} height={22}/>
                      </div>
                      <div  className={Messagestyle.container} style={{marginTop:"10px"}}>
                      <img
                        style={{
                          borderRadius: "50%",
                          marginRight: "10px",
                          cursor: "pointer",
                          display: "inline-block",
                          verticalAlign:"middle"
                        }}
                        onClick={(e) => {
                          routeProfile(user)
                          e.stopPropagation()
                        }}
                        src={"https://diamondapp.com/api/v0/get-single-profile-picture/" + post.PosterPublicKeyBase58Check + "?fallback=https://diamondapp.com/assets/img/default_profile_pic.png"}
                        alt="Profile Picture"
                        width={50}
                        height={50}
                        loading="lazy"
                      ></img>
                        <div className={Messagestyle.who} style={{display:"inline-block", marginLeft:"1vw"}}>
                          {post.ProfileEntryResponse.Username}
                            <div className={Messagestyle.accWhen}>{
                                  `
                                  ${post.PosterPublicKeyBase58Check.slice(0,4)} ... ${post.PosterPublicKeyBase58Check.slice(38)} ·
                                  ${timeSince(post.TimestampNanos) }
                                 
                                  `  
                                }
                                </div>
                          </div>
                      </div><br></br><br></br>
                        <div  className={Messagestyle.completeEva}>
                          
                          <div className={Messagestyle.evaContent}>
                           
                            <div className={Messagestyle.mention}>{renderTags(post.Body)}</div>
                           
                          {post.ImageURLs  && (
                           
                                  <img
                                    src={post.ImageURLs[0]}
                                    className={Messagestyle.evaImg}
                                    alt = "Image on post"
                                    id={post.PostHashHex + "Image"}
                                    onError={(e)=>{HideVideo(post.PostHashHex + "Image")}}
                                  ></img>
                                )}
                          </div>
                          {post.VideoURLs && (
                              post.VideoURLs != "" && (
                                  <>
                            <div id={post.PostHashHex + "Frame"} style={{position:"relative", paddingBottom:"56.25%", paddingTop:"30px", height:"0px", }}>
                                <iframe title="Video on Eva"  style={{position:"absolute", left:"0", top:"0", right:"0", bottom:"0", height:"100%", width:"95%", borderRadius:"8px"}} onError={()=> HideVideo(post.PostHashHex + "Frame")} src={post.VideoURLs} frameBorder="0" allowFullScreen></iframe>
                              </div>
                            </>
                              )
                          )}
                          {post.PostExtraData.EmbedVideoURL && (
                                
                                <YoutubeEmb link={post.PostExtraData.EmbedVideoURL}></YoutubeEmb>
                              
                            )}

                          {post.IsNFT && (
                              <div  className={Messagestyle.nft}>
                                <p style={{display: "inline"}}>{post.NumNFTCopiesForSale} out of {post.NumNFTCopies} for sale</p>
                                <button onClick={(e) => {
                                routeNft(post.ProfileEntryResponse.Username, post.PostHashHex);
                                e.stopPropagation() }} className={Messagestyle.nftButton} style={{ marginLeft: "20vw"}}>View</button>
                                <button className={Messagestyle.nftButton}  style={{ marginLeft: "1vw"}}>Buy NFT</button>
                              </div>
                            )}
                          {post.RepostedPostEntryResponse &&
                            <div className={post.RepostedPostEntryResponse ? "show": "hide"}>
                                <div className={Messagestyle.quote} onClick={()=> routePost(post.RepostedPostEntryResponse.PostHashHex)}>
                                <div  className={Messagestyle.container} style={{marginTop:"10px"}}>
                                <ProfilePic profile={post.RepostedPostEntryResponse.PosterPublicKeyBase58Check} username={post.RepostedPostEntryResponse.ProfileEntryResponse.Username}></ProfilePic>
                              
                              </div>
                                <div  className={Messagestyle.completeEva}>
                                  <div className={Messagestyle.who}>
                                  {post.RepostedPostEntryResponse.ProfileEntryResponse.Username}
                                    <div className={Messagestyle.accWhen}>{
                                          `
                                          ${post.RepostedPostEntryResponse.PosterPublicKeyBase58Check.slice(0,4)} ... ${post.RepostedPostEntryResponse.PosterPublicKeyBase58Check.slice(38)} ·
                                          ${timeSince(post.RepostedPostEntryResponse.TimestampNanos) }
                                        
                                          `  
                                        }
                                        </div>
                                  </div>
                                  <div className={Messagestyle.evaContent}>
                                  
                                    <div className={Messagestyle.mention}>{renderTags(post.RepostedPostEntryResponse.Body)}</div>
                                  
                                  {post.RepostedPostEntryResponse.ImageURLs  && (
                                          
                                          <img
                                            src={post.RepostedPostEntryResponse.ImageURLs[0]}
                                            className={Messagestyle.evaImg}
                                            alt = "Reposted Image"
                                            id={post.RepostedPostEntryResponse.PostHashHex + "Image"}
                                            onError={(e)=>{HideVideo(post.PostHashHex + "Image")}}
                                          ></img>
                                        )}
                                  </div>
                                  {post.RepostedPostEntryResponse.VideoURLs && (
                                    postRepostedPostEntryResponse.VideoURLs != "" && (
                                      <>
                                <div id={post.RepostedPostEntryResponse.PostHashHex + "Frame"} style={{position:"relative", paddingBottom:"56.25%", paddingTop:"30px", height:"0px", }}>
                                    <iframe title="Video on Eva"  style={{position:"absolute", left:"0", top:"0", right:"0", bottom:"0", height:"100%", width:"95%", borderRadius:"8px"}} onError={()=> HideVideo(post.RepostedPostEntryResponse.PostHashHex + "Frame")} src={post.RepostedPostEntryResponse.VideoURLs} frameBorder="0" allowFullScreen></iframe>
                                  </div>
                                </>
                                  )
                                  )}
                                  {post.RepostedPostEntryResponse.PostExtraData.EmbedVideoURL && (
                                 <YoutubeEmb link={post.RepostedPostEntryResponse.PostExtraData.EmbedVideoURL}></YoutubeEmb>
                                )}
                                  {post.RepostedPostEntryResponse.IsNFT && (
                                      <div  className={Messagestyle.nft}>
                                        <p style={{display: "inline"}}>{post.RepostedPostEntryResponse.NumNFTCopiesForSale} out of {post.RepostedPostEntryResponse.NumNFTCopies} for sale</p>
                                        <button onClick={(e) => {
                                        routeNft(post.RepostedPostEntryResponse.ProfileEntryResponse.Username, post.RepostedPostEntryResponse.PostHashHex);
                                        e.stopPropagation() }} className={Messagestyle.nftButton} style={{ marginLeft: "15vw"}}>View</button>
                                        <button className={Messagestyle.nftButton}  style={{ marginLeft: "1vw"}}>Buy NFT</button>
                                      </div>
                                    )}
                                  </div>
                            </div>
                          </div>
                          }
                      </div>
                  </div>
                    
                      
  
                          
                   <InputField postId={postId}></InputField>
              </Modal>
          )}
          
            
        </>
    )
}
export default CommentModal;
