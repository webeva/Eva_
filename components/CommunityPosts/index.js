//Import useEffect and useState from react 
import { useEffect, useState } from "react";
//Import the Deso Api
import DesoApi from "../../Functions/Desoapi";
//Import the style
import style from "./style.module.css";
//Import the profile picture component 
import ProfilePic from "../ProfilePic";
//Import router from next
import { useRouter } from "next/router";
//Import useRecoil state and the relevant atoms
import { useRecoilState } from "recoil";
import {EditState} from "../../atom/modalAtom";

//Export the post comments (Takes the post Id as a param)
export default function CommunityPosts(id) {
  //Set up the deso api
  const desoapi = new DesoApi();
  const [value, setValue] = useState({}); /* Will store comments */
  const [editOpen, setEditOpen] = useRecoilState(EditState)

  //Call getComments once we have the post Id
  useEffect(() => {
    getComments(id);
  }, [id]);

  //Function that gets the comments (Takes the post Id as a param)
  async function getComments(id) {
    //Get the single post
    const user = localStorage.getItem("deso_user_key")
    const post = id.postId
    const response = await desoapi.getSinglePost(post, user);
    
    
    try {
      //Set the value as that post's comments
      if (response.PostFound.Comments) {
        setValue(response.PostFound.Comments);
      }
    } catch (error) {
      //If an error occurs return
      return;
    }
  }
  //Set up nextjs's router
  const router = useRouter();
  //This function returns the time since a specific date
  function timeSince(date) {
    //Find the second the post was sent
    const secondsOfPost = Math.round(date / 1000000000.0);
    //Find the time difference between the two in seconds
    var seconds = new Date().getTime() / 1000 - secondsOfPost;
    //Find the difference in terms of days
    var d = Math.floor(seconds / (3600 * 24));
    //Find the difference in terms of hours
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    //Find the difference in terms of minutes
    var m = Math.floor((seconds % 3600) / 60);
    //Difference in number of days
    var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
     //Difference in number of hours
    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
     //Difference in number of minutes
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";

    //If the comment was sent 1 day ago set the displayed text as yesterday
    if (d == 1) {
      dDisplay = "Yesterday";
      hDisplay = "";
      mDisplay = "";
    }
    
    if (dDisplay) {
      //Return the number of days
      return dDisplay;
    } else if (hDisplay) {
      //Return the number of hours 
      return hDisplay;
    } else if (mDisplay) {
      //Return the number of minutes
      return mDisplay;
    } else {
      //If the post was sent less than a minute ago return this
      return "A few seconds ago";
    }
  }
  
  //This function routes to the post url whenever the post is clicked  (Takes the post id as a param )
  function routePost(postId) {
    router.push(`/posts/${postId}`);
  }

  //Hides the video if there is an error (Takes video id as a param)
  function HideVideo(id) {
    document.getElementById(id).style.display = "none";
  }
  //Routes the user to an nft on Nftz.me (Takes username and post id as a param)
  function routeNft(username, postHash) {
    window.location.replace(`https://${username}.nftz.me/nft/${postHash}`);
  }
  //Opens/Closes the more options modal (Takes the modal id as a param)
  function openModal(id) {
    if (document.getElementById(id).style.display == "none" ||document.getElementById(id).style.display == "") {
      //Open the modal 
      document.getElementById(id).style.display = "block";
    } else {
      //Hide the modal 
      document.getElementById(id).style.display = "none";
    }
  }

  //Function that is used to copy the link of a post to the clipboard (Takes post id as a param)
  function copyToClipboard(value) {
    //Used in production mode
    var productionLink = "https://eva-phi.vercel.app/posts/";
    //Used in development
    var localHost = "http://localhost:3000/posts/";
    //Get the link to copy to the clipboard
    var copyText = `${productionLink}${value}`;
    //Copy to clipboard
    navigator.clipboard.writeText(copyText);
  }
  
  //Share a post via the native system (Takes the post id as a param )

  function sharePost(value) {
    //Used in production mode
    var productionLink = "https://eva-phi.vercel.app/posts/";
    //Used in development
    var localHost = "http://localhost:3000/posts/";
    //Get the link to copy to the clipboard
    var url = `${productionLink}${value}`;
    try {
      const shareData = {
        title: "Post on Eva", /* Title */
        text: `Check out this awesome post from Eva!`, /* Text */
        url: url, /* Url */
      };
      navigator.share(shareData);
    } catch (error) {
      //If we catch an error alert it and return 
      alert(error);
      return;
    }
  }

  //Block a certain user (Takes the user-to-be-blocked deso key)
  async function blockUser(id) {
    //Get the Json web token 
    const jwt = await desoapi.getJwt(localStorage.getItem("deso_user_key")); 
    const response = await desoapi.blockPublicUser(
      localStorage.getItem("deso_user_key"), /* Tcurrent logged in user */
      id, /* The User to be blocked key*/
      jwt /* The user's json web token  */
    );
  }

  //Deelete a post (Takes the post id and current user as a param)
  async function deletePost(post, id) {
    //Delete the post 
    const response = await desoapi.hidePost(post, id);
    //Show that the message has been deleted
    document.getElementById("Body" + post).innerText = "This Message has been deleted";
  }

  //Renders the tags, hashtags and links and makes them clickable. 

  function renderTags(content) {
    //Replace @ with a link to that user's profile page
    let innerText = content.replace(
      /(@+[a-zA-Z0-9A-Za-zÀ-ÖØ-öø-ʸ(_)]{1,})/g, /* Some complicated regex*/
      (mention) => {
        return `<a   href="/profile/${mention.substring(1)}">${mention}</a>`;
      }
    );
    //Replace # with a link to the search post with the hastag
    innerText = innerText.replace(/(#(?:[^\x00-\x7F]|\w)+)/g,  /* Some complicated regex*/
    (hashtags) => { 
      return `<a   href="/search/post/${hashtags.substring(
        1
      )}"  >${hashtags}</a>`;
    });
    //Replace links with a clickable link 
    innerText = innerText.replace(
      /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gm, /* Some complicated regex*/
      (links) => {
        if(links.includes("http")){
          return `<a  href="${links}" >${links}</a>`;
         }else{
          return `<a  href="https://${links}" >${links}</a>`;
         }
      }
    );
      //Return the new content (Must use dangerouslySetInnerHtml)
    return <div dangerouslySetInnerHTML={{ __html: innerText }}></div>;
  }
 
  //Return the Jsx of the post comments
  return (
    <div style={{ marginTop: "2vh", width:"73%" }}>
      {Object.keys(value).length > 0 &&
        value.map(function (value) {
          /*Destruct the properties that we need to make our code
                  look better and remove the value. before every property
                  to add a new property add its name to the object list 
                  below. */
          const {
            IsHidden, /* Bool Has the post been hidden/deleted */
            PostHashHex, /* Post id */
            PosterPublicKeyBase58Check, /* Poster id */
            Body, /* Text body */
            TimestampNanos, /* When the post was sent in nanos */
            ImageURLs, /* The Image urls */
            VideoURLs, /* The video urls */
            RepostedPostEntryResponse, /* */
            IsNFT, /* Is this post an nft  */
            NumNFTCopies, /*  Number of copies of nfts */
            NumNFTCopiesForSale, /*  Number of copies of nfts for sale*/
          } = value;

          let Nft = null;
          let PostedonEva;
          try{
            if(value.ProfileEntryResponse.ExtraData.App = "Eva"){
              PostedonEva = true
            }else{
              PostedonEva = false
            }
          }catch{
            PostedonEva = false
          }

          try {
            if (value.ProfileEntryResponse) {
              if (value.ProfileEntryResponse.ExtraData) {
                if (value.ProfileEntryResponse.ExtraData.NFTProfilePictureUrl) {
                  Nft =
                    value.ProfileEntryResponse.ExtraData.NFTProfilePictureUrl;
                }
              }
            }
          } catch (error) {
            Nft = null;
          }
          let ReNft = null;
          try {
            if (value.RepostedPostEntryResponse.ProfileEntryResponse) {
              if (
                value.RepostedPostEntryResponse.ProfileEntryResponse.ExtraData
              ) {
                if (
                  value.RepostedPostEntryResponse.ProfileEntryResponse.ExtraData
                    .NFTProfilePictureUrl
                ) {
                  ReNft =
                    value.RepostedPostEntryResponse.ProfileEntryResponse
                      .ExtraData.NFTProfilePictureUrl;
                }
              }
            }
          } catch (error) {
            ReNft = null;
          }

          let isYourPost = false;

          if (
            localStorage.getItem("deso_user_key") == PosterPublicKeyBase58Check
          ) {
            isYourPost = true;
          }

          let isImgandNFT = false;
          if (ImageURLs && IsNFT) {
            isImgandNFT = true;
          }
          return (
            <>
              {IsHidden ? (
                <></>
              ) : (
               
                <article
                  className={style.feedEva}
                  style={{ padding: "0px", paddingTop: "1vw", width:"97.2%" }}
                  key={PostHashHex}
                >
                  <img
                    onClick={() => openModal("OpenModal" + PostHashHex)}
                    src="/Svg/more.svg"
                    width={15}
                    height={15}
                    className={style.edit}
                    
                    alt="moreOptions"
                  ></img>
                  <div style={{ position: "relative" }}>
                    <div
                      id={"OpenModal" + PostHashHex}
                      className={style.dropDown}
                    >
                      <li
                        className={isYourPost ? style.show : style.show}
                        onClick={() => copyToClipboard(PostHashHex)}
                      >
                        Copy Link
                      </li>{" "}
                      {/* Always shows */}
                      <li
                        className={isYourPost ? style.show : style.show}
                        onClick={() => sharePost(PostHashHex)}
                      >
                        Share Post
                      </li>{" "}
                      {/* Always shows */}
                      <li
                        onClick={() => {
                          setEditOpen(!editOpen);
                          setEditHash(PostHashHex);
                        }}
                        className={isYourPost ? style.show : style.hide}
                      >
                        Edit post
                      </li>{" "}
                      {/* Shows if this post is the user's post */}
                      <li
                        onClick={() => {
                          setCreateNftOpen(!createNftOpen);
                          setNftHash(PostHashHex);
                        }}
                        className={isYourPost ? style.show : style.hide}
                      >
                        Create NFT
                      </li>{" "}
                      {/* Shows if this post is the user's post */}
                      <li className={isYourPost ? style.hide : style.show}>
                        Report Content
                      </li>{" "}
                      {/* Shows if this post is not the user's post */}
                      {/*<li onClick={()=> setAsProfile(ImageURLs)} className={isImgandNFT ? style.show: style.hide}>Set as Profile Picture</li> {/* Shows if this post is the user's post and is an nft */}
                      <li
                        onClick={() => blockUser(PosterPublicKeyBase58Check)}
                        className={isYourPost ? style.hide : style.show}
                      >
                        Block User
                      </li>{" "}
                      {/* Shows if this post is not the user's post */}
                      <li
                        onClick={() =>
                          deletePost(PostHashHex, PosterPublicKeyBase58Check)
                        }
                        className={isYourPost ? style.show : style.hide}
                      >
                        Delete Post
                      </li>{" "}
                      {/* Shows if this post is the user's post */}
                    </div>
                  </div>

                  <div className={style.container}>
                    <ProfilePic
                      profile={PosterPublicKeyBase58Check}
                      username={value.ProfileEntryResponse.Username}
                      size={50}
                    ></ProfilePic>
                  </div>
                  <div id={PostHashHex} className={style.completeEva}>
                    <div className={style.who} style={{ marginLeft: "1vw" }}>
                      <p>{value.ProfileEntryResponse.Username} </p>
                      <div className={style.accWhen}>
                        {`
                            ${PosterPublicKeyBase58Check.slice(0,4)} ... ${PosterPublicKeyBase58Check.slice(4,6)} ·
                            ${timeSince(TimestampNanos)}          
                        `}
                      </div>
                    </div>

                    <div className={style.evaContent}>
                      <div className={style.mention}>
                        {renderTags(Body.replace("Posted via @EvaSocial", ""), PostHashHex)}
                      </div>
                    </div>
                    {ImageURLs && (
                      <img
                        onClick={(e) => e.stopPropagation()}
                        id={PostHashHex + "Image"}
                        src={ImageURLs[0]}
                        onError={(e) => {
                          HideVideo(PostHashHex + "Image");
                        }}
                        className={style.evaImg}
                        alt="Image"
                        loading="lazy"
                      ></img>
                    )}

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
                      <div
                        style={{
                          position: "relative",
                          paddingBottom: "56.25%",
                          paddingTop: "30px",
                          height: "0px",
                        }}
                      >
                        <iframe
                          title="Video on Eva"
                          id={value.PostHashHex + "Frame"}
                          onError={() => {
                            HideVideo(value.PostHashHex + "Frame");
                          }}
                          style={{
                            position: "absolute",
                            left: "0",
                            top: "0",
                            right: "0",
                            bottom: "0",
                            height: "100%",
                            width: "95%",
                            borderRadius: "8px",
                          }}
                          src={value.PostExtraData.EmbedVideoURL}
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                    {IsNFT && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={style.nft}
                      >
                        <p style={{ display: "inline" }}>
                          {NumNFTCopies} out of {NumNFTCopiesForSale} for sale
                        </p>
                        <button
                          onClick={(e) => {
                            routeNft(
                              isProfile
                                ? profileUsername
                                : value.ProfileEntryResponse.Username,
                              PostHashHex
                            );
                            e.stopPropagation();
                          }}
                          className={style.nftButton}
                          style={{ marginLeft: "20vw" }}
                        >
                          View
                        </button>
                        <button
                          className={style.nftButton}
                          style={{ marginLeft: "1vw" }}
                        >
                          Buy NFT
                        </button>
                      </div>
                    )}

                    {RepostedPostEntryResponse && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={RepostedPostEntryResponse ? "show" : "hide"}
                      >
                        <div
                          className={style.quote}
                          onClick={() =>
                            routePost(RepostedPostEntryResponse.PostHashHex)
                          }
                        >
                          <div className={style.container}>
                            <ProfilePic
                              profile={
                                RepostedPostEntryResponse.PosterPublicKeyBase58Check
                              }
                              username={
                                RepostedPostEntryResponse.ProfileEntryResponse
                                  .Username
                              }
                              size={50}
                            ></ProfilePic>
                          </div>
                          <div
                            id={RepostedPostEntryResponse}
                            className={style.completeEva}
                          >
                            <div
                              className={style.who}
                              onClick={() =>
                                routePost(RepostedPostEntryResponse)
                              }
                            >
                              {
                                RepostedPostEntryResponse.ProfileEntryResponse
                                  .Username
                              }
                              <div className={style.accWhen}>
                                {`
                                         ${RepostedPostEntryResponse.PosterPublicKeyBase58Check.slice(
                                           0,
                                           4
                                         )} ... ${RepostedPostEntryResponse.PosterPublicKeyBase58Check.slice(
                                  4,6
                                )} ·
                                         ${timeSince(
                                           RepostedPostEntryResponse.TimestampNanos
                                         )} 
                                       
                                         `}
                              </div>
                            </div>
                            <div className={style.evaContent}>
                              <div className={style.mention}>
                                {renderTags(
                                  RepostedPostEntryResponse.Body,
                                  value.RepostedPostEntryResponse.PostHashHex
                                )}
                              </div>
                            </div>
                            {RepostedPostEntryResponse.ImageURLs && (
                              <img
                                src={RepostedPostEntryResponse.ImageURLs[0]}
                                className={style.evaImg}
                                alt="Img"
                                loading="lazy"
                              ></img>
                            )}

                            {VideoURLs && (
                              <video
                                id={
                                  RepostedPostEntryResponse.PostHashHex +
                                  "Video"
                                }
                                onError={() => {
                                  HideVideo(
                                    RepostedPostEntryResponse.PostHashHex +
                                      "Video"
                                  );
                                }}
                                className={style.evaImg}
                                alt="Video"
                                controls
                                crossOrigin="*"
                              >
                                <source
                                  src={
                                    "https://ancient-reef-76919.herokuapp.com/" +
                                    RepostedPostEntryResponse.VideoURLs
                                  }
                                  type="video/mp4"
                                />
                                <source
                                  src={RepostedPostEntryResponse.VideoURLs}
                                  type="video/webm"
                                />
                                Your browser does not support HTML video.
                              </video>
                            )}
                            {value.RepostedPostEntryResponse.PostExtraData
                              .EmbedVideoURL && (
                              <div
                                style={{
                                  position: "relative",
                                  paddingBottom: "56.25%",
                                  paddingTop: "30px",
                                  height: "0px",
                                }}
                              >
                                <iframe
                                  title="Video on Eva"
                                  id={
                                    RepostedPostEntryResponse.PostHashHex +
                                    "Reframe"
                                  }
                                  onError={() => {
                                    HideVideo(
                                      RepostedPostEntryResponse.PostHashHex +
                                        "Reframe"
                                    );
                                  }}
                                  style={{
                                    position: "absolute",
                                    left: "0",
                                    top: "0",
                                    right: "0",
                                    bottom: "0",
                                    height: "100%",
                                    width: "95%",
                                    borderRadius: "8px",
                                  }}
                                  src={
                                    value.RepostedPostEntryResponse
                                      .PostExtraData.EmbedVideoURL
                                  }
                                  frameBorder="0"
                                  allowFullScreen
                                ></iframe>
                              </div>
                             
                            )}

                          </div>
                          
                        </div>
                        
                      </div>
                      
                    )}
                    
                    </div>
                </article>
                

              )}
              
            </>
            
          );
         
        })}
    </div>
  );
}
//End of the community posts