import { graphql } from '../../../../gql/index.ts'

export const query = graphql(`
  query tpopkontrQueryForEkfFilter(
    $filteredFilter: TpopkontrFilter!
    $allFilter: TpopkontrFilter!
  ) {
    allTpopkontrs(filter: $allFilter) {
      totalCount
    }
    tpopkontrsFiltered: allTpopkontrs(filter: $filteredFilter) {
      totalCount
    }
  }
`)
