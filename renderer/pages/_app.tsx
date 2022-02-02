import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import { Container } from "react-bootstrap";
import { NavigationBar } from "../components/navigation-bar";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Container fluid className="p-0">
      <NavigationBar />
      <Component {...pageProps} className="h-100" />
      {/* <FooterComponent /> */}
    </Container>
  );
}
