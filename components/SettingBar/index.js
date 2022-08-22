/* This componenet is used to naviagate between 
the different settings page. On desktop it shows 
alongside the rest of settings page but on mobile
it appears as its seperate page */



//Import the style
import style from "../../styles/Settings.module.css";
//Import the Deso Api
import DesoApi from "../../Functions/Desoapi";
//Import nextjs's router
import { useRouter } from "next/router";

//Export the setting bar
export default function SettingBar() {
  //Set up next router
  const router = useRouter();
  //Set up the deso api
  const deso = new DesoApi();
  //Async function that deletes the user's personal information
  async function deleteInfo() {
    //Get the current user's public key
    const user = localStorage.getItem("deso_user_key");
    //If the key is valid delete the account
    if (user) {
      const JWT = await deso.getJwt(user);
      const deleteStatus = await deso.deleteInfo(user, JWT);
    }
  }
  //Reroutes to the coinbase buy deso link (external link)
  function buyDeso() {
    window.location.replace(
      "https://www.coinbase.com/price/decentralized-social"
    );
  }
  //Function that routes to the terms page
  function visitTerms() {
    router.push("/terms");
  }
  //Function that routes to a section of the settings page
  function goTo(id) {
    router.push(`/settings/${id}`);
  }
  //Return the JSX (Prettier format)
  return (
    <>
      <ul
        className={style.settinglist}
        style={{ background: "var(--color-bg)" }}
      >
        <li onClick={() => goTo("account")}>
          <img
            className={style.settingicon}
            src="/Svg/brush.svg"
            width={27}
            height={30}
            alt="Customize"
          />
          <div className={style.profile}>
            <div className={style.who}>
              <h3>Customize your account</h3>
            </div>
            <div className={style.accWhen}>
              <p>Change your account information.</p>
            </div>
          </div>
        </li>
        <li onClick={() => goTo("display")}>
          <img
            className={style.settingicon}
            src="/Svg/Display.svg"
            width={25}
            height={25}
            alt="Display"
          />
          <div className={style.profile}>
            <div className={style.who}>
              <h3>Display</h3>
            </div>
            <div className={style.accWhen}>
              <p>Manage your theme, colors, and font size.</p>
            </div>
          </div>
        </li>
        <li onClick={() => goTo("language")}>
          <img
            className={style.settingicon}
            src="/Svg/Language.svg"
            width={25}
            height={25}
            alt="Language"
          />
          <div className={style.profile}>
            <div className={style.who}>
              <h3>Language</h3>
            </div>
            <div className={style.accWhen}>
              <p>Pick the language in which the page will be in.</p>
            </div>
          </div>
        </li>
        <li onClick={() => buyDeso()}>
          <img
            className={style.settingicon}
            src="/Svg/tip.svg"
            width={25}
            height={25}
            alt="Customize"
          />
          <div className={style.profile}>
            <div className={style.who}>
              <h3>Buy/Withdraw $DeSo</h3>
            </div>
            <div className={style.accWhen}>
              <p>Click here to purchase $DeSo.</p>
            </div>
          </div>
        </li>
        <li onClick={() => goTo("extensions")}>
          <img
            className={style.settingicon}
            src="/Svg/extension.svg"
            width={25}
            height={25}
            alt="Terms"
          />
          <div className={style.profile}>
            <div className={style.who}>
              <h3>Developer Extensions</h3>
            </div>
            <div className={style.accWhen}>
              <p>Facilitate the developer experience.</p>
            </div>
          </div>
        </li>
        <li onClick={() => visitTerms()}>
          <img
            className={style.settingicon}
            src="/Svg/Terms.svg"
            width={25}
            height={25}
            alt="Terms"
          />
          <div className={style.profile}>
            <div className={style.who}>
              <h3>Terms and Conditions</h3>
            </div>
            <div className={style.accWhen}>
              <p>Visit and read our terms and conditions.</p>
            </div>
          </div>
        </li>
        <li onClick={() => deleteInfo()}>
          <img
            className={style.settingicon}
            src="/Svg/Deactivate.svg"
            width={25}
            height={25}
            alt="Deactivate"
          />
          <div className={style.profile}>
            <div className={style.who}>
              <h3>Delete your personal info</h3>
            </div>
            <div className={style.accWhen}>
              <p>Delete your personal info on Eva and Deso.</p>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}
//End of the setting bar component 