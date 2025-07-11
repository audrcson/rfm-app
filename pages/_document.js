import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Tambahkan aturan print di sini */}
        <style>
          {`
            @page {
              size: A4 portrait;
              margin: 1cm;
            }
          `}
        </style>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
