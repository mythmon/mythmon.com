const path = require("path");
const moment = require("moment");

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === "MarkdownRemark") {
    if (!node.frontmatter.slug && node.frontmatter.title) {
      const slug = node.title.toLowerCase().replace(/[ .]/g, "-");
      createNodeField({
        node: node.frontmatter,
        name: "slug",
        value: slug,
      });
    }

    if (!node.path) {
      const date = moment(new Date(node.frontmatter.date));
      const dateString = date.format("YYYY-MM-DD");
      const path = `/posts/${dateString}-${node.frontmatter.slug}.html`;
      createNodeField({
        node,
        name: "path",
        value: path,
      });
    }
  }
};

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);

  const result = await graphql(`
    {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
        edges {
          node {
            fields {
              path
            }
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw new Error(result.errors);
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.path,
      component: blogPostTemplate,
      context: {
        slug: node.frontmatter.slug,
      },
    });
  });
};
