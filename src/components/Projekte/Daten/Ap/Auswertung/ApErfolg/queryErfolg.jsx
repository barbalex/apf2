import { gql } from '@apollo/client'

export default gql`
  query apAuswertungErfolg($id: UUID!) {
    allApbers(
      filter: { apId: { equalTo: $id }, beurteilung: { in: [1, 3, 4, 5, 6] } }
      orderBy: JAHR_ASC
    ) {
      nodes {
        id
        jahr
        beurteilung
        apErfkritWerteByBeurteilung {
          id
          text
        }
      }
    }
  }
`
