import { gql } from '@apollo/client'
import max from 'lodash/max'

const currentIssuesFolderNode = async ({ store }) => {

  const { data, loading } = await store.client.query({
    query: gql`
      query TreeCurrentIssuesFolderQuery {
        allCurrentissues(orderBy: SORT_ASC) {
      totalCount
    }
      }
    `,
  })

  const count = data?.allCurrentissues?.totalCount ?? 0

  let message = loading && !count ? '...' : max([count - 1, 0])

  return [
    {
      nodeType: 'folder',
      menuType: 'currentIssuesFolder',
      id: 'currentIssuesFolder',
      urlLabel: 'Aktuelle-Fehler',
      label: `Aktuelle Fehler (${message})`,
      url: ['Aktuelle-Fehler'],
      hasChildren: count > 0,
    },
  ]
}

export default currentIssuesFolderNode
