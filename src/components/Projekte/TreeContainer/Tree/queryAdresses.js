import gql from 'graphql-tag'

export default gql`
  query AdressesDataQuery($isWerteListen: Boolean!, $filter: AdresseFilter!) {
    unfiltered: allAdresses {
      totalCount
    }
    allAdresses(filter: $filter, orderBy: LABEL_ASC)
      @include(if: $isWerteListen) {
      totalCount
      nodes {
        id
        name
        label
      }
    }
  }
`
