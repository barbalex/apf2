import gql from 'graphql-tag'

export default gql`
  query ApsQuery($isProjekt: Boolean!, $apFilter: ApFilter!) {
    allAps(filter: $apFilter) @include(if: $isProjekt) {
      totalCount
      nodes {
        id
        projId
        artId
        bearbeitung
        startJahr
        umsetzung
        bearbeiter
        ekfBeobachtungszeitpunkt
        aeEigenschaftenByArtId {
          id
          artname
        }
        apartsByApId {
          nodes {
            id
            artId
          }
        }
      }
    }
  }
`
