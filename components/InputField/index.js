/* This is the input field component. This field is used 
to upload images and send messages. Can be used to post 
messages or comments */

//Import styles
import style from "../../styles/Main.module.css";
//Import from react
import { useState, useRef, useEffect } from "react";
//Import Deso Api
import DesoApi from "../../Functions/Desoapi";
//Import router
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { modalState, quoteState, EditStateHash, EditState, UploadWesite } from "../../atom/modalAtom";
import { Response } from "../../atom/modalAtom";
import dynamic from "next/dynamic";
const Picker = dynamic(() => import('emoji-picker-react'), {
  ssr:false,
})

export default function InputField(postId, community) {
 
  const communityvalue = postId.community.id
  
 
  const [selectedFile, setSelectedFile] = useState("");
  const [theFile, setTheFile] = useState(null);
  const [linkstate, setLinkState] = useState(false);
  const [quote, setQuote] = useRecoilState(quoteState);
  const [website, setWebsite] = useRecoilState(UploadWesite)
  const [quoteComment, setQuoteComment] = useState("Leave a comment");
  const [quoteBtn, setQuoteBtn] = useState("Comment");
  const [closebutton, setclosebutton] = useState("none");
  let file = []
  const [newmessage, setnewmessage] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [link, setLink] = useState("");
  const [open, setOpen] = useRecoilState(modalState);
  const inputFile = useRef(null);
  const deso = new DesoApi();
  const router = useRouter();
  let endText = `

Posted via @EvaSocial`
  const [postHash, setPostHash] = useRecoilState(EditStateHash);
  const [editState, setEditState] = useRecoilState(EditState)

  const [response, setResponse] = useRecoilState(Response);
  useEffect(()=>{
   
    if(postHash){
      getPost(postHash)
    }
  }, [postHash])
  /* Send message on the app */
  async function sendMessage() {
    /* If no postId is passed to this component as a prop
    it means that it is being used to send a message or 
    else it is being used to comment on a post */

    if(!newmessage.length > 0 && !theFile){
      alert("Message cannot be empty")
    }else{

    
    function getId(link) {
      if (link) {
        const regExp =
          /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = link.match(regExp);

        return match && match[2].length === 11 ? match[2] : null;
      }
    }
   
    if(postHash){
      //Edit a post 
      setQuote(false);
      
      let endUrl = getId(link);
        let url;
        if (endUrl) {
          url = "https://www.youtube.com/embed/" + endUrl;
        } else {
          url = null;
        }
        const user = localStorage.getItem("deso_user_key");
        try{
          const response = await deso.editMessage(user, newmessage, theFile, url, postHash);
          setResponse(response)
        }catch(error){
          return
        }
        
        
        
        setQuote(false);
        //Clear the input field and upload image field once the message has been sent
        document.getElementById("postTxtArea").value = "";
        setLink("");
        setLinkState(false);
        setTheFile(null);
        file = [];
        setSelectedFile("");
        //Set the post hash to null
        setPostHash(null)
        //Close the modal
        setEditState(false)
        setnewmessage("")
        
    }else{
      if (!postId.postId) {
       
        //Send a message
        setQuote(false);
        let endUrl = getId(link);
        let url;
        if (endUrl) {
          url = "https://www.youtube.com/embed/" + endUrl;
        } else {
          url = null;
        }
        const user = localStorage.getItem("deso_user_key");
        let communityid = "";
        if(communityvalue){
        
          communityid = `
#${communityvalue}`
        }
        const response = await deso.sendMessage(user, newmessage + endText + communityid, theFile, url);
        if(response.TransactionHex){
          const approve = window.open('https://identity.deso.org/approve?tx=' + response.TransactionHex)
        }
        setResponse(response)
        setQuote(false);
        //Clear the input field and upload image field once the message has been sent
        document.getElementById("postTxtArea").value = "";
        setLink("");
        setLinkState(false);
        setTheFile(null);
        file = [];
        setSelectedFile("");
        setnewmessage("")
      } else {
        if (quote) {
          
          //Quote the message
          const user = localStorage.getItem("deso_user_key");
          let endUrl = getId(link);
          let url;
          if (endUrl) {
            url = "https://www.youtube.com/embed/" + endUrl;
          } else {
            url = null;
          }
          const response = await deso.sendQuote(
            user,
            newmessage + endText,
            theFile,
            url,
            postId.postId
          );
          setResponse(response)
  
          document.getElementById("postTxtArea").value = "";
          setTheFile(null);
          setLink("");
          setLinkState(false);
          setSelectedFile("");
          //Clear the input field and upload image field once the message has been sent
          file = [];
          //Close the comment modal
          setOpen(false);
          setnewmessage("")
        } else {
          
          //Comment on the message
          let endUrl = getId(link);
          let url;
          if (endUrl) {
            url = "https://www.youtube.com/embed/" + endUrl;
          } else {
            url = null;
          }
          const user = localStorage.getItem("deso_user_key");
          const response = await deso.sendComment(
            user,
            newmessage + endText,
            theFile,
            postId.postId,
            url
          ).then(()=>{
            setResponse(response)
          document.getElementById("postTxtArea").value = "";
          setTheFile(null);
          setLink("");
          setLinkState(false);
          setSelectedFile("");
          //Clear the input field and upload image field once the message has been sent
          file = [];
          //Close the comment modal
          setOpen(false);
          setnewmessage("")
          //Redirect the user to that post's page
         
          if(communityvalue == undefined){
            setTimeout(() => {
              router.push(`/posts/${postId.postId}`);
            }, 1000);
           
          }else{
           
            router.push(`/community/${communityvalue}`)
          }
        });
          
        }
    }
  }
      
      
    
    }
  }
  //On image button click, click on the input field.
  const onImageClick = () => {
    inputFile.current.click();
  };
  //Once the x is clicked remove the uploaded image.
  function removeupload() {
    setTheFile(null);
    setSelectedFile("")
   
  }
  const onEmojiClick = (event, emojiObject) => {
    
    let value = newmessage += emojiObject.emoji
   
    setnewmessage(value)
  
  };
  function showPicker(){
    if(document.getElementById("picker").style.display == "none"){
      document.getElementById("picker").style.display = "block"
    }else{
      document.getElementById("picker").style.display = "none"
    }
  }

  async function getPost(postHash){
   
    const response = await deso.getSinglePost(postHash)
    const postFound = response.PostFound
    if(postFound.ImageURLs){
      setTheFile(postFound.ImageURLs)
      setSelectedFile(postFound.ImageURLs)
    }
    if(postFound.Body){
      setnewmessage(postFound.Body)
    }
    try{
      if(postFound.PostExtraData.EmbedVideoURL){
        setLink(postFound.PostExtraData.EmbedVideoURL)
        setLinkState(true)
      }
    }catch(error){
      return
    }
   
    

    
  }
  //Set the selected file as the image url
  const changeHandler = (event) => {
    //Get the selected image
    const img = event.target.files[0];
    getImageUrl(img)
    setclosebutton("flex");
  };

  //Resize the textarea as more text is written 
  function autoGrow(element){
    element.style.height = "auto"
    element.style.height = (element.scrollHeight)+"px";
  }

  async function getImageUrl (result){
    const user = localStorage.getItem("deso_user_key")
    const JWT = await deso.getJwt(user)
    const link = await deso.uploadImage(user, JWT, result)
    setTheFile(link.ImageURL)
    setSelectedFile(link.ImageURL)
  }
  //Set the cureent logged user to deso_user_key on first render
  useEffect(() => {
    setCurrentUser(localStorage.getItem("deso_user_key"));
    if(postHash){
     
      setQuoteComment("Edit this post")
      setQuoteBtn("Edit")
    }else if(postId.postId){
      if (quote) {
        setQuoteComment("Quote this post");
        setQuoteBtn("Quote");
      } else {
        setQuoteComment("Leave a comment");
        setQuoteBtn("Comment");
      }
    }else{
      setQuoteComment("Start a message");
      setQuoteBtn("Post");
    }
    
  }, []);
  function setProfile(src){
    document.getElementById("InputProfile").src = src
  }
  //Return the JSX
  return (
    <div className={style.profileEva}>
      <img
        src={
          currentUser
            ? "https://diamondapp.com/api/v0/get-single-profile-picture/" +
              currentUser
            : "/images/profile.png"
        }
        className={style.profilePic}
        alt="profilepic"
        rel="preload"
        id="InputProfile"
        onError={()=> setProfile("/images/profile.png")}
      ></img>

      <div className={style.evaBox}>
        <textarea
          label=""
          id="postTxtArea"
          name="postTxtArea"
          onChange={(e) => setnewmessage(e.target.value)}
          onInput={(e)=> autoGrow(e.target)}
          placeholder={quoteComment}
          type="text"
          value={newmessage}
          className={style.evaText}
          ></textarea>

        <input
          onChange={(e) => setLink(e.target.value)}
          value={link}
          className={linkstate ? "show" : "hide"}
          placeholder="Youtube video or Spotify link"
          style={{
            padding: "10px 8px",
            borderRadius: "5px",
            marginLeft: "1vw",
            marginBottom: "1vw",
            backgroundColor: "var(--color-bg)",
            color: "var(--color-white)",
            border: "1px solid var(--color-white)",
            width: "52%",
            fontSize: "15px",
          }}
        />

        {selectedFile && (
          <div className={style.imagecontainer}>
            <img
              src={selectedFile}
              className={style.evaImg}
              alt="uploaded image"
            ></img>
            <button
              id="removeuploadbtn"
              onClick={removeupload}
              style={{ display: closebutton }}
              className={style.removeuploadbtn}
            >
              <img
                style={{
                  width: "24px",
                  height: "24px",
                  verticalAlign: "middle",
                }}
                src="/Svg/x.svg"
                alt = "Remove uploaded Image"
              />
            </button>
          </div>
        )}

        <input
          alt="uploadImage"
          type="file"
          accept="image/*"
          name="file"
          ref={inputFile}
          onChange={changeHandler}
          style={{ display: "none" }}
        />
        <div className={style.imgOrEva}>
          <div className={style.imgDiv} onClick={onImageClick}>
            <img
              style={{ width: "20px", height: "20px" }}
              src="/Svg/image.svg"
              alt="Uploaded Image"
            />
          </div>
          <div
            onClick={() => {
              setLinkState(!linkstate), setLink("");
            }}
            className={style.imgDiv}
          >
            <img
              style={{ width: "22px", height: "22px" }}
              src="/Svg/link.svg"
              alt="Embed link"
            />
          </div>
          <div >
            <div className={style.imgDiv}>
              <img
                style={{ width: "23px", height: "23px" }}
                src="/Svg/emoji.svg"
                alt="emoji"
                onClick={()=> showPicker()}
              />
            </div>
          </div>
          <div className={style.imgOrEva}>
            <div className={style.imgDiv}>
              <img
                style={{ width: "23px", height: "23px" }}
                src="/Svg/Web.svg"
                alt="Web"
                onClick={()=> setWebsite(true)}
              />
            </div>
          </div>

          <div className={style.evaOptions}>
            <div className={style.eva} onClick={sendMessage}>
              {quoteBtn}
            </div>
          </div>
          
        </div>
        <div id="picker" style={{display:"none", position:"absolute"}}>
        <Picker onEmojiClick={onEmojiClick}  />
        </div>
       
      </div>
      
    </div>
  );
}
