import type { AppProps } from "next/app";
import { Container } from "react-bootstrap";
import { NavigationBar } from "../components/navigation-bar";
import "../scss/style.scss";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Container fluid className="p-0 d-sm-flex min-vh-100">
      <NavigationBar />
      <Component {...pageProps} className="h-100" />
      {/* <FooterComponent /> */}
    </Container>
  );
}
