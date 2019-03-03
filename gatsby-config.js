module.exports = {
  siteMetadata: {
    title: "mythmon",
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

    {
      resolve: "gatsby-plugin-typography",
      options: {
        pathToConfigModule: "src/utils/typography",
      },
    },

    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "mythmon",
        short_name: "mythmon",
        start_url: "/",
        background_color: "#0000a6",
        theme_color: "#0000a6",
        display: "minimal-ui",
        icon: "images/icon.png",
      },
    },
    "gatsby-plugin-offline",
  ],
};
