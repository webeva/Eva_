/* A spinner component which is 
rendered when content is loading. Used in the 
notification page, and feed */

//Import style
import style from "./Spinner.module.css";
//Import Recoil State for auth status
import { useRecoilState } from "recoil";
import { AppState } from "../../atom/AppStateAtom";

//Export the Loading Spinner
export default function LoadingSpinner() {
  /*Get logged state so that the spinner only loads when the user
  is authenticated. */
  const [logged] = useRecoilState(AppState);
  //Return the Jsx only if the user is logged in
  return <div className={logged ? style.loader : style.hide}></div>;
}
//End of the loading spinner componenet 
