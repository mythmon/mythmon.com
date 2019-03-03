import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import PostHeader from "../components/PostHeader";

// import '../css/blog-post.css';

export default function Template({ data }) {
  const { markdownRemark: post } = data;
  return (
    <div className="post">
      <Helmet title={`${post.frontmatter.title} ~ mythmon`} />
      <Layout>
        <PostHeader post={post} />
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.html }} />
      </Layout>
    </div>
  );
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date
        slug
        title
        tags
      }
    }
  }
`;
