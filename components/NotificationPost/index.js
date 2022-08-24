/* A componenet that displays the relevant post 
to a notification the user might have */

import { useEffect, useState } from "react";
import DesoApi from "../../Functions/Desoapi";
import { useRouter } from "next/router";
import style from "../../styles/MessageInFeed.module.css";
import ProfilePic from "../ProfilePic";

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
  }
  function routePost(id) {
    router.push(`/posts/${id}`);
  }
  function renderTags(content) {
    let innerText = content.replace(
      /(@+[a-zA-Z0-9A-Za-zÀ-ÖØ-öø-ʸ(_)]{1,})/g,
      (mention) => {
        return `<a   href="/profile/${mention.substring(1)}">${mention}</a>`;
      }
    );
    innerText = innerText.replace(/(#(?:[^\x00-\x7F]|\w)+)/g, (hashtags) => {
      return `<a   href="/search/post/${hashtags.substring(
        1
      )}"  >${hashtags}</a>`;
    });
    innerText = innerText.replace(
      /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gm,
      (links) => {
        if (links.includes("http")) {
          return `<a  href="${links}" >${links}</a>`;
        } else {
          return `<a  href="https://${links}" >${links}</a>`;
        }
      }
    );

    return <div dangerouslySetInnerHTML={{ __html: innerText }}></div>;
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
            minWidth: "fit-content",
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
              style={{
                width: "auto",
                minHeight: "20px",
                outline: "1px solid var(--color-primary)",
                borderRadius: "5px",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                paddingLeft: "1vw",
                padding: "18px 18px",
              }}
              key={postInfo.PostHashHex}
            >
              <ProfilePic
                profile={postInfo.PosterPublicKeyBase58Check}
                username={postInfo.ProfileEntryResponse.Username}
                size={45}
              ></ProfilePic>
              <br></br>
              <br></br>
              <div className={style.mention}>{renderTags(postInfo.Body)}</div>
              {postInfo.ImageURLs && (
                <img
                  src={postInfo.ImageURLs[0]}
                  className={style.evaImg}
                  alt="Image"
                  loading="lazy"
                ></img>
              )}

              {postInfo.VideoURLs && postInfo.VideoURLs != "" && (
                <>
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
                      src={postInfo.VideoURLs}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                </>
              )}
            </article>
          )}
        </article>
      )}
    </>
  );
}
//End of notification post component
