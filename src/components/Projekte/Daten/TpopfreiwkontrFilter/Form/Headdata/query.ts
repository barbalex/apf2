import { graphql } from '../../../../../../gql'

export const query = graphql(`
  query TpopfreiwkontrAdressesFilterQuery {
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`)
