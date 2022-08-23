/* This page is an authenticated page
which allows the user to login or create
a new account. Rendered whenever the user is
not viewing a post or account and is not logged 
in. Ex: Tries to visit the setting while not 
being logged in */

import Head from "next/head";
import { AppState } from "../atom/AppStateAtom";
import { useRecoilState } from "recoil";
//Import use Router
import { useRouter } from "next/router";
import { useEffect } from "react";
//Import Style
import style from "../styles/Auth.module.css";
//Import Deso
import DesoApi from "../Functions/Desoapi";
//Import Next link 
import Link from "next/link"

export default function Auth() {
  const [logged, SetLogged] = useRecoilState(AppState);
  const deso = new DesoApi();
  const router = useRouter();
  useEffect(() => {
    checkAuth();
  }, []);

  async function login() {
    const response = await deso.login();
    checkAuth();
  }
  async function safeLogin(){
    const response = await deso.safeLogin();
    checkAuth();
  }
  function checkAuth() {
    const user = localStorage.getItem("deso_user_key");
    if (user) {
      //User is logged in
      router.push("/");
      //Set app status to log in
      SetLogged(true);
    } else {
      //User is not logged in
      router.push("/auth");
      SetLogged(false);
    }
  }
  return (
    <>
      <Head>
        <title>Login To Eva</title>
        <meta charset="UTF-8"></meta>
        <meta property="og:title" content="Login To Eva" />
        <meta
          property="og:description"
          content="Create an Eva account. The top decentralized social media platform. From turning your posts to NFTs and earning crypto for posting, this is the revolution in social media. "
        />
        <meta property="og:url" content="https://web3eva.netlify.app" />

        <meta name="twitter:title" content="Login To Eva" />
        <meta
          name="twitter:description"
          content="Create an Eva account. The top decentralized social media platform. From turning your posts to NFTs and earning crypto for posting, this is the revolution in social media."
        />
        <meta name="twitter:url" content="https://web3eva.netlify.app" />
        <meta
          name="twitter:card"
          content="Create an Eva account. The top decentralized social media platform. From turning your posts to NFTs and earning crypto for posting, this is the revolution in social media."
        />

        <meta
          name="description"
          content="Create an Eva account. The top decentralized social media platform. From turning your posts to NFTs and earning crypto for posting, this is the revolution in social media."
          data-rh="true"
        />
        <meta
          name="keywords"
          content="decentralized social media, decentralized social media apps, decentralised social media platform, login to the new social media, Alternative social media, blockchain social media, distributed social network, blockchain social media example, Blockchain social media 2022"
        />
        <meta name="robots" content="index, archive" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2f3136" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <div className={style.container}>
        {/* Star animation source code: https://github.com/WebDevSHORTS/Parallax-Star-Background/blob/master/style.css */}
        <div className={style.stars}></div>
        <div className={style.stars2}></div>

        <div className={style.formContainer}>
          <div className={style.login}>
            <form action="#" className={style.loginForm}>
              <h2 className={style.title}>Login to Eva</h2>

              <div className={style.loginSignup} onClick={() => login()}>
                <img src="/images/favicon.png" alt="DesoLogin"></img>
                Login with DeSo
              </div>
              
              <div className={style.loginSignup} onClick={() => safeLogin()}>
                <img src="/images/favicon.png" alt="Eva"></img>
                Safe Login to Eva
              </div>
              <p className={style.pTag}>
                By creating an account you agree to our {" "}
                <Link className={style.aTag} href="/terms">
                   Terms and Conditions
                </Link>
               
                {" "} and {" "}
                <a className={style.aTag} href="#">
                   Privacy Policies
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
