/* This is the main page of the settings page.
This page is only rendered if the users is logged
in. This page is used to navigate to the other 
pages in the setting part of the website */

import Head from "next/head";
import { useEffect } from "react";
import SettingBar from "../../components/SettingBar";
const Settings = () => {
  useEffect(() => {
    if (!localStorage.getItem("deso_user_key")) {
      router.push("/auth");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Eva | Settings</title>
      </Head>
      <div className="pageIdentify">
        <p id="pageidentify" style={{ display: "inline" }}>
          Settings
        </p>
      </div>
      <SettingBar />
    </>
  );
};
//Export the settings page
export default Settings;
