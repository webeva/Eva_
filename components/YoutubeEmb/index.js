/* A component to handle embed links like youtube, 
spotify, tiktok... By default it hides the embed link
until the user decides to show them to save on 
performance and networl costs */

//Import use state from react
import { useState } from "react";
//Import the style
import style from "./YoutubeEmb.module.css";
//Export the component (Takes a link as a param)
export default function Youtube(link) {
  //State of the embed link ie: hidden or showing
  const [video, showVideo] = useState(false); 
  //Return the youtube embed JSX
  return (
    <>
      {video ? (
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            paddingTop: "30px",
            height: "0px",
          }}
        >
          <iframe
            loading="lazy"
            title="Video on Eva"
            style={{
              position: "absolute",
              left: "0",
              top: "0",
              right: "0",
              bottom: "0",
              height: "100%",
              width: "95%",
              borderRadius: "8px",
              minHeight: "10vh",
            }}
            src={link.link}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div className={style.hideVideo} onClick={() => showVideo(true)}>
          This embed link has been hidden to improve performance. Click here to
          reveal this embed link
        </div>
      )}
    </>
  );
}
//End of the youtube embed component