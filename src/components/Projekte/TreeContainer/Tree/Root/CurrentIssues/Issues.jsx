import { useQuery } from '@tanstack/react-query'
import { useApolloClient, gql } from '@apollo/client'

import { Row } from '../../Row.jsx'
import { createCurrentissuesQuery } from '../../../../../../modules/createCurrentissuesQuery.js'

export const Issues = () => {
  const apolloClient = useApolloClient()

  const { data } = useQuery(createCurrentissuesQuery({ apolloClient }))

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

  return nodes.map((node) => (
    <Row
      key={node.id}
      node={node}
    />
  ))
}
