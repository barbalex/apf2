import gql from 'graphql-tag'

export default gql`
  query AdressesDataQuery($isWerteListen: Boolean!, $isAdresse: Boolean!) {
    allAdresses @include(if: $isWerteListen) {
      totalCount
      nodes @include(if: $isAdresse) {
        id
        name
      }
    }
  }
`
