import InputField from "../../components/InputField";
import style from "../../styles/Community.module.css";
import CommunityPosts from "../../components/CommunityPosts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Community() {
  const router = useRouter();
  const [postHash, setPostHash] = useState();
  const id = router.query;
  useEffect(() => {
    setPostHash(id.id);
  }, [id]);
  useEffect(() => {
    setTimeout(() => {
      var objDiv = document.getElementById("posts");
      objDiv.scrollIntoView({ behavior: "smooth" });
    }, 1500);
  }, []);

  return (
    <>
      <div className="pageIdentify">
        <img
          className={style.back}
          onClick={() => history.back()}
          src="/Svg/back.svg"
          width={30}
          height={30}
          alt="back"
        />
        <p id="pageidentify" style={{ display: "inline" }}>
          Community
        </p>
        <div
          style={{ marginLeft: "55vw", display: "inline-block" }}
          className="details"
        ></div>
      </div>

      <div className={style.mainWindow}>
        <div className={style.post}>
          <CommunityPosts postId={postHash} />
          <div id="posts" style={{ paddingBottom: "2vw" }}></div>
        </div>
        <InputField postId={postHash} community={id} />
      </div>
    </>
  );
}
