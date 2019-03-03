import { Link } from "gatsby";
import React from "react";

export default function Header ({ siteTitle }) {
  return (
    <header>
      <h1>
        <Link to="/">{ siteTitle }</Link>
      </h1>
      <nav>
        <Link to="/">Posts</Link>
      </nav>
    </header>
  );
}
