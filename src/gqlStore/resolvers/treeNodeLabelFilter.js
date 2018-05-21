// @flow
/**
 * This resolver works for both trees
 */
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import clone from 'lodash/clone'
import gql from 'graphql-tag'

export default {
  Mutation: {
    setTreeNodeLabelFilterKey: (_, { tree, key, value }, { cache }) => {
      const data = cache.readQuery({
        query: gql`
            query Query {
              tree @client {
                name
                activeNodeArray
                openNodes
                apFilter
                nodeLabelFilter {
                  ap
                  pop
                  tpop
                  tpopkontr
                  tpopfeldkontr
                  tpopfreiwkontr
                  tpopkontrzaehl
                  tpopmassn
                  ziel
                  zielber
                  erfkrit
                  apber
                  apberuebersicht
                  ber
                  idealbiotop
                  assozart
                  popber
                  popmassnber
                  tpopber
                  tpopmassnber
                  apart
                  projekt
                  beob
                  beobprojekt
                  adresse
                  gemeinde
                }
              }
              tree2 @client {
                name
                activeNodeArray
                openNodes
                apFilter
                nodeLabelFilter {
                  ap
                  pop
                  tpop
                  tpopkontr
                  tpopfeldkontr
                  tpopfreiwkontr
                  tpopkontrzaehl
                  tpopmassn
                  ziel
                  zielber
                  erfkrit
                  apber
                  apberuebersicht
                  ber
                  idealbiotop
                  assozart
                  popber
                  popmassnber
                  tpopber
                  tpopmassnber
                  apart
                  projekt
                  beob
                  beobprojekt
                  adresse
                  gemeinde
                }
              }
            }
          `
      })
      const oldValue = get(data, `${tree}.nodeLabelFilter.${key}`)
      // only write if changed
      if (!isEqual(oldValue, value)) {
        const oldNodeLabelFilter = get(data, `${tree}.nodeLabelFilter`)
        const newNodeLabelFilter = clone(oldNodeLabelFilter)
        newNodeLabelFilter[key] = value
        console.log('resolver for treeNodeLabelFilter: writing data:', {tree,key,value})
        cache.writeData({
          data: {
            [tree]: {
              name: get(data, `${tree}.name`, null),
              activeNodeArray: get(data, `${tree}.activeNodeArray`, null),
              openNodes: get(data, `${tree}.openNodes`, null),
              apFilter: get(data, `${tree}.apFilter`, null),
              nodeLabelFilter: newNodeLabelFilter,
              __typename: tree === 'tree' ? 'Tree' : 'Tree2'
            }
          } 
        })
      }
      return null
    },
  },
}
