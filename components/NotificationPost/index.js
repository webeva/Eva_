/* A componenet that displays the relevant post 
to a notification the user might have */

import { useEffect, useState } from "react";
import DesoApi from "../../Functions/Desoapi";
import { useRouter } from "next/router";
import style from "../../styles/MessageInFeed.module.css";

export default function NotificationPost(id) {
  
    const deso = new DesoApi();
  const [postInfo, setPostInfo] = useState("");
  const router = useRouter();
  useEffect(() => {
    getPostInfo(id.id);
  }, []);

  async function getPostInfo(id) {
   
      const response = await deso.getSinglePost(id);
    try {
      if (response) {
        setPostInfo(response.PostFound);
      }
    } catch (error) {
      console.log(error);
      return;
    }
    
    
  function routePost(id) {
    router.push(`/posts/${id}`);
  }
  return (
    <>
      {postInfo && (
        <article
          onClick={() => routePost(id.id)}
          style={{
            margin: "1vw 1vw",
            height: "auto",
            width: "45vw",
            padding: "10px 10px",
            borderRadius: "10px",
          }}
        >
          {postInfo.IsHidden ? (
            <div
              style={{
                marginLeft: "2vw",
                width: "45vw",
                height: "10vh",
                backgroundColor: "var(--color-grey)",
                textAlign: "center",
                borderRadius: "10px",
                lineHeight: "10vh",
              }}
            >
              
              This Post was hidden by you
            </div>
          ) : (
            <article
              className={style.feedEva}
              style={{
                width: "45vw",
                border: "1px solid var(--color-primary)",
                borderRadius: "5px",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
              key={postInfo.PostHashHex}
            >
              {postInfo.Body}
            </article>
          )}
        </article>
      )}
    </>
  );
  }
  
}
//End of notification post component