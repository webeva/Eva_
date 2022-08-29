import style from "./communityPost.module.css";
import Desoapi from "../../Functions/Desoapi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CommunityPost({ post }) {
  const deso = new Desoapi();
  const [value, setValue] = useState();
  const router = useRouter();
  const [banner, setBanner] = useState();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [fr, setFr] = useState("");
  const [pic, setPic] = useState("/images/profile.png");
  const [bg, setBg] = useState("/images/Banner.webp");
  const [list, setList] = useState("");
  useEffect(() => {
    getCommunities(post);
    const user = localStorage.getItem("deso_user_key");
    getProfile(user);
  }, [post]);

  async function getCommunities(id) {
    if (id) {
      let topic = id.toLowerCase();
      const res = await deso.getSearchFeed(
        localStorage.getItem("deso_user_key"),
        25,
        `${topic}communityoneva`
      );

      setValue(res.HotFeedPage);
    }
  }
  async function getProfile(user) {
    const response = await deso.getSingleProfile(user);
    try {
      const value = response.Profile;

      if (value.Username) {
        setUsername(value.Username);
      }
      if (value.Description) {
        setBio(value.Description);
      }
      if (value.CoinEntry.CreatorBasisPoints) {
        setFr(value.CoinEntry.CreatorBasisPoints);
      }
      if (value.ExtraData.FeaturedImageURL) {
        setBg(value.ExtraData.FeaturedImageURL);
      }
      if (value.ExtraData.CommunityList) {
        setList(value.ExtraData.CommunityList);
      }
      const CurrentPic = await deso.getSingleProfilePicture(user);

      getBase64FromUrl(CurrentPic);
    } catch (error) {
      return;
    }
  }
  const getBase64FromUrl = async (url) => {
   
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
        const base64data = reader.result;  
        setPic(base64data)
      }
    });
  }
  async  function join(postHash){
    let value = list
    if(list != ""){
     
      value = list.concat(`,${postHash}`)
     
      
    }else{
      value = postHash
    }
    updateUserList(value, postHash)
  }
  async  function updateUserList(value, postHash){
    const response = await deso.addToCommunityList(localStorage.getItem("deso_user_key"), username, bio, fr, pic, bg, value)
    router.push(`/community/${postHash}`)
  }
  return (
    <>
      {value &&
        value.map(function (value) {
          return (
            <>
              {value.IsHidden && (
                
                <li
                  className={style.community}
                  onClick={() =>
                    router.push(`/community/${value.PostHashHex}`)
                  }
                >
                  <img
                    className={style.bannerimg}
                    src={`${value.PostExtraData.Banner}`}
                    alt="community"
                  />
                  <p>{value.PostExtraData.Name}</p>
                  <br></br>
                  <h4 style={{wordBreak:"normal", width:"1vw"}}>{value.PostExtraData.Description}</h4>
                  <button className={style.join} onClick={() => join(value.PostHashHex)}>
                    Join
                  </button>
                </li>
              )}
            </>
          );
        })}
    </>
  );
}
