import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html id="html" lang="en" dir="ltr" style={{ overflowX: "hidden" }}>
      <Head/>
    
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
