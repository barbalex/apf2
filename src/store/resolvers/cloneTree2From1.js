// @flow
/**
 * This resolver is used
 * to copy tree2 from tree1
 */
import get from 'lodash/get'
import gql from 'graphql-tag'

export default {
  Mutation: {
    cloneTree2From1: (_, props, { cache }) => {
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
                map {
                  detailplaene
                }
              }
            }
          `
      })
      // only write if changed
      cache.writeData({
        data: {
          tree2: {
            name: 'tree2',
            activeNodeArray: get(data, 'tree.activeNodeArray'),
            openNodes: get(data, 'tree.openNodes'),
            apFilter: get(data, 'tree.apFilter'),
            nodeLabelFilter: {
              ap: get(data, 'tree.nodeLabelFilter.ap'),
              pop: get(data, 'tree.nodeLabelFilter.pop'),
              tpop: get(data, 'tree.nodeLabelFilter.tpop'),
              tpopkontr: get(data, 'tree.nodeLabelFilter.tpopkontr'),
              tpopfeldkontr: get(data, 'tree.nodeLabelFilter.tpopfeldkontr'),
              tpopfreiwkontr: get(data, 'tree.nodeLabelFilter.tpopfreiwkontr'),
              tpopkontrzaehl: get(data, 'tree.nodeLabelFilter.tpopkontrzaehl'),
              tpopmassn: get(data, 'tree.nodeLabelFilter.tpopmassn'),
              ziel: get(data, 'tree.nodeLabelFilter.ziel'),
              zielber: get(data, 'tree.nodeLabelFilter.zielber'),
              erfkrit: get(data, 'tree.nodeLabelFilter.erfkrit'),
              apber: get(data, 'tree.nodeLabelFilter.apber'),
              apberuebersicht: get(data, 'tree.nodeLabelFilter.apberuebersicht'),
              ber: get(data, 'tree.nodeLabelFilter.ber'),
              idealbiotop: get(data, 'tree.nodeLabelFilter.idealbiotop'),
              assozart: get(data, 'tree.nodeLabelFilter.assozart'),
              popber: get(data, 'tree.nodeLabelFilter.popber'),
              popmassnber: get(data, 'tree.nodeLabelFilter.popmassnber'),
              tpopber: get(data, 'tree.nodeLabelFilter.tpopber'),
              tpopmassnber: get(data, 'tree.nodeLabelFilter.tpopmassnber'),
              apart: get(data, 'tree.nodeLabelFilter.apart'),
              projekt: get(data, 'tree.nodeLabelFilter.projekt'),
              beob: get(data, 'tree.nodeLabelFilter.beob'),
              beobprojekt: get(data, 'tree.nodeLabelFilter.beobprojekt'),
              adresse: get(data, 'tree.nodeLabelFilter.adresse'),
              gemeinde: get(data, 'tree.nodeLabelFilter.gemeinde'),
              __typename: 'NodeLabelFilter'
            },
            map: {
              detailplaene: get(data, 'tree.map.detailplaene'),
              __typename: 'Map'
            },
            __typename: 'Tree2'
          }
        } 
      })
      return null
    },
  },
}
