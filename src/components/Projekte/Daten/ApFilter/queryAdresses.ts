import { graphql } from '../../../../gql'

export const queryAdresses = graphql(`
  query ApFilterAdressesQuery {
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`)
