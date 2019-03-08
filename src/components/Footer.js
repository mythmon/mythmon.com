import React from "react";

export default function Footer({ siteTitle }) {
  return (
    <footer>
      <p>
        © {new Date().getFullYear()}, Built with <a href="https://www.gatsbyjs.org">Gatsby</a>,
        Source on <a href="https://github.com/mythmon/mythmon.com">Github</a>.
      </p>
      <iframe
        style={{ width: "100%", maxWidth: 800, height: 60 }}
        title="webring-nav"
        src="https://abelian.now.sh/embed/"
        frameBorder="no"
        scrolling="no"
      />
    </footer>
  );
}
