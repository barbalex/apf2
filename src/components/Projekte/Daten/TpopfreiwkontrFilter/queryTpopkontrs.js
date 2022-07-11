import { gql } from '@apollo/client'

export default gql`
  query tpopkontrQueryForEkfFilter(
    $filteredFilter: TpopkontrFilter!
    $allFilter: TpopkontrFilter!
  ) {
    allTpopkontrs(filter: $allFilter)  {
      totalCount
    }
    tpopkontrsFiltered: allTpopkontrs(filter: $filteredFilter)
      {
      totalCount 
    }
  }
`
