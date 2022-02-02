import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

export const NavigationBar: React.FC = () => {
  const router = useRouter();
  return (
    <Navbar>
      <Container fluid>
        <Link href="/" passHref>
          <Navbar.Brand className="h1 pb-0">Meal Plan</Navbar.Brand>
        </Link>

        <Nav>
          <Link href="/ingredients" passHref>
            <Nav.Link active={router.pathname === "/ingredients"}>
              Ingredients
            </Nav.Link>
          </Link>
          <Link href="/recipes" passHref>
            <Nav.Link active={router.pathname === "/recipes"}>Recipes</Nav.Link>
          </Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
