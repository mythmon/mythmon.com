/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { Helmet } from "react-helmet";

import Header from "./Header";
import Footer from "./Footer";
import icon from "../../images/icon.png";
import "../css/base.css";

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet link={[{ rel: "shortcut icon", type: "image/png", href: `${icon}` }]} />
        <div id="wrap">
          <Header siteTitle={data.site.siteMetadata.title} />
          <div id="content">
            <main>{children}</main>
          </div>
          <Footer />
        </div>
      </>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
