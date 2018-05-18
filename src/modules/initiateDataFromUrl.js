// @flow
import clone from 'lodash/clone'
import gql from 'graphql-tag'

import getActiveNodeArrayFromPathname from './getActiveNodeArrayFromPathname'
import getUrlQuery from '../modules/getUrlQuery'
import isMobilePhone from '../modules/isMobilePhone'
import setUrlQueryValue from '../modules/setUrlQueryValue'

export default (store: Object, client: Object) => {
  const activeNodeArrayFromPathname = getActiveNodeArrayFromPathname()
  let initialActiveNodeArray = clone(activeNodeArrayFromPathname)

  // forward apflora.ch to Projekte
  if (activeNodeArrayFromPathname.length === 0) {
    initialActiveNodeArray.push('Projekte')
  }
  
  //store.tree.setActiveNodeArray(initialActiveNodeArray)
  console.log('initiateDataFromUrl 1')
  client.mutate({
    mutation: gql`
      mutation setTreeActiveNodeArray($value: Array!) {
        setTreeActiveNodeArray(value: $value) @client {
          tree @client {
            activeNodeArray
            __typename: Tree
          }
        }
      }
    `,
    variables: { value: initialActiveNodeArray }
  })
  console.log('initiateDataFromUrl 2')
  // need to set openNodes
  store.tree.setOpenNodesFromActiveNodeArray()
  // clone tree2 in case tree2 is open
  store.tree.cloneActiveNodeArrayToTree2()
  const urlQuery = getUrlQuery()
  const { projekteTabs, feldkontrTab } = urlQuery
  console.log('initiateDataFromUrl:', { initialActiveNodeArray, urlQuery, projekteTabs, feldkontrTab })
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
