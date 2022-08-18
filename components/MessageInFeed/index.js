/* This component exports a function which
allows us to load messages for whatever feed we want. 
A feed paramater is used to determine what feed to 
render. Is used in the main index page. */

import { useEffect, useState } from "react";

//Import style
import style from "../../styles/MessageInFeed.module.css"
//Import Deso
import Deso from 'deso-protocol';
import DesoApi from '../../Functions/Desoapi';
//Import router from next
import {useRouter} from "next/router"
//Import Recoil and states
import {useRecoilState} from "recoil"
import {modalState, postIdState, NFTState, quoteState, CreateNftState, createNftHash, EditState, EditStateHash} from "../../atom/modalAtom"
import { loadState } from "../../atom/feedAtom";
//Import Spinner
import LoadingSpinner from "../Spinner";
//Import Get posts for profile
import GetPosts from "../../pages/api/GetPostsForProfile";
//Import Profile picture
import ProfilePic from "../ProfilePic";
//Import dynamic loading from next 
import dynamic from 'next/dynamic'
//Import Youtube embed
const YoutubeEmb = dynamic(()=> import( "../YoutubeEmb"))


const MessageInFeed = (feed) => {
     
    //Array to store all of the messages
    const [messagesFeed, setmessagesFeed] = useState([])
    /* Check if this is to get a feed or to get 
    a user's post */
    const [isProfile, setIsProfile] = useState(false)
    const [profileUsername, setProfileUsername] = useState("loading")
    //State of the send comment modal
    const [open,setOpen] = useRecoilState(modalState);
    const [postId,setPostId] = useRecoilState(postIdState)
    const [quote,setQuote] = useRecoilState(quoteState)
    const [load] = useRecoilState(loadState)
    const [nftOpen, setNftOpen] = useRecoilState(NFTState)
    const [createNftOpen, setCreateNftOpen] = useRecoilState(CreateNftState)
    const [NftHash, setNftHash] = useRecoilState(createNftHash)
    const [editOpen, setEditOpen] = useRecoilState(EditState)
    const [editHash, setEditHash] = useRecoilState(EditStateHash)
    //Save an array of all of the user's seen posts
    const seenPosts = []
    const desoapi = new DesoApi()
    const postapi = new GetPosts()
    //Router 
    const router = useRouter()
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
    //Get the feed

    useEffect(()=>{
      console.log("%c Hello there! Checking out the console?", 'font-size:15px; font-weight: bold;' )
      const getfeed = async() =>{
      
        /* Checks if we are supposed to get a feed 
        or get a user's message. When we are supposed
        to get a user's message the first characters 
        will be #/profile/:${username}. Meaning that 
        typing #/profile/:Web3_Eva in the
        search bar will show you all of Web3_Eva's posts */
        let user = localStorage.getItem("deso_user_key");
        if(user == null){
          user = ""
        }

        if(feed.feed.substring(0,11) != "#/profile/:"){
          setIsProfile(false)
          if(feed.feed == "hot"){
            //Get hot feed
            let responsevalue = await desoapi.getHotFeed(25, user, seenPosts )
            if(responsevalue){
              setmessagesFeed(Object.values(responsevalue)[0])
              Object.values(responsevalue)[0].map(function(value){
                  seenPosts.push(value.PostHashHex)
              })
                
              
            }
          }else if(feed.feed == "latest"){
            //Get latest feed
            
            let responsevalue = await desoapi.getLatestPostsForFeed(25, user)
             
            if(responsevalue){
              setmessagesFeed(Object.values(responsevalue)[0])
            }
            
          }else if(feed.feed == "following"){
            //Get posts of creators that this user follows
            let responsevalue = await desoapi.getFollowingFeed(user, null, 25)
             
            if(responsevalue){
              setmessagesFeed(Object.values(responsevalue)[0])
            }
  
          }else{
           
            let responsevalue = await desoapi.getSearchFeed(user, 25, feed.feed)
            
            if(responsevalue){
             
              setmessagesFeed(Object.values(responsevalue)[0])
            }
          }  
         }else{
          //Get user's post
          setIsProfile(true)
          //Get the user's deso key
          let user = localStorage.getItem("deso_user_key")
          //Check if the user is logged in
          if(!user){
            user = ""
          }
          //Get the public key 
          let isMedia = false
          let publickey = feed.feed.substring(11,feed.feed.length - 4)
          if(feed.feed.slice(feed.feed.length - 4) == "true"){
            isMedia = true
          }else{
            isMedia = false
          }
          let responsevalue = await postapi.getPostsForPublicKey(publickey ,user, isMedia)
            if(responsevalue){
                setProfileUsername(await desoapi.UsernameByPublickey(publickey))
                setmessagesFeed(responsevalue)
              
            }
         }
      }
      if(feed.feed){
        getfeed()
      }
    },[feed.feed, load])
    //This function likes or unlikes posts
    async function like(message){
      const deso = new Deso();
      let IsUnlike;
      if(document.getElementById(message + "likeimg").src == "http://localhost:3000/Svg/star-on.svg"|| document.getElementById(message + "likeimg").src == "https://web3eva.netlify.app/Svg/star-on.svg" ){
        IsUnlike = true
        let current = parseInt(document.getElementById(message + "likecount").innerText) 
        current -= 1
        document.getElementById(message + "likecount").innerText = current.toString()
        document.getElementById(message + "likecount").style.color = "white"
        document.getElementById(message + "likeimg").src = "/Svg/star.svg"
      }else{
        IsUnlike = false
        let current = parseInt(document.getElementById(message + "likecount").innerText) 
        current += 1
        document.getElementById(message + "likecount").innerText = current.toString()
        document.getElementById(message + "likecount").style.color = "yellow"
        document.getElementById(message + "likeimg").src = "/Svg/star-on.svg"
      }
      const request = {
        "ReaderPublicKeyBase58Check": localStorage.getItem("deso_user_key"),
        "LikedPostHashHex": message,
        "MinFeeRateNanosPerKB": 1000,
        "IsUnlike": IsUnlike
      };
      const response = await deso.social.createLikeStateless(request); 
    }

    /* Open and close the diamond modal. If the user hovers over 
    the diamond icon or the diamond modal show it or else hide it */

    function opendiamond(PostHashHex){
      document.getElementById(PostHashHex + "DiamondAmount").style.display = "block"
    }

    function closediamond(PostHashHex){
      document.getElementById(PostHashHex + "DiamondAmount").style.display = "none"
    }

    /* Similar to the open and close diamond except these function
    open and close the repost/quote modal. */
    
    function openRepost(PostHashHex){
      
      document.getElementById(PostHashHex + "Repost").style.display = "block"
      setTimeout(() => {
        document.addEventListener('click', function(e){   
          try{
            if(document.getElementById(PostHashHex + "Repost")){
              if (!document.getElementById(PostHashHex + "Repost").contains(e.target)){
                document.getElementById(PostHashHex + "Repost").style.display = "none"
              } 
            }
            
          }catch(error){
            
            return
          }
        })
      }, 100);
      
      
     
    }
    

   

    async function sendDiamonds(ReceiverPublicKeyBase58Check, SenderPublicKeyBase58Check, DiamondPostHashHex, DiamondLevel){
      if(ReceiverPublicKeyBase58Check){
        try{
          const response = await desoapi.sendDiamonds(ReceiverPublicKeyBase58Check, SenderPublicKeyBase58Check, DiamondPostHashHex, DiamondLevel )
          let currentdiamond = parseInt(document.getElementById(DiamondPostHashHex + "DiamondCount").value);
          document.getElementById(DiamondPostHashHex + "DiamondCount").value = currentdiamond += DiamondLevel
        }catch(error){
          console.log(error)
        } 
      }
    }
    //This function routes to the post url whenever
    //the post is clicked
    function routePost(e,postId){
      
      try{
        if(e.target.id == "messagepost" || e.target.id == "Remessagepost"){
       
          router.push(`/posts/${postId}`)
        }
      }catch(error){
       console.log("error")
        return
      }
      
      
    }
    function JustroutePost(postId){
      router.push(`/posts/${postId}`)
    }
    //This function reposts a post.
    async function repost(PostHash){
      const response = await desoapi.rePost(localStorage.getItem("deso_user_key"), PostHash )
      let current = document.getElementById("Repost" + PostHash).innerText;
      let currentVar = parseInt(current) + 1
      document.getElementById("Repost" + PostHash).innerText = currentVar;
      document.getElementById("Repost" + PostHash).style.color = "lightgreen"
      document.getElementById("RepostImg" + PostHash).src = "/Svg/repost-on.svg"
    }

    function renderTags(content){
      
      let innerText = content.replace(/(@+[a-zA-Z0-9A-Za-zÀ-ÖØ-öø-ʸ(_)]{1,})/g, mention => {
        return `<a   href="/profile/${mention.substring(1)}">${mention}</a>`;
      })
      innerText = innerText.replace(/(#(?:[^\x00-\x7F]|\w)+)/g, hashtags => {
        return `<a   href="/search/post/${hashtags.substring(1)}"  >${hashtags}</a>`;
      })
      innerText = innerText.replace(/([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gm, links => {
    
       if(links.includes("http")){
        return `<a  href="${links}" >${links}</a>`;
       }else{
        return `<a  href="https://${links}" >${links}</a>`;
       }
        
      })
      
      
      return <div dangerouslySetInnerHTML={{__html: innerText}}></div>  
    }

    //Hides the video if there is an error
    function HideVideo(id){
      document.getElementById(id).style.display = "none"
    }
    function routeNft(username, postHash){
      window.location.replace(`https://${username}.nftz.me/nft/${postHash}`)
    }
    function openModal(id){
      
      if(document.getElementById(id).style.display == "none" || document.getElementById(id).style.display == ""){
        document.getElementById(id).style.display = "block"
      }else{
        document.getElementById(id).style.display = "none"
      }
      
    }
    function copyToClipboard(value){
      //Used in production mode
      var productionLink = "https://web3eva.netlify.app/posts/"
      //Used in development
      var localHost = "http://localhost:3000/posts/"
      //Get the link to copy to the clipboard
      var copyText = `${productionLink}${value}`
      //Copy to clipboard
      navigator.clipboard.writeText(copyText);
    }
    function sharePost(value){
      //Used in production mode
      var productionLink = "https://web3eva.netlify.app/posts/"
      //Used in development
      var localHost = "http://localhost:3000/posts/"
      //Get the link to copy to the clipboard
      var url = `${productionLink}${value}`
      try{
        const shareData = {
          title: "Post on Eva",
          text: `Check out this awesome post from Eva!`,
          url: url
        }
        navigator.share(shareData);
      }catch(error){
        alert(error)
        return
      }
    }

    async function blockUser(id){
      const jwt = await desoapi.getJwt(localStorage.getItem("deso_user_key"))
      const response = await desoapi.blockPublicUser(localStorage.getItem("deso_user_key"), id,jwt)
      
    }
    async function deletePost(post, id){
      const response = await desoapi.hidePost(post, id)
      document.getElementById("Body" + post).innerText = "This Message has been deleted"
    }

   



    //Return the html
    return (
            <>
            {messagesFeed && (
                messagesFeed.length > 0 ?(
                  messagesFeed?.map(function(value,index){
                    /*Destruct the properties that we need to make our code
                    look better and remove the value. before every property
                    to add a new property add its name to the object list 
                    below. */
  
                    const {IsHidden, PostHashHex, PosterPublicKeyBase58Check, Body, TimestampNanos, 
                      ImageURLs, VideoURLs, CommentCount, LikeCount, RepostCount, DiamondCount
                    , PostEntryReaderState, RepostedPostEntryResponse, IsNFT, NumNFTCopies, 
                    NumNFTCopiesForSale} = value
                    let Nft = null; 
                   
                    try{
                      if(value.ProfileEntryResponse){
                        if(value.ProfileEntryResponse.ExtraData){
                          if(value.ProfileEntryResponse.ExtraData.NFTProfilePictureUrl){
                            Nft = value.ProfileEntryResponse.ExtraData.NFTProfilePictureUrl
                          }
                        }
                      }
                    }catch(error){
                      Nft = null
                    }
                    let ReNft = null; 
                    try{
                      if(value.RepostedPostEntryResponse.ProfileEntryResponse){
                      
                        if(value.RepostedPostEntryResponse.ProfileEntryResponse.ExtraData){
                          if(value.RepostedPostEntryResponse.ProfileEntryResponse.ExtraData.NFTProfilePictureUrl){
                            ReNft = value.RepostedPostEntryResponse.ProfileEntryResponse.ExtraData.NFTProfilePictureUrl
                          }
                        }
                      }
                    }catch(error){
                      ReNft = null
                    }
                    
                    let isYourPost = false;
                   
                    if(localStorage.getItem("deso_user_key") == PosterPublicKeyBase58Check){
           
                      isYourPost = true
                    }

                    let isImgandNFT = false;
                    if(ImageURLs && IsNFT ){
                      isImgandNFT = true
                    }
                    

                    
                    return(
  
                        <>
                        
                          {IsHidden ?
                            <></>
                          :
                          <>
                           
                          <article id="messagepost" onClick={(e)=> routePost(e,PostHashHex)} className={style.feedEva}  key={PostHashHex} >
                            
                            
                          {/* Show more*/}   
                          <img onClick={()=> openModal("OpenModal" + PostHashHex)}  src="/Svg/more.svg" width={15} height={15} className={style.edit} alt="moreOptions"></img>
                          <div style={{position: "relative"}}>
                            
                            <div id={"OpenModal" + PostHashHex} className={style.dropDown}>
                              <li className={isYourPost ? style.show: style.show}  onClick={() =>copyToClipboard(PostHashHex)}>Copy Link</li> {/* Always shows */}
                              <li className={isYourPost ? style.show: style.show} onClick={()=> sharePost(PostHashHex)}>Share Post</li> {/* Always shows */}
                              <li onClick={()=> {setEditOpen(!editOpen); setEditHash(PostHashHex)}} className={isYourPost ? style.show: style.hide}>Edit post</li> {/* Shows if this post is the user's post */}
                              <li onClick={()=> {setCreateNftOpen(!createNftOpen); setNftHash(PostHashHex)}} className={isYourPost ? style.show: style.hide}>Create NFT</li> {/* Shows if this post is the user's post */}
                              <li className={isYourPost ? style.hide: style.show}>Report Content</li> {/* Shows if this post is not the user's post */}
                              {/*<li onClick={()=> setAsProfile(ImageURLs)} className={isImgandNFT ? style.show: style.hide}>Set as Profile Picture</li> {/* Shows if this post is the user's post and is an nft */}
                              <li onClick={()=> blockUser(PosterPublicKeyBase58Check)} className={isYourPost ? style.hide: style.show} >Block User</li> {/* Shows if this post is not the user's post */}
                              <li onClick={()=> deletePost(PostHashHex, PosterPublicKeyBase58Check)} className={isYourPost ? style.show: style.hide}>Delete Post</li> {/* Shows if this post is the user's post */}
                            </div>
                          </div>      
                           
                          
                          {/* Profile display container */}
                          
                          <div  className={style.container}>
                         
                          <ProfilePic profile={PosterPublicKeyBase58Check} username={isProfile ? profileUsername : value.ProfileEntryResponse.Username} size={50} IsNFT={Nft}></ProfilePic>
                          </div>
  
                            <div  id={PostHashHex}  className={style.completeEva} style={{marginLeft:"1vw"}}>
                              
                              <div className={style.who} onClick={()=> routePost(PostHashHex)}>
                                
                              <p >{isProfile ? profileUsername :value.ProfileEntryResponse.Username}  </p>
                                <div className={style.accWhen}>
                                  {
                                      `
                                      ${PosterPublicKeyBase58Check.slice(0,4)} ... ${PosterPublicKeyBase58Check.slice(38)} ·
                                      ${timeSince(TimestampNanos)} 
                                     
                                      `  
                                    }
                                    
                                    
                                    
                              </div>
                              
                              </div>
                              
            
                              <div className={style.evaContent} onClick={()=> JustroutePost(PostHashHex)}>
                                
                                <div className={style.mention} id={"Body" + PostHashHex}>{renderTags(Body, PostHashHex)}</div>
                               
                                </div>
                              {ImageURLs   && <img  id={PostHashHex + "Image"} src={ImageURLs[0]} onError={(e)=>{HideVideo(PostHashHex + "Image")}} className={style.evaImg} alt = "Image" loading="lazy"></img>}
                              
                              {VideoURLs && (
                                 VideoURLs != "" && (
                                <>
                               
                                <div id={PostHashHex + "Frame"} style={{position:"relative", paddingBottom:"56.25%", paddingTop:"30px", height:"0px", }}>
                                <iframe loading="lazy" title="Video on Eva"  style={{position:"absolute", left:"0", top:"0", right:"0", bottom:"0", height:"100%", width:"95%", borderRadius:"8px", minHeight:"10vh"}} onError={()=> HideVideo(PostHashHex + "Frame")} src={VideoURLs} frameBorder="0" allowFullScreen></iframe>
                              </div>
                              
                              </>
                                 )
                              )}
                              {value.PostExtraData.EmbedVideoURL && (
                                
                                  <YoutubeEmb link={value.PostExtraData.EmbedVideoURL}></YoutubeEmb>
                                
                              )}
                              {IsNFT && (
                                <div   className={style.nft}>
                                  <p style={{display: "inline"}}>{NumNFTCopiesForSale} out of {NumNFTCopies} for sale</p>
                                  <button onClick={() => {
                                  routeNft(isProfile ? profileUsername :value.ProfileEntryResponse.Username, PostHashHex);
                                   }} className={style.nftButton} style={{ marginLeft: "20vw"}}>View</button>
                                  <button onClick={() => {
                                    setNftOpen(!nftOpen)
                                   
                                  }} className={style.nftButton}  style={{ marginLeft: "1vw"}}>Buy NFT</button>
                                </div>
                              )}
  
  
                              {RepostedPostEntryResponse &&
                               <div  className={RepostedPostEntryResponse ? "show": "hide"}>
                                     
                               <div id="Remessagepost" className={style.quote} onClick={()=> routePost(RepostedPostEntryResponse.PostHashHex)}>
                               <div  className={style.container} >
                                 
                                 <ProfilePic profile={RepostedPostEntryResponse.PosterPublicKeyBase58Check} username={RepostedPostEntryResponse.ProfileEntryResponse.Username} size={50} IsNFT={ReNft}></ProfilePic>
                                 <div style={{display:"inline-block", marginLeft:"1vw"}} className={style.who} onClick={()=> routePost(RepostedPostEntryResponse)}>
                                   {RepostedPostEntryResponse.ProfileEntryResponse.Username}
                                     <div className={style.accWhen}>{
                                           `
                                           ${RepostedPostEntryResponse.PosterPublicKeyBase58Check.slice(0,4)} ... ${RepostedPostEntryResponse.PosterPublicKeyBase58Check.slice(38)} ·
                                           ${timeSince(RepostedPostEntryResponse.TimestampNanos)} 
                                         
                                           `  
                                         }
  
                                   </div>
                                   </div>
                               </div><br></br><br></br>
                               <div  id={RepostedPostEntryResponse}  className={style.completeEva}>
  
                                   <div className={style.evaContent} >
                                     
                                     <div className={style.mention}>{renderTags(RepostedPostEntryResponse.Body, value.RepostedPostEntryResponse.PostHashHex)}</div>
                                   </div>
                                     {RepostedPostEntryResponse.ImageURLs && <img    src={RepostedPostEntryResponse.ImageURLs[0]} className={style.evaImg}alt = "Img" loading="lazy"></img>}
                                   
                                   {RepostedPostEntryResponse.VideoURLs && (
                                    RepostedPostEntryResponse.VideoURLs != "" && (
                                              <div style={{position:"relative", paddingBottom:"56.25%", paddingTop:"30px", height:"0px", }}>
                                                                    <iframe loading="lazy" title="Video on Eva" id={RepostedPostEntryResponse.PostHashHex + "Frame"} style={{position:"absolute", left:"0", top:"0", right:"0", bottom:"0", height:"100%", width:"95%", borderRadius:"8px"}} onError={()=> HideVideo(RepostedPostEntryResponse.PostHashHex + "ReVideo")} src={RepostedPostEntryResponse.VideoURLs} frameBorder="0" allowFullScreen></iframe>
                                                                    </div>
                                    )
                                    
                                   )}
                                   {RepostedPostEntryResponse.PostExtraData.EmbedVideoURL && (
                                      <YoutubeEmb link={RepostedPostEntryResponse.PostExtraData.EmbedVideoURL}></YoutubeEmb>
                                    )}
                                   {RepostedPostEntryResponse.IsNFT && (
                                      <div  className={style.nft}>
                                        <p style={{display: "inline"}}> {RepostedPostEntryResponse.NumNFTCopiesForSale} out of {RepostedPostEntryResponse.NumNFTCopies} for sale</p>
                                        <button onClick={() => {
                                        routeNft(RepostedPostEntryResponse.ProfileEntryResponse.Username, PostHashHex);
                                        }} className={style.nftButton} style={{ marginLeft: "15vw"}}>View</button>
                                        <button onClick={() => {
                                          setNftOpen(!nftOpen)
                                          
                                        }} className={style.nftButton}  style={{ marginLeft: "1vw"}}>Buy NFT</button>
                                      </div>
                                    )}
                                   </div>
                               </div>
                         </div>
                              }
                                
  
                             
                               
                              <div className={style.interactions} >
  
                              <div className={style.diamondamount} id={PostHashHex + "DiamondAmount"} onMouseOver={()=> opendiamond(PostHashHex)} onMouseLeave={()=> closediamond(PostHashHex)}>
                                  <ul>
                                    <li onClick={() =>sendDiamonds(PosterPublicKeyBase58Check , localStorage.getItem("deso_user_key") , PostHashHex, 1)} key="1 Gem">
                                      <img src="/Svg/tip.svg" width={20} height={20} alt="tip1Gem"/>
                                      1
                                    </li>
                                    <li onClick={() =>sendDiamonds(PosterPublicKeyBase58Check , localStorage.getItem("deso_user_key") , PostHashHex, 5)} key="5 Gems">
                                    <img src="/Svg/tip.svg" width={20} height={20} alt="tip5Gems"/>
                                      5
                                    </li>
                                    <li onClick={() =>sendDiamonds(PosterPublicKeyBase58Check , localStorage.getItem("deso_user_key") , PostHashHex, 10)} key="10 Gems">
                                    <img src="/Svg/tip.svg" width={20} height={20} alt="tip10Gems"/>
                                      10
                                    </li>
                                    <li onClick={() =>sendDiamonds(PosterPublicKeyBase58Check , localStorage.getItem("deso_user_key") , PostHashHex, 40)} key="40 Gems">
                                    <img src="/Svg/tip.svg" width={20} height={20} alt="tip40Gems"/>
                                      40
                                    </li>
                                    <li onClick={() =>sendDiamonds(PosterPublicKeyBase58Check , localStorage.getItem("deso_user_key") , PostHashHex, 100)} key="100 Gems">
                                    <img src="/Svg/tip.svg" width={20} height={20} alt="tip100Gems"/>
                                      100
                                      </li>
                                  </ul>
                                </div>
                                 {/* Repost or Quote */}
                                <div className={style.repost}  id={PostHashHex + "Repost"}>
                             
                                  <ul>
                                    {/* Repost */}
                                     <li key={"Repost" + PostHashHex} onClick={()=> repost(PostHashHex)}> <img style={{marginRight:"0.5vw"}} src={Object.values(PostEntryReaderState)[2] ? "/Svg/repost-on.svg" : "/Svg/repost.svg"} width={23} height={23} alt="Repost"  />Repost</li>
                                      {/* Quote */}
                                     <li key={"Quote" + PostHashHex} onClick={() => {
                                      if(localStorage.getItem("deso_user_key") != null){
    
                                      setPostId(PostHashHex);
                                      setOpen(!open);
                                      setQuote(true)
                                     
                                    }else{
                                      console.log("not logged in")
                                    }
                                    
                                    } }  ><img style={{marginRight:"0.5vw"}} src={Object.values(PostEntryReaderState)[2] ? "/Svg/quote.svg" : "/Svg/quote.svg"} width={23} height={23} alt="Quote" />Quote</li>
                                  </ul>
                                </div>
  
                                <div onClick={() => {
  
                                 if(localStorage.getItem("deso_user_key") != null){
                                 
                                    setPostId(PostHashHex);
                                    setOpen(!open);
                                    setQuote(false)
                                  
                                   
                                  }else{
                                    console.log("not logged in")
                                  }
                                  
                                } } className={style.interactionNums}>
                                  <img alt="CommentOnPost"  src="/Svg/comment.svg"  width={20} height={20}/><p style={{margin:0}}>{CommentCount}</p>
                                </div>
  
  
                                <div id={PostHashHex}  onClick={() => like(PostHashHex)}  className={style.interactionNums}>
                                 
                                  <img id={PostHashHex + "likeimg"} src={Object.values(PostEntryReaderState)[0] ? "/Svg/star-on.svg" : "/Svg/star.svg"} width={18} height={18} alt="Star" /><p  style={{color:Object.values(PostEntryReaderState)[0] ? "yellow" : "white", margin:0}}  id={PostHashHex + "likecount"}>{LikeCount}</p>
                                </div>
                                <div   onClick={() => openRepost( PostHashHex)}  className={style.interactionNums}>
                                  <img id={"RepostImg" + PostHashHex} src={Object.values(PostEntryReaderState)[2] ? "/Svg/repost-on.svg" : "/Svg/repost.svg"} width={20} height={20} alt="Repost" /><p id={"Repost" + PostHashHex} style={{color:Object.values(PostEntryReaderState)[2] ? "lightgreen" : "white", margin:0}}>{RepostCount}</p>
                                </div>
                                <div onMouseLeave={()=> closediamond(PostHashHex)} onMouseOver={()=> opendiamond(PostHashHex)} className={style.interactionNums}>
                                  <img alt="TipGem" src={Object.values(PostEntryReaderState)[1] > 0 ? "/Svg/tip-on.svg" : "/Svg/tip.svg"} width={20} height={20} /><p style={{color:Object.values(PostEntryReaderState)[1] > 0 ? "lightgreen" : "white", margin:0}} id={PostHashHex + "DiamondCount"}>{DiamondCount}</p>
                                </div>
                              </div>
                            </div>
                          </article> 
                          </>
                  }
                         
                       </>
                     )
                })
                ):(
                  <div style={{marginLeft:"25vw", marginTop:"25vh"}}>
                    <LoadingSpinner/>
                  </div>
                
                )
            )}
              
                
            </>
    )
}
//Export the messages in feed
export default MessageInFeed;