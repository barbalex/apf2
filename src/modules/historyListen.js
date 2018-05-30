//@flow
import isEqual from 'lodash/isEqual'
import gql from 'graphql-tag'
import app from 'ampersand-app'

import getActiveNodeArrayFromPathname from './getActiveNodeArrayFromPathname'

export default ( {
  location,
  action,
}:{
  location: Object,
  action: String,
}) => {
  const { pathname, state } = location
  const { client } = app
  //console.log(action, location.pathname, location.state)
  // prevent never ending loop if user clicks back right after initial loading
  if (!(pathname === '/Projekte' && action === 'PUSH')) {
    const activeNodeArray = getActiveNodeArrayFromPathname(pathname)
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
        value: activeNodeArray,
        tree: 'tree',
        key: 'activeNodeArray'
      }
    })
    if (
      state &&
      state.openNodes &&
      // this would prevent single project from opening at first load
      !(state.openNodes.length === 1 && isEqual(state.openNodes[0], ['Projekte']))
    ) {
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
          value: state.openNodes,
          tree: 'tree',
          key: 'openNodes'
        }
      })
    }
  }
}