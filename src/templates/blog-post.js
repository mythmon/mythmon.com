import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import PostHeader from "../components/PostHeader";

// import '../css/blog-post.css';

export default function Template({ data }) {
  const { markdownRemark: post } = data;
  return (
    <>
      <Helmet title={`${post.frontmatter.title} ~ mythmon`} />
      <Layout className="post-page">
        <div className="post">
          <PostHeader post={post} />
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </Layout>
    </>
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
