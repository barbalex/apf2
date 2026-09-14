import { graphql } from '../../../../../../gql'

export const query = graphql(`
  query TpopfreiwkontrAdressesQuery {
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`)
