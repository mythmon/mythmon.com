module.exports = {
  siteMetadata: {
    title: "mythmon.com",
    description: "mythmon's personal website and block",
    author: "@mythmon",
  },

  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-catch-links",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        footnotes: false,
        path: `${__dirname}/posts`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        excerpt_separator: "<!-- fold -->",
        plugins: [
          "gatsby-remark-autolink-headers",
          {
            resolve: `gatsby-remark-images`,
            options: { maxWidth: 590 },
          },
        ],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/images`,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",

    // {
    //   resolve: "gatsby-plugin-manifest",
    //   options: {
    //     name: "gatsby-starter-default",
    //     short_name: "starter",
    //     start_url: "/",
    //     background_color: "#663399",
    //     theme_color: "#663399",
    //     display: "minimal-ui",
    //     icon: "src/images/gatsby-icon.png", // This path is relative to the root of the site.
    //   },
    // },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
  ],
};
