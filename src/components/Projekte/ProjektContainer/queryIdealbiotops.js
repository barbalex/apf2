import gql from 'graphql-tag'

export default gql`
  query IdealbiotopsQuery($ap: [UUID!], $isAp: Boolean!) {
    idealbiotops: allIdealbiotops(filter: { apId: { in: $ap } })
      @include(if: $isAp) {
      nodes {
        id
        apId
      }
    }
  }
`
