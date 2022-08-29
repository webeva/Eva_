import style from "../../styles/Community.module.css";
import SearchBar from "../../components/SearchBar";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import DesoApi from "../../Functions/Desoapi";
import { useEffect, useState } from "react";
const Createcommunity = dynamic(() =>
  import("../../components/CreateCommunityModal")
);
import { useRecoilState } from "recoil";
import { Community } from "../../atom/modalAtom";
import Head from "next/head";

export default function Communities() {
  const router = useRouter();
  const [value, setValue] = useState([]);
  const [postInfo, setPostInfo] = useState();
  const [open, setOpen] = useRecoilState(Community);

  const deso = new DesoApi();
  useEffect(() => {
    getProfile(localStorage.getItem("deso_user_key"));
  }, []);

  async function getProfile(user) {
    const res = await deso.getSingleProfile(user);
    const communities = res.Profile.ExtraData.CommunityList;

    let communityarray = [];
    let communityValue = await Promise.all(
      communities.split(",").map(async function (id) {
        let res = await deso.getSinglePost(id);
        if(res){
          communityarray.push(res.PostFound);
          return communityarray;
        }
        
      })
    );
    setValue(communityValue[0]);
  }

  return (
    <>
      <Head>
        <title>Eva | Community</title>
      </Head>
      <SearchBar />

      <Createcommunity></Createcommunity>
    
      
        <ul className={style.communities}>
          <li onClick={() => setOpen(true)}>
            <img
              className={style.bannerimg}
              src="/images/Create.png"
              alt="community"
            />
            <p>Create A New Community</p>
            <br></br>
            <h4 >
              Click on this button to create a new Eva community on the DeSo
              blockchain.
            </h4>
          </li>
        {value && (
          [...new Set(value)].map(function (post) {
            return (
              <>
                <li
                  onClick={() => router.push(`/community/${post.PostHashHex}`)}
                >
                  <img
                    className={style.bannerimg}
                    src={`${post.PostExtraData.Banner}`}
                    alt="community"
                  />
                  <p>{post.PostExtraData.Name}</p>
                  <br></br>
                  <h4 className={style.des}>{post.PostExtraData.Description}</h4>
                </li>
              </>
          
            )
            })
        )}
        </ul>
    </>
  );
}
