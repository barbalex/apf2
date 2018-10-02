import gql from 'graphql-tag'

export default gql`
  query ApberuebersichtQuery($projekt: [UUID!], $isProjekt: Boolean!) {
    apberuebersichts: allApberuebersichts(
      filter: { projId: { in: $projekt } }
      orderBy: JAHR_ASC
    ) @include(if: $isProjekt) {
      nodes {
        id
        projId
        jahr
      }
    }
  }
`
