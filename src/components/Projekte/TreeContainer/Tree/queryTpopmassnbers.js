import gql from 'graphql-tag'

export default gql`
  query TpopmassnbersQuery($tpop: [UUID!], $isTpop: Boolean!) {
    tpopmassnbers: allTpopmassnbers(
      filter: { tpopId: { in: $tpop } }
      orderBy: JAHR_ASC
    ) @include(if: $isTpop) {
      nodes {
        id
        tpopId
        jahr
        beurteilung
        tpopmassnErfbeurtWerteByBeurteilung {
          id
          text
        }
      }
    }
  }
`
