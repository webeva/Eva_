import InputField from "../../components/InputField";
import Status from "../../components/Status";

export default function CreatePost() {
  return (
    <>
      <Status></Status>
      <div className="pageIdentify">
        <img
          style={{ verticalAlign: "top" }}
          onClick={() => history.back()}
          src="/Svg/back.svg"
          width={30}
          height={30}
          alt="back"
        />
        <p id="pageidentify" style={{ display: "inline" }}>
          Create Post
        </p>
        <div
          style={{ marginLeft: "55vw", display: "inline-block" }}
          className="details"
        ></div>
      </div>
      <div style={{ marginTop: "10vh" }}>
        <InputField community="" />
      </div>
    </>
  );
}
