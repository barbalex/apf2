import gql from 'graphql-tag'

export default gql`
  query tpopByIdQuery($id: UUID!, $showFilter: Boolean!) {
    tpopById(id: $id) {
      id
      popId
      nr
      gemeinde
      flurname
      x
      y
      radius
      hoehe
      exposition
      klima
      neigung
      beschreibung
      katasterNr
      status
      popStatusWerteByStatus {
        id
        text
      }
      statusUnklarGrund
      apberRelevant
      tpopApberrelevantWerteByApberRelevant {
        id
        text
      }
      bekanntSeit
      eigentuemer
      kontakt
      nutzungszone
      bewirtschafter
      bewirtschaftung
      kontrollfrequenz
      kontrollfrequenzFreiwillige
      bemerkungen
      statusUnklar
      popByPopId {
        id
        apId
        apByApId {
          id
          startJahr
        }
      }
    }
    allTpops @include(if: $showFilter) {
      nodes {
        id
        popId
        nr
        gemeinde
        flurname
        x
        y
        radius
        hoehe
        exposition
        klima
        neigung
        beschreibung
        katasterNr
        status
        statusUnklarGrund
        apberRelevant
        bekanntSeit
        eigentuemer
        kontakt
        nutzungszone
        bewirtschafter
        bewirtschaftung
        kontrollfrequenz
        kontrollfrequenzFreiwillige
        bemerkungen
        statusUnklar
      }
    }
    allPopStatusWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
    allTpopApberrelevantWertes {
      nodes {
        id
        code
        text
      }
    }
    allTpopkontrFrequenzWertes {
      nodes {
        id
        code
        text
      }
    }
    allGemeindes {
      nodes {
        id
        name
      }
    }
  }
`
