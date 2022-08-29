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
import { AppState } from "../atom/AppStateAtom";
import { SideBarMobile } from "../atom/modalAtom";
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
const Status = dynamic(() => import("../components/Status"));
const MobileSideBar = dynamic(() => import("../components/MobileSideBar"));
//Import input field
import InputField from "../components/InputField";
import DesoApi from "../Functions/Desoapi";
export default function Home() {
  //Set up some variables
  const [feed, setFeed] = useState("hot");
  const [isMobile, setIsMobile] = useState(false);
  const [logged, SetLogged] = useRecoilState(AppState);
  const deso = new DesoApi();
  const [profile, setProfile] = useState();
  const [username, setUsername] = useState();
  const [open, setOpen] = useRecoilState(SideBarMobile);
  //Intialize the router
  const router = useRouter();

  //Check authentication state
  useEffect(() => {
    checkAuth();
    var w = window.innerWidth;
    if (w <= 700) {
      setIsMobile(true);
    }
  }, []);

  function checkAuth() {
    const user = localStorage.getItem("deso_user_key");
    setProfile(user);
    if (user) {
      //User is logged in
      router.push("/");

      //Set app status to log in
      SetLogged(true);
      getUsername(user);
    } else {
      //User is not logged in

      SetLogged(false);
      router.push("/auth");
    }
  }
  function goToCreatePost() {
    router.push("/create/post");
  }
  async function getUsername(id) {
    const res = await deso.UsernameByPublickey(id);
    setUsername(res);
  }

  //Return the html
  return (
    <>
      {logged != "loading" && (
        <>
          <MobileSideBar />
          <div className={style.create} onClick={() => goToCreatePost()}>
            <img
              style={{
                width: "30px",
                height: "30px",
                left: "50%",
                top: "50%",
                position: "absolute",
                transform: "translate(-50%, -50%)",
                borderRadius:"50%"
              }}
              src="/Svg/comment.svg"
            />
          </div>
          <Status />
          <EditPost />
          <CommentModal />
          <BuyNFTModal />
          <CreateNft />
          <div className={style.pageIdentify}>
            {isMobile && (
              <img
                src={`https://diamondapp.com/api/v0/get-single-profile-picture/${localStorage.getItem(
                  "deso_user_key"
                )}`}
                className={style.profileToMenu}
                onClick={() => setOpen(true)}
              />
            )}
            <p
              id="pageidentify"
              style={{ display: "inline-block", marginLeft: "1vw" }}
            >
              Home
            </p>
            <div
              style={{ marginLeft: "55vw", display: "inline-block" }}
              className="details"
            ></div>
          </div>

          <div className={style.mainContent}>
            {!isMobile && (
              <div>
                {logged ? <InputField community=""></InputField> : <div></div>}
              </div>
            )}

            <main>
              <div className={style.feeds}>
                <div
                  onClick={() => setFeed("following")}
                  className={style.feed}
                >
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
      )}
    </>
  );
}
