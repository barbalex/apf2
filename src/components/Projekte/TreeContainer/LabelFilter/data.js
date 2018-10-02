// @flow
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

export default graphql(gql`
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
        ekfzaehleinheit
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
        user
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
        ekfzaehleinheit
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
        user
      }
    }
  }
`)
