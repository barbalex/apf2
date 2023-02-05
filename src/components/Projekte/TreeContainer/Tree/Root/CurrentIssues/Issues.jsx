import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'

import Row from '../../Row'

const CurrentIssuesNode = () => {
  const client = useApolloClient()

  const { data } = useQuery({
    queryKey: ['treeCurrentIssues'],
    queryFn: async () =>
      client.query({
        query: gql`
          query TreeCurrentIssuesQuery {
            allCurrentissues(orderBy: [SORT_ASC, TITLE_ASC]) {
              nodes {
                id
                label
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      }),
  })

  const currentIssues = data?.data?.allCurrentissues?.nodes ?? []
  const nodes = currentIssues.map((el) => ({
    nodeType: 'table',
    menuType: 'currentIssue',
    id: el.id,
    urlLabel: el.id,
    label: el.label,
    url: ['Aktuelle-Fehler', el.id],
    hasChildren: false,
  }))

  return nodes.map((node) => <Row key={node.id} node={node} />)
}

export default CurrentIssuesNode
