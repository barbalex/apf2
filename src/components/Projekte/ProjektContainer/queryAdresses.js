import gql from 'graphql-tag'

export default gql`
  query AdressesDataQuery($isWerteListen: Boolean!, $isAdresse: Boolean!) {
    adresses: allAdresses @include(if: $isWerteListen) {
      totalCount
      nodes @include(if: $isAdresse) {
        id
        name
      }
    }
  }
`
