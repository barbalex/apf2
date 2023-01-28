import { gql } from '@apollo/client'

const projektNodes = async ({ store }) => {
  const { client } = store

  const { data } = await client.query({
    query: gql`
      query TreeAllQuery {
        allProjekts(orderBy: NAME_ASC) {
          nodes {
            id
            label
          }
        }
      }
    `,
    variables: { id: 1 },
  })
  const projekts = data?.allProjekts?.nodes ?? []

  const nodes = projekts.map((el, index) => ({
    nodeType: 'table',
    menuType: 'projekt',
    filterTable: 'projekt',
    id: el.id,
    urlLabel: el.id,
    label: el.label,
    url: ['Projekte', el.id],
    sort: [index],
    hasChildren: true,
  }))

  return nodes
}

export default projektNodes
