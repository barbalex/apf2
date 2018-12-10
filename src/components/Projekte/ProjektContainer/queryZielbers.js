import gql from 'graphql-tag'

export default gql`
  query ZielbersQuery($ziel: [UUID!], $isZiel: Boolean!) {
    zielbers: allZielbers(filter: { zielId: { in: $ziel } }, orderBy: JAHR_ASC)
      @include(if: $isZiel) {
      nodes {
        id
        zielId
        jahr
        erreichung
      }
    }
  }
`
