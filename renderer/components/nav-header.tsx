import { Anchor, Header, Nav } from "grommet";
import { useRouter } from "next/router";

export const NavHeader = () => {
  const router = useRouter();
  return (
    <Header pad="medium">
      <Nav direction="row">
        <Anchor
          onClick={() => {
            router.push("/");
          }}
        >
          Plans
        </Anchor>
        <Anchor
          onClick={() => {
            router.push("/recipes");
          }}
        >
          Recipes
        </Anchor>
        <Anchor
          onClick={() => {
            router.push("/ingredients");
          }}
        >
          Ingredients
        </Anchor>
        <Anchor
          onClick={() => {
            router.push("/data");
          }}
        >
          Data
        </Anchor>
      </Nav>
    </Header>
  );
};
