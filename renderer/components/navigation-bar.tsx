import React, { Fragment, useState } from "react";
import { Container, Navbar, Offcanvas } from "react-bootstrap";
import { MainNavigation } from "./main-navigation";

export const NavigationBar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  return (
    <Fragment>
      <Navbar
        expand="sm"
        bg="dark"
        variant="dark"
        sticky="top"
        className="d-block d-sm-none" // visible only on xs
      >
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
        </Container>
      </Navbar>
      <MainNavigation
        navProps={{
          className: "d-none d-sm-inline flex-column p-2 bg-dark text-center",
          variant: "pills",
        }}
        navLinkClassName="text-light"
      />
    </Fragment>
  );
};
