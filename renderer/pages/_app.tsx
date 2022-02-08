import type { AppProps } from "next/app";
import { Fragment } from "react";
import { Normalize } from "styled-normalize";
import { NavHeader } from "../components/nav-header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Normalize />

      <NavHeader />
      <Component {...pageProps} className="h-100" />
    </Fragment>
  );
}
