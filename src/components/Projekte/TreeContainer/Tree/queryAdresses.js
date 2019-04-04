import gql from 'graphql-tag'

export default gql`
  query AdressesDataQuery($isWerteListen: Boolean!) {
    allAdresses(orderBy: LABEL_ASC) @include(if: $isWerteListen) {
      totalCount
      nodes {
        id
        name
        label
      }
    }
  }
`
