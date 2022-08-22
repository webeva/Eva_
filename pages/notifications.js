/* This is the notification page which
is used to display all the unread notifications
to the user if they are logged in */

import Head from "next/head";
//Import the deso api
import DesoApi from "../Functions/Desoapi";
//Import useeffect and usestate from react
import { useEffect, useState } from "react";
//Import the style
import style from "../styles/Notifications.module.css";
//Import the router
import { useRouter } from "next/router";
//Import Recoil and atoms
import { useRecoilState } from "recoil";
import { NotifiImage, NotificationAmount } from "../atom/notificationAtom";
//Import Spinner
import LoadingSpinner from "../components/Spinner";
import NotificationPost from "../components/NotificationPost";
//Import Profile Picture
import ProfilePic from "../components/ProfilePic";
const Notifications = () => {
  //Stores all the notifications
  const [notificationsFeed, setnotifications] = useState([]);
  //Stores the usernames
  const [name, setname] = useState([]);
  let usernames = [];
  //Stores the text of each notification ex: Liked your message
  const [text, setTexts] = useState([]);
  let texts = [];
  //Stores the image type of each notification
  const [imgs, setImgs] = useState([]);
  let images = [];
  //Create the router
  const router = useRouter();
  //Create new deso api
  const deso = new DesoApi();
  /* Set the notification amount and change the notification 
    image to let the user know that they saw the image */
  const [notificationAmount, setNotificationAmount] =
    useRecoilState(NotificationAmount);
  const [notifiImage, setNotifiImage] = useRecoilState(NotifiImage);

  useEffect(() => {
    if (!localStorage.getItem("deso_user_key")) {
      router.push("/auth");
    }
  });
  useEffect(() => {
    const getnoti = async () => {
      //Get the current users user key
      const user = localStorage.getItem("deso_user_key");
      //If the user is logged in
      if (user) {
        //Set the notification count to 0
        setNotificationAmount("");
        //Change the notification image
        setNotifiImage(false);

        let FetchStartIndex = -1;
        let notifi = await deso.getnotifications(user, 20, FetchStartIndex);
        setnotifications(notifi);
        notifi.map(function (value) {
          setNotificationText(
            value.Metadata.TxnType,
            value.Metadata.BasicTransferTxindexMetadata.DiamondLevel
          );
        });
        var promises = notifi.map(function (value) {
          return UsernameOf(value.Metadata.TransactorPublicKeyBase58Check);
        });

        Promise.all(promises).then(function (results) {
          setname(results);
        });
      }
    };
    async function UsernameOf(id) {
      let value = await deso.UsernameByPublickey(id);
      return value;
    }

    const setNotificationText = (type, amount) => {
      if (amount > 0) {
        const value = 0.01;
        const usdvalue = value * amount;
        if (amount == 1) {
          texts.push("Gave your post " + amount + " diamond! " + "(~$0.01)");
          images.push("/Svg/tip-on.svg");
        } else {
          texts.push(
            "Gave your post " + amount + " diamonds! " + "(~$" + usdvalue + ")"
          );
          images.push("/Svg/tip-on.svg");
        }
      } else {
        if (type == "LIKE") {
          texts.push("Liked your post!");
          images.push("/Svg/star-on.svg");
        } else if (type == "FOLLOW") {
          texts.push("Started following you!");
          images.push("/Svg/user-on.svg");
        } else if (type == "SUBMIT_POST") {
          texts.push("Replied to your post!");
          images.push("/Svg/reply-on.svg");
        } else if (type == "NFT_TRANSFER") {
          texts.push("Transferred an NFT to you!");
          images.push("/Svg/transfer-on.svg");
        } else if (type == "DAO_COIN_TRANSFER") {
          texts.push("Transferred a dao coin!");
          images.push("/Svg/tip-on.svg");
        } else if (type == "BASIC_TRANSFER") {
          texts.push("Sent you $Deso!");
          images.push("/Svg/tip-on.svg");
        } else if (type === "DAO_COIN_LIMIT_ORDER") {
          texts.push("Limited their Dao coin order");
          images.push("/Svg/tip-on.svg");
        } else if (type == "CREATOR_COIN") {
          texts.push("Bought some of your creator coin!");
          images.push("/Svg/tip-on.svg");
        } else {
          console.log(type);
          texts.push("Performed a " + type);
        }
      }

      setTexts(texts);
      setImgs(images);
    };
    //Call the get notification function
    getnoti();
  }, []);

  //Return the html
  return (
    <>
      <Head>
        <title>Eva | Notifications</title>
      </Head>
      <div className="pageIdentify">
        <p id="pageidentify" style={{ display: "inline" }}>
          Notifications
        </p>
        <div
          style={{ marginLeft: "55vw", display: "inline-block" }}
          className="details"
        ></div>
      </div>
      <div></div>
      <div className="mainWindow">
        {notificationsFeed.length > 0 ? (
          notificationsFeed?.map(function (value, index) {
            return (
              <div key={index} className={style.container}>
                <div style={{ display: "inline-block", marginLeft: "1vw" }}>
                  <ProfilePic
                    profile={value.Metadata.TransactorPublicKeyBase58Check}
                    size={43.5}
                    username={name[index]}
                  ></ProfilePic>
                  <div style={{ display: "inline", marginLeft: "1vw" }}>
                    <strong
                      key={index + "Username"}
                      style={{ display: "inline" }}
                    >
                      {name[index] ? name[index] : "Loading"}{" "}
                    </strong>

                    {text[index]}
                  </div>
                  <img
                    src={imgs[index]}
                    alt = "User profile"
                    width={30}
                    height={30}
                    style={{
                      display: "inline-block",
                      position: "absolute",
                      top: "10px",
                      right: "5px",
                    }}
                  ></img>
                </div>
                {value.Metadata.LikeTxindexMetadata && (
                  <NotificationPost
                    id={value.Metadata.LikeTxindexMetadata.PostHashHex}
                  />
                )}
                {value.Metadata.BasicTransferTxindexMetadata && (
                  <NotificationPost
                    id={value.Metadata.BasicTransferTxindexMetadata.PostHashHex}
                  />
                )}
                {value.Metadata.SubmitPostTxindexMetadata && (
                  <NotificationPost
                    id={value.Metadata.SubmitPostTxindexMetadata.PostHashBeingModifiedHex}
                  />
                )}
              </div>
            );
          })
        ) : (
          <div
            className="mainWindow"
            style={{ marginTop: "50vh", marginLeft: "5vw" }}
          >
            <LoadingSpinner />
            <p style={{ color: "var(--color-white)" }}>Loading...</p>
          </div>
        )}
      </div>
    </>
  );
};
//Export the notifications page
export default Notifications;
