import { Link } from "gatsby";
import React from "react";

export default function Header({ siteTitle }) {
  return (
    <header className="site-header">
      <h1>
        <Link to="/">{siteTitle}</Link>
      </h1>
      <nav>
        <Link to="/">
          <h2>Posts</h2>
        </Link>
      </nav>
    </header>
  );
}
