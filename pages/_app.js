//Importing the styles
import "../styles/globals.css";
import style from "../styles/Home.module.css";
//Import dynamic loading
import dynamic from "next/dynamic";
//Importing the components
import Sidebar from "../components/Sidebar";
const Rightbar = dynamic(() => import("../components/Rightbar"));
const MobileBottomBar = dynamic(() => import("../components/MobileBottomBar"));
//Import head for seo
import Head from "next/head";
//Import recoil for global variables
import { RecoilRoot } from "recoil";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [showRighbar, SetShowRightBar] = useState(true);
  const [showSidebar, SetShowSidebar] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [theme, setTheme] = useState("");
  const [color, setColor] = useState("");
  const [bg, setBg] = useState("");
  useEffect(() => {
    try {
      if (localStorage.getItem("primaryColor")) {
        setColor(localStorage.getItem("primaryColor"));
      } else {
        setColor("blue");
      }
    } catch (error) {
      setColor("blue");
    }

    try {
      if (localStorage.getItem("theme")) {
        setTheme(localStorage.getItem("theme"));
        if (theme == "sun") {
          setBg("white");
        } else if (theme == "abyss") {
          setBg("#1E1E2C");

          document.getElementById("html").style.background = "#1E1E2C";
        } else {
          setBg("rgba(47,49,54,255)");
          document.getElementById("html").style.background =
            "rgba(47,49,54,255)";
        }
      } else {
        setTheme("vortex");
        setBg("rgba(47,49,54,255)");
      }
    } catch (error) {
      setTheme("vortex");
      setBg("rgba(47,49,54,255)");
    }

    if (router.pathname) {
      const path = router.pathname;

      if (
        path == "/settings" ||
        path == "/settings/display" ||
        path == "/settings/account" ||
        path == "/settings/language" ||
        path == "/settings/extensions"
      ) {
        SetShowRightBar(false);
        SetShowSidebar(true);
      } else if (path == "/auth" || path == "/terms") {
        SetShowRightBar(false);
        SetShowSidebar(false);
        setIsAuth(true);
      } else {
        SetShowRightBar(true);
        SetShowSidebar(true);
      }
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Eva</title>
        <meta charset="UTF-8"></meta>
        <meta property="og:title" content="Eva" />
        <meta
          property="og:description"
          content="The most advanced decentralized social media platform built on top of a blockchain. Gain cryptocurrency by posting and sharing. A revolution in social media yet to take over the world."
        />
        <meta
          property="og:image"
          content="https://web3eva.netlify.app/static/media/Eva.1f9ff24b.png"
        />
        <meta property="og:url" content="https://web3eva.netlify.app" />
        <meta name="twitter:title" content="Eva" />
        <meta
          name="twitter:description"
          content="The most advanced decentralized social media platform built on top of a blockchain. Gain cryptocurrency by posting and sharing. A revolution in social media yet to take over the world."
        />
        <meta
          name="twitter:url"
          content="https://web3eva.netlify.app/static/media/Eva.1f9ff24b.png"
        />
        <meta
          name="twitter:card"
          content="The most advanced decentralized social media platform built on top of a blockchain. Gain cryptocurrency by posting and sharing. A revolution in social media yet to take over the world."
        />
        <meta
          name="keywords"
          content="decentralized social media, decentralized social media apps, decentralised social media platform, decentralised twitter, deso, post2earn, posttoearn, twitter decentralized social media, decentralized twitter alternative, decentralized social media blockchain, elon musk decentralized social media, decentralized social media apps, decentralized, twitter, share, connect, blockchain, earn, cryptocurrency, decentralized social media platforms blockchain, best decentralized social media platforms, Top decentralized social media platforms"
        />
        <meta name="robots" content="index, archive" />
        <meta
          name="google-site-verification"
          content="-QDfATapg28Fu8VwKF5f1h1S4aB3sPL8LLGKnD6MK6Y"
        />
        <meta
          name="description"
          content="The most advanced decentralized social media platform built on top of a blockchain. Gain cryptocurrency by posting and sharing. A revolution in social media yet to take over the world."
          data-rh="true"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2f3136" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />

        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="canonical" href="https://web3eva.netlify.app/" />
      </Head>
      <RecoilRoot style={{ fontSize: "20px" }}>
        <div
          className={style.wrapper}
          data-color={color}
          data-theme={theme}
          style={{ backgroundColor: bg }}
        >
          <div className={style.content} style={{ backgroundColor: bg }}>
            <div className={showSidebar ? style.sideBar : style.hide}>
              <Sidebar />
            </div>
            <div>
              <Component {...pageProps} />
            </div>
            <div className={showRighbar ? style.rightBar : style.hide}>
              <Rightbar />
            </div>
            <div className={isAuth ? "hide" : "phone"}>
              <MobileBottomBar />
            </div>
          </div>
        </div>
      </RecoilRoot>
    </>
  );
}
//Export the app
export default MyApp;
