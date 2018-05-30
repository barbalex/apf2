// @flow
import clone from 'lodash/clone'
import gql from 'graphql-tag'

import getActiveNodeArrayFromPathname from './getActiveNodeArrayFromPathname'
import getUrlQuery from '../modules/getUrlQuery'
import isMobilePhone from '../modules/isMobilePhone'
import setUrlQueryValue from '../modules/setUrlQueryValue'
import setOpenNodesFromActiveNodeArray from '../modules/setOpenNodesFromActiveNodeArray'

export default (store: Object, client: Object) => {
  const activeNodeArrayFromPathname = getActiveNodeArrayFromPathname(
    window.location.pathname.replace('/', '')
  )
  let initialActiveNodeArray = clone(activeNodeArrayFromPathname)

  // forward apflora.ch to Projekte
  if (activeNodeArrayFromPathname.length === 0) {
    initialActiveNodeArray.push('Projekte')
  }
  
  client.mutate({
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
      key: 'activeNodeArray'
    }
  })
  // need to set openNodes
  setOpenNodesFromActiveNodeArray({ client, activeNodeArray: initialActiveNodeArray })
  // clone tree2 in case tree2 is open
  client.mutate({
    mutation: gql`
       mutation cloneTree2From1 {
        cloneTree2From1 @client
      }
    `
  })
  const urlQuery = getUrlQuery()
  const { projekteTabs, feldkontrTab } = urlQuery
  client.mutate({
    mutation: gql`
      mutation setUrlQuery($projekteTabs: Array!, $feldkontrTab: String!) {
        setUrlQuery(projekteTabs: $projekteTabs, feldkontrTab: $feldkontrTab) @client {
          projekteTabs
          feldkontrTab
        }
      }
    `,
    variables: { projekteTabs, feldkontrTab }
  })

  // set projekte tabs of not yet existing
  /**
   * TODO
   * SHOULD BE TURNED OFF BECAUSE:
   * causes reloading login component after login!!!???
   */
  
  if (
    (activeNodeArrayFromPathname.length === 0 ||
      activeNodeArrayFromPathname[0] === 'Projekte') &&
    (!urlQuery.projekteTabs ||
      !urlQuery.projekteTabs.length ||
      urlQuery.projekteTabs.length === 0)
  ) {
    if (isMobilePhone()) {
      setUrlQueryValue({ client, key: 'projekteTabs', value: ['tree'] })
    } else {
      setUrlQueryValue({ client, key: 'projekteTabs', value: ['tree', 'daten'] })
    }
  }

  // signal to autorun that store is initiated
  // i.e. history shall be manipulated
  // on changes to urlQuery and activeNodes
  //store.initiated = true

}
