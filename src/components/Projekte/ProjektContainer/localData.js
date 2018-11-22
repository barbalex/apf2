import gql from 'graphql-tag'

export default gql`
  query LocalDataQuery {
    assigningBeob @client
    tree @client {
      name
      activeNodeArray
      openNodes
      apFilter
      map {
        detailplaene
      }
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
      map {
        detailplaene
      }
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
    copyingBiotop @client {
      id
    }
    moving @client {
      table
      id
      label
    }
    urlQuery @client {
      projekteTabs
      feldkontrTab
    }
  }
`
