import React from "react";
import { Link } from "gatsby";

export default function PostHeader({ post, link = false, Heading = "h1" }) {
  return (
    <header>
      <Heading>
        {link ? (
          <Link to={post.fields.path}>{post.frontmatter.title}</Link>
        ) : (
          post.frontmatter.title
        )}
      </Heading>
      <div className="subheader">
        <time dateTime={new Date(post.frontmatter.date).toString()}>
          {new Date(post.frontmatter.date).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        <Tags tags={post.frontmatter.tags} />
      </div>
    </header>
  );
}

function Tags({ tags }) {
  return (
    <>
      <ul className="tags">
        {tags.map(tag => (
          <li key={tag} className="tag">
            {tag}
          </li>
        ))}
      </ul>
    </>
  );
}
