// @flow
import gql from 'graphql-tag'

import getActiveNodeArrayFromPathname from './getActiveNodeArrayFromPathname'
import getUrlQuery from '../modules/getUrlQuery'
import isMobilePhone from '../modules/isMobilePhone'
import setUrlQueryValue from '../modules/setUrlQueryValue'
import setOpenNodesFromActiveNodeArray from '../modules/setOpenNodesFromActiveNodeArray'

export default async ({ activeNodeArray: activeNodeArrayPassed, client }) => {
  const activeNodeArrayFromPathname =
    activeNodeArrayPassed || getActiveNodeArrayFromPathname()
  let initialActiveNodeArray = [...activeNodeArrayFromPathname]
  // fetch query here, BEFORE mutating active node array
  const urlQuery = getUrlQuery()

  // forward apflora.ch to Projekte
  if (activeNodeArrayFromPathname.length === 0) {
    initialActiveNodeArray.push('Projekte')
  }
  await client.mutate({
    mutation: gql`
      mutation setTreeKey($value: Array!, $tree: String!, $key: String!) {
        setTreeKey(tree: $tree, key: $key, value: $value) @client {
          tree @client {
            name
            activeNodeArray
            openNodes
            apFilter
            nodeLabelFilter
            __typename: Tree
          }
        }
      }
    `,
    variables: {
      value: initialActiveNodeArray,
      tree: 'tree',
      key: 'activeNodeArray',
    },
  })
  // need to set openNodes
  setOpenNodesFromActiveNodeArray({
    activeNodeArray: initialActiveNodeArray,
    client,
  })
  // clone tree2 in case tree2 is open
  await client.mutate({
    mutation: gql`
      mutation cloneTree2From1 {
        cloneTree2From1 @client
      }
    `,
  })
  const { projekteTabs, feldkontrTab } = urlQuery
  await client.mutate({
    mutation: gql`
      mutation setUrlQuery($projekteTabs: Array!, $feldkontrTab: String!) {
        setUrlQuery(projekteTabs: $projekteTabs, feldkontrTab: $feldkontrTab)
          @client {
          projekteTabs
          feldkontrTab
        }
      }
    `,
    variables: { projekteTabs, feldkontrTab },
  })

  // set projekte tabs of not yet existing
  if (
    (activeNodeArrayFromPathname.length === 0 ||
      activeNodeArrayFromPathname[0] === 'Projekte') &&
    (!urlQuery.projekteTabs ||
      !urlQuery.projekteTabs.length ||
      urlQuery.projekteTabs.length === 0)
  ) {
    if (isMobilePhone()) {
      setUrlQueryValue({ key: 'projekteTabs', value: ['tree'], client })
    } else {
      setUrlQueryValue({
        key: 'projekteTabs',
        value: ['tree', 'daten'],
        client,
      })
    }
  }
}
