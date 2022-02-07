import { Box, Grommet } from "grommet";
import { grommet } from "grommet/themes";
import type { AppProps } from "next/app";
import { Fragment } from "react";
import { Normalize } from "styled-normalize";
import { NavHeader } from "../components/nav-header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Normalize />
      <Grommet full theme={grommet}>
        <Box fill>
          <NavHeader />
          <Component {...pageProps} className="h-100" />
        </Box>
      </Grommet>
    </Fragment>
  );
}
