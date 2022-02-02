import { useState } from "react";
import { Container, Navbar, Offcanvas } from "react-bootstrap";
import { MainNavigation } from "./main-navigation";

export const NavigationBar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  return (
    <Navbar expand="sm" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Toggle
          onClick={() => {
            setShowOffcanvas(true);
          }}
        />
        <Navbar.Offcanvas
          placement="start"
          show={showOffcanvas}
          onHide={() => {
            setShowOffcanvas(false);
          }}
        >
          <Offcanvas.Header closeButton></Offcanvas.Header>
          <Offcanvas.Body>
            <MainNavigation
              onNavLinkClick={() => {
                setShowOffcanvas(false);
              }}
            />
          </Offcanvas.Body>
        </Navbar.Offcanvas>
        <MainNavigation className="d-none d-sm-flex" />
      </Container>
    </Navbar>
  );
};
