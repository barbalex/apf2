import { gql } from '@apollo/client'

const currentIssuesNodes = async ({ store }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeCurrentIssuesQuery {
        allCurrentissues(orderBy: [SORT_ASC, TITLE_ASC]) {
          totalCount
          nodes {
            id
            label
          }
        }
      }
    `,
  })

  const currentIssues = data?.allCurrentissues?.nodes ?? []

  // map through all elements and create array of nodes
  const nodes = currentIssues.map((el) => ({
    nodeType: 'table',
    menuType: 'currentIssue',
    id: el.id,
    urlLabel: el.id,
    label: el.label,
    url: ['Aktuelle-Fehler', el.id],
    hasChildren: false,
  }))

  return nodes
}

export default currentIssuesNodes
