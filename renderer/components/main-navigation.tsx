import Link from "next/link";
import { useRouter } from "next/router";
import { Nav } from "react-bootstrap";

export interface MainNavProps {
  onNavLinkClick?: () => void;
  className?: string;
}

export const MainNavigation = (props: MainNavProps) => {
  const router = useRouter();

  return (
    <Nav className={props.className}>
      <Link href="/" passHref>
        <Nav.Link
          active={router.pathname === "/"}
          onClick={() => {
            props.onNavLinkClick ? props.onNavLinkClick() : {};
          }}
        >
          Meal Plan
        </Nav.Link>
      </Link>

      <Link href="/recipes" passHref>
        <Nav.Link
          active={router.pathname === "/recipes"}
          onClick={() => {
            props.onNavLinkClick ? props.onNavLinkClick() : {};
          }}
        >
          Recipes
        </Nav.Link>
      </Link>
      <Link href="/ingredients" passHref>
        <Nav.Link
          active={router.pathname === "/ingredients"}
          onClick={() => {
            props.onNavLinkClick ? props.onNavLinkClick() : {};
          }}
        >
          Ingredients
        </Nav.Link>
      </Link>
    </Nav>
  );
};
