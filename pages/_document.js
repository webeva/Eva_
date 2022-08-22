import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html id="html" lang="en" dir="ltr" style={{ overflowX: "hidden" }}>
      <Head>
        <link rel="manifest" href = "/manifest.json"/>
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <meta name="theme-color" content="#2f3136" />
        <meta name='application-name' content='Eva' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Eva' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='description' content='The most advanced decentralized social media platform built on top of a blockchain. Gain cryptocurrency by posting and sharing. A revolution in social media yet to take over the world.' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
