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
  function copyToClipboard(value){
    //Used in production mode
    var productionLink = "https://www.evasocial.app/community/"
    //Used in development
    var localHost = "http://localhost:3000/community/"
    //Get the link to copy to the clipboard
    var copyText = `${productionLink}${value}`
    //Copy to clipboard
    navigator.clipboard.writeText(copyText);
  }
  function shareCommunity(value){
    //Used in production mode
    var productionLink = "https://www.evasocial.app/community/"
    //Used in development
    var localHost = "http://localhost:3000/community/"
    //Get the link to copy to the clipboard
    var url = `${productionLink}${value}`
    try{
      const shareData = {
        title: "Community on Eva",
        text: `Check out this awesome community from Eva!`,
        url: url
      }
      navigator.share(shareData);
    }catch(error){
      alert(error)
      return
    }
  }
  function showModal(id){
    if(document.getElementById(`${id}Modal`).style.display == "block"){
      document.getElementById(`${id}Modal`).style.display = "none"
    }else{
      document.getElementById(`${id}Modal`).style.display = "block"
    }
    
  }
  async function tipCreator(id, receiver ){
    const user = localStorage.getItem("deso_user_key")
    const tipdiamond = deso.sendDiamonds(receiver, user, id, 1 )
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
                ><img onClick={(e)=> {
                  e.stopPropagation()
                  showModal(post.PostHashHex)
                }}  className={style.edit}  width={15} height={15} alt="more" src="/Svg/more.svg"></img>
                
                  <ul className={style.dropDown} id={`${post.PostHashHex}Modal`} >
                    <li key="copyLink" onClick={(e)=> {copyToClipboard(post.PostHashHex), e.stopPropagation()}}>Copy Link</li>
                    <li key="shareLink" onClick={(e)=> {shareCommunity(post.PostHashHex), e.stopPropagation()}}>Share Link</li>
                    <li key="tipCreator" onClick={(e)=> {tipCreator(post.PostHashHex, post.PosterPublicKeyBase58Check), e.stopPropagation()}}>Tip 1 Diamond</li>
                  </ul>
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
        <h2 style={{marginLeft:"1vw"}}>Featured Communities</h2>
        <li 
                  onClick={() => router.push(`/community/cc91b430f9418f28a0b541741809f764939bb3170f812da726f86f033c54db0a`)}
                ><img onClick={(e)=> {
                  e.stopPropagation()
                  showModal("cc91b430f9418f28a0b541741809f764939bb3170f812da726f86f033c54db0a1")
                }}  className={style.edit}  width={15} height={15} alt="more" src="/Svg/more.svg"></img>
                
                  <ul className={style.dropDown} id={`cc91b430f9418f28a0b541741809f764939bb3170f812da726f86f033c54db0a1Modal`} >
                    <li key="copyLink" onClick={(e)=> {copyToClipboard("cc91b430f9418f28a0b541741809f764939bb3170f812da726f86f033c54db0a"), e.stopPropagation()}}>Copy Link</li>
                    <li key="shareLink" onClick={(e)=> {shareCommunity("cc91b430f9418f28a0b541741809f764939bb3170f812da726f86f033c54db0a"), e.stopPropagation()}}>Share Link</li>
                    <li key="tipCreator" onClick={(e)=> {tipCreator("cc91b430f9418f28a0b541741809f764939bb3170f812da726f86f033c54db0a", "BC1YLgEETQbgfgEUc4oDZhmCumbidnybyst1jfH1LizPsEjCV6Hxp1v"), e.stopPropagation()}}>Tip 1 Diamond</li>
                  </ul>
                  <img
                    className={style.bannerimg}
                    src={"https://images.deso.org/f78ef577f0026ca20926b2e20ed4b79c2b3bb2d154b8ff720d727c37b8c919fc.webp"}
                    alt="community"
                  />
                  <p>Seelz Social</p>
                  <br></br>
                  <h4 className={style.des}>Seelz Island Collective was born from Disruptepreneur Fund on DeSo Protocol, a new layer-1 blockchain built from the ground up to scale decentralized social applications to one billion users. Disruptepreneur, also known as Jeremy Gardner is a long-time blockchain OG having started Augur Project and BEN (Blockchain Education Network). SirGuy apos operates as his digital pseudonym in the web3 space, and Seelz Island Collective was created as a vehicle to explore the web3 space from all points of view. We are Investors, Collectors, VC Fund Managers, and NFT Collection Founders.</h4>
                  
                </li>

                <li 
                  onClick={() => router.push(`/community/a3a390aa651273bedc2148fd7008972389df67c91fefff31620cdce4972246a0`)}
                ><img onClick={(e)=> {
                  e.stopPropagation()
                  showModal("a3a390aa651273bedc2148fd7008972389df67c91fefff31620cdce4972246a01")
                }}  className={style.edit}  width={15} height={15} alt="more" src="/Svg/more.svg"></img>
                
                  <ul className={style.dropDown} id={`a3a390aa651273bedc2148fd7008972389df67c91fefff31620cdce4972246a01Modal`} >
                    <li key="copyLink" onClick={(e)=> {copyToClipboard("a3a390aa651273bedc2148fd7008972389df67c91fefff31620cdce4972246a0"), e.stopPropagation()}}>Copy Link</li>
                    <li key="shareLink" onClick={(e)=> {shareCommunity("a3a390aa651273bedc2148fd7008972389df67c91fefff31620cdce4972246a0"), e.stopPropagation()}}>Share Link</li>
                    <li key="tipCreator" onClick={(e)=> {tipCreator("a3a390aa651273bedc2148fd7008972389df67c91fefff31620cdce4972246a0", "BC1YLhNySXmFdZDyuwT9V115PbbSB2dfx2Y4mKowBwGDYx7KDDE2Ycb"), e.stopPropagation()}}>Tip 1 Diamond</li>
                    
                  </ul>
                  <img
                    className={style.bannerimg}
                    src={"/images/Banner.webp"}
                    alt="community"
                  />
                  <p>Eva</p>
                  <br></br>
                  <h4 className={style.des}>The official Eva community</h4>
                  
                </li>
        </ul>
       
    </>
  );
}
