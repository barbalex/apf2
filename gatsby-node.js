/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path")

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const technDokuTemplate = path.resolve(`src/templates/technDokuTemplate.js`)
  const benutzerDokuTemplate = path.resolve(
    `src/templates/benutzerDokuTemplate.js`
  )

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: ASC, fields: [frontmatter___sort] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
              typ
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const { edges } = result.data.allMarkdownRemark
    edges.forEach(({ node }) => {
      if (node.frontmatter.typ === "technDoku") {
        return createPage({
          path: node.frontmatter.path,
          component: technDokuTemplate,
        })
      } else if (node.frontmatter.typ === "benutzerDoku") {
        createPage({
          path: node.frontmatter.path,
          component: benutzerDokuTemplate,
        })
      } else {
        console.log(
          "gatsby-node, node: NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO!",
          node
        )
      }
    })
  })
}
