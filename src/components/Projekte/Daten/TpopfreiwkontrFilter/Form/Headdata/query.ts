import { graphql } from '../../../../../../gql/index.ts'

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
