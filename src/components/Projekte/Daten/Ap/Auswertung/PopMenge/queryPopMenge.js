import gql from 'graphql-tag'

export default gql`
  query apAuswertungPopMenge($id: UUID!) {
    allVApAuswPopMenges(filter: { apId: { equalTo: $id } }, orderBy: JAHR_ASC) {
      nodes {
        jahr
        values
      }
    }
    allEkzaehleinheits(
      filter: { apId: { equalTo: $id }, zielrelevant: { equalTo: true } }
    ) {
      nodes {
        id
        tpopkontrzaehlEinheitWerteByZaehleinheitId {
          id
          text
        }
      }
    }
    allPops(filter: { apId: { equalTo: $id } }, orderBy: [NR_ASC, NAME_ASC]) {
      nodes {
        id
        nr
        name
      }
    }
  }
`
