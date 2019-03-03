import React from "react";
import { Helmet } from "react-helmet";
import { Link, graphql } from "gatsby";

import Layout from "../components/Layout";
import PostHeader from "../components/PostHeader";

export default function IndexPage({ data }) {
  const posts = data.allMarkdownRemark.edges.map(e => e.node);
  return (
    <Layout>
      <Helmet title={"Posts ~ mythmon"} />

      {posts.map(post => (
        <div key={post.id} className="post">
          <PostHeader post={post} link={true} heading="h2" />
          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          <Link className="read-more" to={`/${post.frontmatter.slug}`}>
            read more
          </Link>
        </div>
      ))}
    </Layout>
  );
}

export const pageQuery = graphql`
  query BlogPostList {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
      edges {
        node {
          id
          fields {
            path
          }
          frontmatter {
            tags
            title
            slug
            date
          }
          excerpt(pruneLength: 1000, format: HTML)
        }
      }
    }
  }
`;
