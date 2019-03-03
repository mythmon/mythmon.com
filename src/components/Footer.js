import React from "react";

export default function Footer({ siteTitle }) {
  return (
    <footer>
      <p>
        © {new Date().getFullYear()}, Built with <a href="https://www.gatsbyjs.org">Gatsby</a>,
        Source on <a href="https://github.com/mythmon/mythmon.com">Github</a>.
      </p>
      <p>
        Last generated:{" "}
        {new Date().toLocaleString(undefined, {
          hour12: false,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        })}
      </p>
    </footer>
  );
}
