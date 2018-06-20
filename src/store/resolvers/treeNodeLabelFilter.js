// @flow
/**
 * This resolver works for both trees
 */
import get from 'lodash/get'
import upperFirst from 'lodash/upperFirst'
import gql from 'graphql-tag'

export default {
  Mutation: {
    setTreeNodeLabelFilter: (_, {
      tree,
      ap,
      pop,
      tpop,
      tpopkontr,
      tpopfeldkontr,
      tpopfreiwkontr,
      tpopkontrzaehl,
      tpopmassn,
      ziel,
      zielber,
      erfkrit,
      apber,
      apberuebersicht,
      ber,
      idealbiotop,
      assozart,
      popber,
      popmassnber,
      tpopber,
      tpopmassnber,
      apart,
      projekt,
      beob,
      beobprojekt,
      adresse,
      gemeinde,
      user,
    }, { cache }) => {
      const data = cache.readQuery({
        query: gql`
            query Query {
              tree @client {
                name
                activeNodeArray
                openNodes
                apFilter
              }
              tree2 @client {
                name
                activeNodeArray
                openNodes
                apFilter
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
              ap,
              pop,
              tpop,
              tpopkontr,
              tpopfeldkontr,
              tpopfreiwkontr,
              tpopkontrzaehl,
              tpopmassn,
              ziel,
              zielber,
              erfkrit,
              apber,
              apberuebersicht,
              ber,
              idealbiotop,
              assozart,
              popber,
              popmassnber,
              tpopber,
              tpopmassnber,
              apart,
              projekt,
              beob,
              beobprojekt,
              adresse,
              gemeinde,
              user,
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
