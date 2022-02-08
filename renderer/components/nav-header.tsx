import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";

export const NavHeader = () => {
  const router = useRouter();
  return (
    <Fragment>
      <Link href={"/"}>Plans</Link>
      <Link href={"/recipes"}>Recipes</Link>
      <Link href={"/ingredients"}>Ingredients</Link>
      <Link href={"/data"}>Data</Link>
    </Fragment>
  );
};
