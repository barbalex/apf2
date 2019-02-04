import gql from 'graphql-tag'

export default gql`
  query AdressesDataQuery($isWerteListen: Boolean!) {
    allAdresses @include(if: $isWerteListen) {
      totalCount
      nodes {
        id
        name
      }
    }
  }
`
