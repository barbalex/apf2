// @flow
/**
 * This resolver works for both trees
 */
import get from 'lodash/get'
import upperFirst from 'lodash/upperFirst'
import gql from 'graphql-tag'

export default {
  Mutation: {
    treeNodeLabelFilterResetExceptAp: (_, { tree }, { cache }) => {
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
                }
              }
              tree2 @client {
                name
                activeNodeArray
                openNodes
                apFilter
                nodeLabelFilter {
                  ap
                }
              }
            }
          `
      })
      cache.writeData({
        data: {
          [tree]: {
            name: get(data, `${tree}.name`, null),
            activeNodeArray: get(data, `${tree}.activeNodeArray`, null),
            openNodes: get(data, `${tree}.openNodes`, null),
            apFilter: get(data, `${tree}.apFilter`, null),
            nodeLabelFilter: {
              ap: get(data, `${tree}.nodeLabelFilter.ap`, null),
              pop: null,
              tpop: null,
              tpopkontr: null,
              tpopfeldkontr: null,
              tpopfreiwkontr: null,
              tpopkontrzaehl: null,
              tpopmassn: null,
              ziel: null,
              zielber: null,
              erfkrit: null,
              apber: null,
              apberuebersicht: null,
              ber: null,
              idealbiotop: null,
              assozart: null,
              popber: null,
              popmassnber: null,
              tpopber: null,
              tpopmassnber: null,
              apart: null,
              projekt: null,
              beob: null,
              beobprojekt: null,
              adresse: null,
              gemeinde: null,
              user: null,
              __typename: 'NodeLabelFilter',
            },
            __typename: upperFirst(tree)
          }
        } 
      })
      return null
    },
  },
}
