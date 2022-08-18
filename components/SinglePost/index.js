/* This page will be similar to the getMessages 
component but will only get one message and will 
be used in the posts page */

//Import the deso api
import DesoApi from "../../Functions/Desoapi";
//Import Deso 
import Deso from "deso-protocol";

//Import the style from Messagesinfeed
import style from "../../styles/Messageinfeed.module.css";

//Import useEffect and useState from React
import { useEffect, useState } from "react";
//Import nextjs's router
import { useRouter } from "next/router";
//Import Recoil and states
import { useRecoilState } from "recoil";
import {
  modalState, /* Comment modal state ie: open or close */
  postIdState, /* Tells the comment modal which comment we want to comment on */
  NFTState, /* Nft modal state */
  quoteState, /* Quote post modal state */
} from "../../atom/modalAtom";
//Import the profile picture component
import ProfilePic from "../ProfilePic";
//Import Youtube Embed
import YoutubeEmb from "../YoutubeEmb";

//Export the single post component (Takes the post id as a prop)
export default function SinglePost(postId) {
  //Store the postId object as a variable 
  const id = postId.postId;
  //Intialize the deso api
  const deso = new DesoApi();
  const [value, setValue] = useState({}); /* Used to store the post info ie: body... */
  //Set up nextjs's router
  const router = useRouter(); 
  //State of the send comment modal
  const [open, setOpen] = useRecoilState(modalState); /* Comment modal state */
  const [nftOpen, setNftOpen] = useRecoilState(NFTState); /* Nft modal state */
  const [thepostId, setPostId] = useRecoilState(postIdState); /* Post id state */
  const [quote, setQuote] = useRecoilState(quoteState); /* Quote modal state */

  //Get the post information
  useEffect(() => {

    /*Set's quote to false the tell the input field that the input field 
    used on this page is not used to send a quote. It is used to send
    a comment.*/

    setQuote(false);
    //Function to get the single post and save it to the value variable
    const getPost = async (id) => {
      try {
        //Get the single post
        const response = await deso.getSinglePost(id);
        //Set the reponse.PostFound to the value
        setValue(response.PostFound);
      } catch (error) {
        //If there is an error, log it.
        console.log(error);
      }
    };
    //Makes sure that the getpost function only runs when we have the post id.
    if (id) {
      getPost(id);
    }
  }, [id]);

  //Route the user to a post 
  function routePost(id) {
    router.push(`/posts/${id}`);
  }
  //Show the donate diamond modal 
  function opendiamond(PostHashHex) {
    document.getElementById(PostHashHex + "DiamondAmount").style.display = "block";
  }
  //Hide the donate diamond modal
  function closediamond(PostHashHex) {
    document.getElementById(PostHashHex + "DiamondAmount").style.display = "none";
  }

  //Function to send diamonds
  async function sendDiamonds(
    ReceiverPublicKeyBase58Check, /* Who will recieve the diamonds */
    SenderPublicKeyBase58Check, /* Who is sending the diamonds */
    DiamondPostHashHex, /* The post that will be recieving the diamonds */
    DiamondLevel /* The number of diamonds to donate */
  ) {
    //Only runs if a user is logged in
    if (localStorage.getItem("deso_user_key")) {
      //Only runs if a valid receiver is present 
      if (ReceiverPublicKeyBase58Check) {
        try {
          const response = await deso.sendDiamonds(
            ReceiverPublicKeyBase58Check, /* Person that will receive the diamonds */
            SenderPublicKeyBase58Check, /* Person that is sending the diamonds */
            DiamondPostHashHex, /* The post that is receiving the diamonds */
            DiamondLevel /* The number of diamonds being given */
          );

          //Get the current number of diamonds on the post 
          let currentdiamond = parseInt(document.getElementById(DiamondPostHashHex + "DiamondCount").value);
          //Add the number of diamonds the user has donated to the amount of diamonds on that post
          document.getElementById(DiamondPostHashHex + "DiamondCount").value = currentdiamond + DiamondLevel ;
        } catch (error) {
          //If we catch an error log it
          console.log(error);
        }
      }
    } else {
      //If the user is not logged in reroute them to the auth page
      router.push("/auth");
    }
  }

  //This function likes or unlikes posts (Takes in the post id as a param)
  async function like(message) {
    const deso = new Deso(); /* Intialiaze Deso */
    let IsUnlike; /* If true this is an unlike */
    if (document.getElementById(message + "likeimg").src == "http://localhost:3000/Svg/star-on.svg" || document.getElementById(message + "likeimg").src == "https://web3eva.netlify.app/Svg/star-on.svg") {

      //If the img src shows that the user has already liked the post then this is an unlike
      IsUnlike = true;
      //get the current like count and subtract one
      let current = parseInt(document.getElementById(message + "likecount").innerText);
      current -= 1;
      //Set the current likes to the new current number 
      document.getElementById(message + "likecount").innerText = current.toString() + " Likes";
      //Set the text to white
      document.getElementById(message + "likecount").style.color = "white";
      //Set the image src to the white star
      document.getElementById(message + "likeimg").src = "/Svg/star.svg";
    } else {
      //This is a like and not an unlike
      IsUnlike = false;
      //get the current like count and add one
      let current = parseInt(document.getElementById(message + "likecount").innerText);
      current += 1;
      //Set the current likes to the new current number 
      document.getElementById(message + "likecount").innerText = current.toString() + " Likes";
       //Set the text to yellow
      document.getElementById(message + "likecount").style.color = "yellow";
      //Set the image src to the yellow star
      document.getElementById(message + "likeimg").src = "/Svg/star-on.svg";
    }
    //Form the like/unlike request 
    const request = {
      ReaderPublicKeyBase58Check: localStorage.getItem("deso_user_key"), /* Current user */
      LikedPostHashHex: message, /* Post id */
      MinFeeRateNanosPerKB: 1000, /* MinFeeRateNanosPerKb */
      IsUnlike: IsUnlike, /* If this is a like or unlike */
    };
    //Send the request 
    const response = await deso.social.createLikeStateless(request);
  }



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
    //Time difference in days
    var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
    //Time difference in hours
    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    //Time difference in minutes
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";

    //If the post was sent one day ago set it to sent yesterday
    if (d == 1) {
      dDisplay = "Yesterday";
      hDisplay = "";
      mDisplay = "";
    }
    
    //If it was sent more than a day ago only return the number of days ago
    if (dDisplay) {
      //The number of days that have past
      return dDisplay;
    } else if (hDisplay) {
      //The number of hours that have past
      return hDisplay;
    } else if (mDisplay) {
      //The number of minutes that have past
      return mDisplay;
    } else {
      //If not a minute has past return this
      return "A few seconds ago";
    }
  }

  //Function that renders tags, hashtags and clickable links (Takes the message as a param)
  function renderTags(content) {
    //Replace @ with a link to that user's page
    let innerText = content.replace(
      /(@+[a-zA-Z0-9A-Za-zÀ-ÖØ-öø-ʸ(_)]{1,})/g,
      (mention) => {
        return `<a   href="/profile/${mention.substring(1)}">${mention}</a>`;
      }
    );

    //Replace # with a search in posts with that hashtag
    innerText = innerText.replace(/(#(?:[^\x00-\x7F]|\w)+)/g, (hashtags) => {
      return `<a   href="/search/post/${hashtags.substring(
        1
      )}"  >${hashtags}</a>`;
    });

    //Replace links with clickable links
    innerText = innerText.replace(
      /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gm,
      (links) => {
        if(links.includes("http")){
          return `<a  href="${links}" >${links}</a>`;
         }else{
          return `<a  href="https://${links}" >${links}</a>`;
         }
      }
    );
    
    //Return the new component (Must be using dangerouslysetInnerHtml)
    return <div dangerouslySetInnerHTML={{ __html: innerText }}></div>;
  }

  //Opens the repost/requote modal 
  function openRepost(PostHashHex) {
    document.getElementById(PostHashHex + "SingleRepost").style.display = "block";
  }

  //This function reposts a post. Takes the post id as a param
  async function repost(PostHash) {
    const response = await deso.rePost(
      localStorage.getItem("deso_user_key"), /* Current logged in user */
      PostHash /* Post hash */
    );
    //Get the current repost count and add one
    let current = document.getElementById("SingleRepost" + PostHash).innerText;
    let currentVar = parseInt(current) + 1;
    //Set the new repost count as the current one
    document.getElementById("SingleRepost" + PostHash).innerText = currentVar + " Reposts";
    //Set the color of the current repost count to lightgreen
    document.getElementById("SingleRepost" + PostHash).style.color = "lightgreen";
    //Set the color of the repost svg to green
    document.getElementById("SingleRepostImg" + PostHash).src = "/Svg/repost-on.svg";
  }

  //Return the singlepost Jsx
  return (
    <>
      {/* Runs if the value is greater than one. Meaning that we have the post information */}
      {Object.keys(value).length > 0 && (
        <div
          style={{
            color: "var(--color-white)",
            overflowX: "hidden",
            marginLeft: "30px",
            marginTop: "15px",
            width: "100%",
          }}
        >
          <div className={style.container}>
            <ProfilePic
              profile={value.ProfileEntryResponse.PublicKeyBase58Check}
              username={value.ProfileEntryResponse.Username}
              size={50}
              IsNFT={
                value.ProfileEntryResponse.ExtraData
                  ? value.ProfileEntryResponse.ExtraData.NFTProfilePictureUrl
                  : null
              }
            ></ProfilePic>
            <div
              className={style.who}
              style={{ display: "inline-block", marginLeft: "1vw" }}
            >
              {value.ProfileEntryResponse.Username}
              <div className={style.accWhen}>
                {`
                    ${value.PosterPublicKeyBase58Check.slice(0,4)} ... ${value.PosterPublicKeyBase58Check.slice(38)} ·
                    ${timeSince(value.TimestampNanos)}                     
                `}
              </div>
            </div>
          </div>
          <br></br>
          <br></br>
          <div id={value.PostHashHex} className={style.completeEva}>
            <div className={style.evaContent}>
              <div className={style.mention}>{renderTags(value.Body)}</div>
              {value.ImageURLs && (
                <img
                  src={value.ImageURLs}
                  className={style.evaImg}
                  alt="evaImg"
                ></img>
              )}
            </div>

            {value.VideoURLs && (
              value.VideoURLs != "" && (
                <>
                  <div id={value.PostHashHex + "Frame"} style={{position:"relative", paddingBottom:"56.25%", paddingTop:"30px", height:"0px", }}>
                      <iframe loading="lazy" title="Video on Eva"  style={{position:"absolute", left:"0", top:"0", right:"0", bottom:"0", height:"100%", width:"95%", borderRadius:"8px", minHeight:"10vh"}}  src={value.VideoURLs} frameBorder="0" allowFullScreen></iframe>
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
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    right: "0",
                    bottom: "0",
                    height: "100%",
                    width: "100%",
                    borderRadius: "8px",
                  }}
                  src={value.PostExtraData.EmbedVideoURL}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            {value.PostExtraData.EmbedVideoURL && (
                <YoutubeEmb link={value.PostExtraData.EmbedVideoURL}></YoutubeEmb>                  
            )}
            {value.IsNFT && (
              <div className={style.nft}>
                <p style={{ display: "inline" }}>
                  {value.NumNFTCopiesForSale} out of {value.NumNFTCopies} for
                  sale
                </p>
                <button
                  onClick={() =>
                    routeNft(
                      value.ProfileEntryResponse.Username,
                      value.PostHashHex
                    )
                  }
                  className={style.nftButton}
                  style={{ marginLeft: "20vw" }}
                >
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNftOpen(!nftOpen);
                  }}
                  className={style.nftButton}
                  style={{ marginLeft: "1vw" }}
                >
                  Buy NFT
                </button>
              </div>
            )}

            {value.RepostedPostEntryResponse && (
              <div
                className={value.RepostedPostEntryResponse ? "show" : "hide"}
              >
                <div
                  className={style.quote}
                  onClick={() =>
                    routePost(value.RepostedPostEntryResponse.PostHashHex)
                  }
                >
                  <div className={style.container}>
                    <ProfilePic
                      profile={
                        value.RepostedPostEntryResponse.ProfileEntryResponse
                          .PublicKeyBase58Check
                      }
                      username={
                        value.RepostedPostEntryResponse.ProfileEntryResponse
                          .Username
                      }
                      size={50}
                      IsNFT={
                        value.RepostedPostEntryResponse.ProfileEntryResponse
                          .ExtraData
                          ? value.RepostedPostEntryResponse.ProfileEntryResponse
                              .ExtraData.NFTProfilePictureUrl
                          : null
                      }
                    ></ProfilePic>
                    <div
                      className={style.who}
                      style={{ display: "inline-block" }}
                    >
                      {
                        value.RepostedPostEntryResponse.ProfileEntryResponse
                          .Username
                      }
                      <div className={style.accWhen}>
                        {`
                            ${value.RepostedPostEntryResponse.PosterPublicKeyBase58Check.slice(0,4)} ... ${value.RepostedPostEntryResponse.PosterPublicKeyBase58Check.slice(38)} ·
                            ${timeSince(value.RepostedPostEntryResponse.TimestampNanos)} 
                        `}
                      </div>
                    </div>
                  </div>
                  <br></br>
                  <br></br>
                  <div
                    id={value.RepostedPostEntryResponse}
                    className={style.completeEva}
                  >
                    <div className={style.evaContent}>
                      <div className={style.mention}>
                        {renderTags(value.RepostedPostEntryResponse.Body)}
                      </div>
                    </div>
                    {value.RepostedPostEntryResponse.ImageURLs && (
                      <img
                        src={value.RepostedPostEntryResponse.ImageURLs[0]}
                        className={style.evaImg}
                        alt="Img"
                        loading="lazy"
                      ></img>
                    )}

                    {value.RepostedPostEntryResponse.VideoURLs && (
                        value.RepostedPostEntryResponse.VideoURLs != "" && (
                            <div style={{position:"relative", paddingBottom:"56.25%", paddingTop:"30px", height:"0px", }}>
                                <iframe loading="lazy" title="Video on Eva" style={{position:"absolute", left:"0", top:"0", right:"0", bottom:"0", height:"100%", width:"95%", borderRadius:"8px"}} src={value.RepostedPostEntryResponse.VideoURLs} frameBorder="0" allowFullScreen></iframe>
                            </div>
                        )
                    )}
                    {value.RepostedPostEntryResponse.PostExtraData.EmbedVideoURL && (
                        <YoutubeEmb link={value.RepostedPostEntryResponse.PostExtraData.EmbedVideoURL}></YoutubeEmb>
                    )}
                    
                    
                    {value.RepostedPostEntryResponse.IsNFT && (
                      <div className={style.nft}>
                        <p style={{ display: "inline" }}>
                          {value.RepostedPostEntryResponse.NumNFTCopiesForSale}{" "}
                          out of {value.RepostedPostEntryResponse.NumNFTCopies}{" "}
                          for sale
                        </p>
                        <button
                          onClick={() =>
                            routeNft(
                              value.RepostedPostEntryResponse
                                .ProfileEntryResponse.Username,
                              value.RepostedPostEntryResponse.PostHashHex
                            )
                          }
                          className={style.nftButton}
                          style={{ marginLeft: "11vw" }}
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setNftOpen(!nftOpen);
                          }}
                          className={style.nftButton}
                          style={{ marginLeft: "1vw" }}
                        >
                          Buy NFT
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className={style.interactions} style={{ marginLeft: "7vw" }}>
              <div
                className={style.diamondamount}
                id={value.PostHashHex + "DiamondAmount"}
                onMouseOver={() => opendiamond(value.PostHashHex)}
                onMouseLeave={() => closediamond(value.PostHashHex)}
              >
                <ul>
                  <li
                    onClick={() =>
                      sendDiamonds(
                        value.ProfileEntryResponse.PublicKeyBase58Check,
                        localStorage.getItem("deso_user_key"),
                        value.PostHashHex,
                        1
                      )
                    }
                    key="1 Diamond"
                  >
                    <img
                      src="/Svg/tip.svg"
                      width={20}
                      height={20}
                      alt="Tip1Gem"
                    />
                    1
                  </li>
                  <li
                    onClick={() =>
                      sendDiamonds(
                        value.ProfileEntryResponse.PublicKeyBase58Check,
                        localStorage.getItem("deso_user_key"),
                        value.PostHashHex,
                        5
                      )
                    }
                    key="5 Diamonds"
                  >
                    <img
                      src="/Svg/tip.svg"
                      width={20}
                      height={20}
                      alt="Tip5Gems"
                    />
                    5
                  </li>
                  <li
                    onClick={() =>
                      sendDiamonds(
                        value.ProfileEntryResponse.PublicKeyBase58Check,
                        localStorage.getItem("deso_user_key"),
                        value.PostHashHex,
                        10
                      )
                    }
                    key="10 Diamonds"
                  >
                    <img
                      src="/Svg/tip.svg"
                      width={20}
                      height={20}
                      alt="Tip10Gems"
                    />
                    10
                  </li>
                  <li
                    onClick={() =>
                      sendDiamonds(
                        value.ProfileEntryResponse.PublicKeyBase58Check,
                        localStorage.getItem("deso_user_key"),
                        value.PostHashHex,
                        40
                      )
                    }
                    key="40 Diamonds"
                  >
                    <img
                      src="/Svg/tip.svg"
                      width={20}
                      height={20}
                      alt="Tip40Gems"/>
                    40
                  </li>
                  <li
                    onClick={() =>
                      sendDiamonds(
                        value.ProfileEntryResponse.PublicKeyBase58Checks,
                        localStorage.getItem("deso_user_key"),
                        value.PostHashHex,
                        100
                      )
                    }
                    key="100 Diamonds"
                  >
                    <img
                      src="/Svg/tip.svg"
                      width={20}
                      height={20}
                      alt="Tip100Gems"
                    />
                    100
                  </li>
                </ul>
              </div>
              {/* Repost or Quote */}
              <div
                className={style.repost}
                id={value.PostHashHex + "SingleRepost"}
              >
                <ul>
                  {/* Repost */}
                  <li
                    onClick={() => {
                      if (localStorage.getItem("deso_user_key") != null) {
                        repost(value.PostHashHex);
                      } else {
                        console.log("not logged in");
                      }
                    }}
                  >
                    
                    <img
                      style={{ marginRight: "0.5vw" }}
                      src={
                        Object.values(value.PostEntryReaderState)[2]
                          ? "/Svg/repost-on.svg"
                          : "/Svg/repost.svg"
                      }
                      width={23}
                      height={23}
                      alt="Repost"
                    />
                    Repost
                  </li>
                  {/* Quote */}
                  <li
                    onClick={() => {
                      if (localStorage.getItem("deso_user_key") != null) {
                        setPostId(value.PostHashHex);
                        setOpen(!open);
                        setQuote(true);
                      } else {
                        router.push("/auth")
                      }
                    }}
                  >
                    <img
                      style={{ marginRight: "0.5vw" }}
                      src={
                        Object.values(value.PostEntryReaderState)[2]
                          ? "/Svg/quote-on.svg"
                          : "/Svg/quote.svg"
                      }
                      width={23}
                      height={23}
                      alt="Quote"
                    />
                    Quote
                  </li>
                </ul>
              </div>
              <div
                onClick={() => {
                  if (localStorage.getItem("deso_user_key") != null) {
                    setPostId(value.PostHashHex);
                    setOpen(!open);
                    setQuote(false);
                  } else {
                    router.push("/auth");
                  }
                }}
                className={style.interactionNums}
              >
                <img
                  alt="CommentOnPost"
                  src="/Svg/comment.svg"
                  width={21}
                  height={21}
                />
              </div>

              <div
                id={value.PostHashHex}
                onClick={() => {
                  if (localStorage.getItem("deso_user_key") != null) {
                    like(value.PostHashHex);
                  } else {
                    router.push("/auth");
                  }
                }}
                className={style.interactionNums}
              >
                <img
                  id={value.PostHashHex + "likeimg"}
                  src={
                    Object.values(value.PostEntryReaderState)[0]
                      ? "/Svg/star-on.svg"
                      : "/Svg/star.svg"
                  }
                  width={20}
                  height={20}
                  alt="Star"
                />
              </div>
              <div
                onClick={() => openRepost(value.PostHashHex)}
                className={style.interactionNums}
              >
                <img
                  id={"SingleRepostImg" + value.PostHashHex}
                  src="/Svg/repost.svg"
                  width={24}
                  height={24}
                  alt="Repost"
                />
              </div>
              <div
                onMouseLeave={() => closediamond(value.PostHashHex)}
                onMouseOver={() => opendiamond(value.PostHashHex)}
                className={style.interactionNums}
              >
                <img src="/Svg/tip.svg" width={21} height={21} alt="Tip" />
              </div>
            </div>
          </div>
          <div className={style.line}></div>
          <br></br>
          <p style={{ marginLeft: "2vw", display: "inline" }}>
            {value.CommentCount} Comments
          </p>
          <p
            style={{
              display: "inline",
              color: Object.values(value.PostEntryReaderState)[0]
                ? "yellow"
                : "white",
              marginLeft: "6vw",
            }}
            id={value.PostHashHex + "likecount"}
          >
            {value.LikeCount} Likes
          </p>
          <p
            style={{ display: "inline", marginLeft: "6vw" }}
            id={"SingleRepost" + value.PostHashHex}
          >
            {value.RepostCount} Reposts
          </p>
          <p
            style={{ display: "inline", marginLeft: "6vw" }}
            id={value.PostHashHex + "DiamondCount"}
          >
            {value.DiamondCount} Diamonds
          </p>
          <br></br>
          <br></br>
          <div className={style.line}></div>
        </div>
      )}
    </>
  );
}
//End of single post component