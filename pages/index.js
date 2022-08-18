/* This is the main page of the website.
I.e: going to / goes to this page. This page
will only show if the user is logged in. This
site includes the textbox to send messages and
the feeds which the user uses to interact with 
other posts */

//Import styles
import style from "../styles/Main.module.css";
//Import from react
import { useState, useEffect } from "react";
//Import Messages
import MessageInFeed from "../components/MessageInFeed";
//Import paginiation atom
import { loadState } from "../atom/feedAtom";
import { AppState, HasAccount } from "../atom/AppStateAtom";
import { useRecoilState } from "recoil";
//Import use Router
import { useRouter } from "next/router";
//Import dynamic loading from next
import dynamic from "next/dynamic";
//Import message comment modal dynamicaly so that we only load it when we need it.
const CommentModal = dynamic(() => import("../components/CommentModal"));
const BuyNFTModal = dynamic(() => import("../components/BuyNFTModal"));
const CreateNft = dynamic(() => import("../components/CreateNFT"));
const EditPost = dynamic(() => import("../components/EditPostModal"));
//Import input field
import InputField from "../components/InputField";
export default function Home() {
  //Set up some variables
  const [feed, setFeed] = useState("hot");
  const [load, setLoad] = useRecoilState(loadState);
  const [logged, SetLogged] = useRecoilState(AppState);

  //Intialize the router
  const router = useRouter();

  //Check authentication state
  useEffect(() => {
    checkAuth();
  }, []);

  function checkAuth() {
    const user = localStorage.getItem("deso_user_key");
    if (user) {
      //User is logged in
      router.push("/");
      //Set app status to log in
      SetLogged(true);
    } else {
      //User is not logged in

      SetLogged(false);
      router.push("/auth");
    }
  }

  //Return the html
  return (
    <>
      <div className="pageIdentify">
        <CommentModal />
        <BuyNFTModal />
        <CreateNft />
        <EditPost></EditPost>
        <p id="pageidentify" style={{ display: "inline" }}>
          Home
        </p>
        <div
          style={{ marginLeft: "55vw", display: "inline-block" }}
          className="details"
        ></div>
      </div>

      <div className={style.mainContent}>
        {logged ? <InputField></InputField> : <div></div>}

        <main>
          <div className={style.feeds}>
            <div onClick={() => setFeed("following")} className={style.feed}>
              Following
            </div>
            <div onClick={() => setFeed("hot")} className={style.feed}>
              Recommended
            </div>
            <div onClick={() => setFeed("latest")} className={style.feed}>
              Latest
            </div>
            <div onClick={() => setFeed("politics")} className={style.feed}>
              #Politics
            </div>
            <div onClick={() => setFeed("news")} className={style.feed}>
              #News
            </div>
            <div onClick={() => setFeed("meme")} className={style.feed}>
              #Meme
            </div>
            <div onClick={() => setFeed("gaming")} className={style.feed}>
              #Gaming
            </div>
            <div onClick={() => setFeed("food")} className={style.feed}>
              #Food
            </div>
          </div>

          <MessageInFeed feed={feed} />
        </main>
      </div>
    </>
  );
}
