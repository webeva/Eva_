/* This is the profile pic component. This profile picture
is lazy loaded and changes shape depending on if the profile
pic is an nft or not. Takes a deso user key as a prop */

//Import nextjs's router
import { useRouter } from "next/router";
//Import useState and useEffect from react 
import { useState, useEffect } from "react";
//Import image from next/image
import Image from "next/image";
//Import the style
import style from "./ProfilePic.module.css";

//Export the profile picture component 
export default function ProfilePic({ profile, username, size, IsNFT }) {
  //Set up nextjs's router
  const router = useRouter();
  const user = username; /* The username of the user */
  //Set up the deso api 
  const [profilePic, setProfilePic] = useState(
    "https://diamondapp.com/api/v0/get-single-profile-picture/" +
      profile +
      "?fallback=https://diamondapp.com/assets/img/default_profile_pic.png"
  );
  const [isNft, setIsNft] = useState(false); /* Stores if the profile pic is an nft or not */
  let sizes = 50;
  //Set the profile sizes to size if given. Default is 50px
  if (size) {
    sizes = size;
  }
  /* With the addition of nft profile picture we will first 
  check if the user's profile picture is an nft and if so 
  we set the profile picture to be that nft */
  useEffect(() => {
    if(IsNFT){
      setProfilePic(IsNFT);
      setIsNft(true);
    }else {
      setIsNft(false);
    }
  }, []);


  //When a user clicks on the profile picture route it to that user's profile page
  function routeProfile(user) {
    if (user) {
      router.push(`/profile/${user}`);
    }
  }
  //Return the profile picture jsx
  return (
    <>
      {isNft ? (
        <div
          className={style.NFTContainer}
          style={{
            width: `${sizes + 5}px`,
            height: `${(sizes + 5) * 0.866}px`,
          }}
        >
          <div
            className={style.NFTContainer2}
            style={{
              width: ` ${sizes + 5 - 4}px`,
              /* container width - (border thickness * 2) */ height: ` ${
                (sizes + 5) * 0.866 - 4
              }px` /* container height - (border thickness * 2) */,
            }}
          >
            <img
              className={style.NFTImage}
              onClick={() => {
                routeProfile(user);
               
              }}
              src={profilePic}
              alt="NFT Profile Picture"
              loading="lazy"
              
            ></img>
          </div>
        </div>
      ) : (
        <Image
          className={style.profilePicture}
          onClick={() => {
            routeProfile(user);
            
          }}
          src={profilePic}
          alt="Profile Picture"
          width={sizes}
          height={sizes}
          loading="lazy"
          
        ></Image>
      )}
    </>
  );
}
//End of the profile picture component 