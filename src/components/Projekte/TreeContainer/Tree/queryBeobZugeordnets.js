import gql from 'graphql-tag'

export default gql`
  query BeobZugeordnetsQuery($tpop: [UUID!], $isTpop: Boolean!) {
    allVApbeobs(filter: { tpopId: { in: $tpop } }) @include(if: $isTpop) {
      nodes {
        id
        label
        tpopId
        artId
      }
    }
  }
`
