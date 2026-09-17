import { graphql } from '../../../../../../gql/index.ts'

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
