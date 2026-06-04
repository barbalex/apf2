import { gql } from '@apollo/client'

export const queryTpops = gql`
  query tpopsQuery($filteredFilter: TpopFilter!, $allFilter: TpopFilter!) {
    allTpops(filter: $allFilter) {
      totalCount
    }
    allTpopsFiltered: allTpops(filter: $filteredFilter) {
      totalCount
    }
  }
`
