import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html id="html" lang="en" dir="ltr" style={{ overflowX: "hidden", backgroundColor:"rgba(47, 49, 54, 255)" }}>
      <Head>
      <base href="/" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
