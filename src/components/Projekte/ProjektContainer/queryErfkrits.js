import gql from 'graphql-tag'

export default gql`
  query ErfkritsQuery($ap: [UUID!], $isAp: Boolean!) {
    erfkrits: allErfkrits(filter: { apId: { in: $ap } }) @include(if: $isAp) {
      nodes {
        id
        apId
        kriterien
        erfolg
        apErfkritWerteByErfolg {
          id
          text
          sort
        }
      }
    }
  }
`
