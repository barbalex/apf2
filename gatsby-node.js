/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path')

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const technDokuTemplate = path.resolve(`src/templates/technDokuTemplate.js`)
  const benutzerDokuTemplate = path.resolve(
    `src/templates/benutzerDokuTemplate.js`,
  )

  let resultMd
  try {
    resultMd = await graphql(`
      {
        allMarkdownRemark(sort: { frontmatter: { sort: ASC } }, limit: 1000) {
          edges {
            node {
              frontmatter {
                slug
                typ
              }
            }
          }
        }
      }
    `)
  } catch (error) {
    return error
  }

  const edges = [...resultMd.data.allMarkdownRemark.edges]
  return edges.forEach(({ node }) => {
    if (node.frontmatter.typ === 'technDoku') {
      return createPage({
        path: `/Dokumentation/Benutzer${node.frontmatter.slug}`,
        component: technDokuTemplate,
      })
    } else if (node.frontmatter.typ === 'benutzerDoku') {
      createPage({
        path: `/Dokumentation/Technisch${node.frontmatter.slug}`,
        component: benutzerDokuTemplate,
      })
    } else {
      console.log(
        'gatsby-node, node: NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO!',
        node,
      )
    }
  })
}

// exports.onCreateWebpackConfig = ({ actions }) => {
//   actions.setWebpackConfig({
//     resolve: {
//       fallback: {
//         // md5-hex beginning from v4.0.0 uses node:crypto
//         // webpack v5 does not polyfill for it any more
//         // so need to do that here
//         // see: https://github.com/gatsbyjs/gatsby/issues/32465#issuecomment-884255203
//         // and: https://stackoverflow.com/a/67335037/712005
//         // and: https://github.com/sindresorhus/md5-hex/issues/17
//         'node:crypto': require.resolve('crypto-browserify'),
//       },
//     },
//   })
// }
