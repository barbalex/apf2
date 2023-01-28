import { gql } from '@apollo/client'

const projektNodes = async ({ store }) => {
  const { client } = store

  const { data, loading } = await client.query({
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

  // map through all elements and create array of nodes
  const nodes = projekts
    // is already sorted by name
    .map((el, index) => ({
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
  console.log('projectNodes', { projekts, loading, nodes })

  return nodes

  // return [
  //   {
  //     id: 'e57f56f4-4376-11e8-ab21-4314b6749d13',
  //     label: 'label',
  //     type: 'project',
  //     object: {},
  //     url: ['Projekte', 1],
  //     children: [],
  //     childrenCount: 0,
  //   },
  // ]
}

export default projektNodes
