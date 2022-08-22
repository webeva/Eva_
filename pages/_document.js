import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html id="html" lang="en" dir="ltr" style={{ overflowX: "hidden" }}>
      <Head>
      <meta name="robots" content="index, archive" />
      </Head>
    
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
